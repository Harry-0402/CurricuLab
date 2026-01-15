# === Stage 1: Base Image (Python + Node) ===
FROM python:3.11-slim as base

# Install Node.js
RUN apt-get update && apt-get install -y curl build-essential libgl1-mesa-glx
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Cleanup
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app

# === Stage 2: Python Backend Setup ===
COPY rag-system/python-service/requirements.txt ./rag-system/python-service/
RUN pip install --no-cache-dir -r rag-system/python-service/requirements.txt

# === Stage 3: Node Backend & Frontend Setup ===
# Copy all package.json files first for caching
COPY package.json package-lock.json ./
COPY rag-system/node-backend/package.json ./rag-system/node-backend/

# Install Root Dependencies (Frontend)
RUN npm ci

# Install Node Backend Dependencies
cd rag-system/node-backend && npm install && cd ../..

# Copy Full Source Code
COPY . .

# Build Next.js Frontend
RUN npm run build

# Make startup script executable
RUN chmod +x start.sh

# Expose Main Port (Render usually matches the frontend port)
EXPOSE 3000
EXPOSE 4000
EXPOSE 8000

# Environment config
ENV NEXT_PUBLIC_RAG_API_URL=http://localhost:4000
ENV PYTHON_SERVICE_URL=http://localhost:8000
ENV PORT=3000

# Start All Services
CMD ["./start.sh"]
