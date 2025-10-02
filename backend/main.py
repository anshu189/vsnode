import json
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    """
    pipeline will be received as a JSON string inside a form field.
    """
    try:
        data = json.loads(pipeline)
        nodes = data.get("nodes", [])
        edges = data.get("edges", [])
        return {
            "status": "parsed",
            "num_nodes": len(nodes),
            "num_edges": len(edges)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
