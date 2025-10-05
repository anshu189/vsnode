import json
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_dag(nodes, edges):
    # Adjacency list
    graph = {node["id"]: [] for node in nodes}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if source and target:
            graph[source].append(target)
    visited = set()  # all explored nodes
    visiting = set()    # nodes currently visiting on current path

    def dfs(node):
        if node in visiting:
            return True  # cycle found
        if node in visited:
            return False 

        visiting.add(node)
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        visiting.remove(node)
        visited.add(node)
        return False

    for node in graph:
        if dfs(node):
            return False  # Not a DAG
    return True  # DAG


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        data = json.loads(pipeline)
        nodes = data.get("nodes", [])
        edges = data.get("edges", [])
        dag_result = is_dag(nodes, edges)
        
        return {
            "status": "success",
            "num_nodes": len(nodes),
            "num_edges": len(edges),
            "is_dag": dag_result
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    