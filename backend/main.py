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

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        data = json.loads(pipeline)
        nodes = data.get("nodes", [])
        edges = data.get("edges", [])
        return {
            "status": "success",
            "num_nodes": len(nodes),
            "num_edges": len(edges),
            "is_dag": True  # Placeholder for actual DAG check
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
