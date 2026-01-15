# === Stage 1: Base Image (Python + Node) ===
FROM python:3.11-slim as base

# Install Node.js & System Deps
RUN apt-get update && apt-get install -y curl build-essential libgl1 libglib2.0-0
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Cleanup
RUN rm -rf /var/lib/apt/lists/*

WORKDIR /app

# === Stage 2: Python Backend Setup ===
COPY rag-system/python-service/requirements.txt ./rag-system/python-service/
RUN pip install --no-cache-dir -r rag-system/python-service/requirements.txt

# === Stage 3: Node Backend Setup ===
COPY package.json package-lock.json ./
COPY rag-system/node-backend/package.json ./rag-system/node-backend/

# Install Node Backend Dependencies
RUN cd rag-system/node-backend && npm install && cd ../..

# Copy Full Source Code
COPY . .

# Make startup script executable
RUN chmod +x start.sh

# Expose Node Backend Port (Main Entry)
EXPOSE 4000
# Expose Python Port (Internal)
EXPOSE 8000

# Environment config
ENV PORT=4000
# Python is local to this container
ENV PYTHON_SERVICE_URL=http://localhost:8000 

# Start Backends Only
CMD ["./start.sh"]
