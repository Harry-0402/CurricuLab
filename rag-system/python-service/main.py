from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rag_engine import RAGEngine
import uvicorn
import os

app = FastAPI()

# Initialize RAG Engine
rag = RAGEngine()

class ProcessRequest(BaseModel):
    fileId: str
    filePath: str
    userId: str
    originalName: str

class QueryRequest(BaseModel):
    userId: str
    query: str

@app.on_event("startup")
async def startup_event():
    print("Starting RAG Python Service...")

@app.post("/process")
async def process_file(request: ProcessRequest):
    try:
        # Check if file exists (path passed from Node)
        if not os.path.exists(request.filePath):
            raise HTTPException(status_code=404, detail="File not found")
            
        result = rag.ingest_file(
            request.filePath, 
            request.fileId, 
            request.userId, 
            request.originalName
        )
        return result
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_rag(request: QueryRequest):
    try:
        response = rag.query(request.userId, request.query)
        return response
    except Exception as e:
        print(f"Error querying RAG: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
