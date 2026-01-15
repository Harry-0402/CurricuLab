#!/bin/bash

# 1. Start Python RAG Service (Background)
echo "Starting Python RAG Service..."
cd /app/rag-system/python-service
uvicorn main:app --host 0.0.0.0 --port 8000 &

# 2. Start Node.js Backend (Foreground - Main Process)
echo "Starting Node.js Backend..."
cd /app/rag-system/node-backend
node server.js
