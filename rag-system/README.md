# RAG File Upload System

This is a local, privacy-focused RAG system for "LearnPilot". It allows uploading documents (PDF, PPTX, DOCX, etc.) and querying them using local embeddings.

## 📂 Folder Structure
- `node-backend/`: Express server for file uploads & validation.
- `python-service/`: FastAPI service for RAG logic (Parsing, ChromaDB, Embeddings).

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 2. Setup Python Service (The Brain)
```bash
cd rag-system/python-service

# Create venv
python -m venv venv

# Activate venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Setup Node.js Backend (The Gatekeeper)
```bash
cd rag-system/node-backend
npm install
```

## ▶️ Running the System

**Terminal 1 (Python Service)**
```bash
cd rag-system/python-service
venv\Scripts\activate
python main.py
# Runs on http://localhost:8000
```

**Terminal 2 (Node.js Backend)**
```bash
cd rag-system/node-backend
node server.js
# Runs on http://localhost:4000
```

## 🧪 Testing with cURL

### 1. Upload a File
Replace `path/to/doc.pdf` with a real file.
```bash
curl -X POST http://localhost:4000/upload \
  -F "file=@/path/to/your/document.pdf" \
  -F "userId=user123"
```
*Expected Response:*
```json
{
  "status": "success",
  "fileId": "uuid-filename.pdf",
  "stats": { "chunks_count": 45, ... }
}
```

### 2. Chat / Query
```bash
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "message": "Summarize the document"}'
```
*Expected Response:*
```json
{
  "answer": "Based on your uploaded documents...",
  "sources": ["document.pdf"]
}
```

## ⚠️ Troubleshooting

1.  **"Module not found" in Python**: Ensure you activated the virtual environment (`venv\Scripts\activate`) before running `main.py`.
2.  **"ChromaDB Error"**: If you get SQLite errors, ensure the `vector_db` folder in `python-service` is writable.
3.  **"Connection Refused"**: Ensure Python is running on port 8000 before starting Node on port 4000.
4.  **Parsing Errors**: If a specific PDF fails, check if it's encrypted or image-only (this implementation relies on text layers).
