# ===========================================
# render.yaml - Render Deployment Config
# ===========================================
services:
  - type: web
    name: learnmate-ai
    env: python
    plan: free
    buildCommand: |
      pip install --upgrade pip
      pip install -r requirements.txt
      python train_models.py
    startCommand: gunicorn -w 4 -b 0.0.0.0:$PORT app:app --timeout 120
    envVars:
      - key: PYTHON_VERSION
        value: 3.10.0
      - key: PORT
        value: 5000
    healthCheckPath: /health
    autoDeploy: true

# ===========================================
# Dockerfile - Docker Deployment
# ===========================================
---
FROM: python:3.10-slim

WORKDIR: /app

# Install system dependencies
RUN: apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY: requirements.txt .
RUN: pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY: . .

# Create necessary directories
RUN: mkdir -p models/saved data

# Train models during build
RUN: python train_models.py

# Expose port
EXPOSE: 5000

# Health check
HEALTHCHECK: --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run application
CMD: ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-"]

# ===========================================
# .dockerignore
# ===========================================
---
__pycache__
*.pyc
*.pyo
*.pyd
.Python
venv/
env/
*.log
.git
.gitignore
README.md
tests/
.vscode/
.idea/

# ===========================================
# .gitignore
# ===========================================
---
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
ENV/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Models and Data (regenerated during deployment)
models/saved/*.pkl
data/*.csv

# Logs
*.log
logs/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local

# ===========================================
# Procfile - Heroku Deployment
# ===========================================
---
web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app --timeout 120

# ===========================================
# nginx.conf - Nginx Reverse Proxy Config
# ===========================================
---
upstream learnmate_ai {
    server 127.0.0.1:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://learnmate_ai;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    location /health {
        proxy_pass http://learnmate_ai/health;
        access_log off;
    }
}

# ===========================================
# systemd Service - Linux Server
# ===========================================
---
[Unit]
Description=LearnMate AI Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/learnmate-ai
Environment="PATH=/var/www/learnmate-ai/venv/bin"
ExecStart=/var/www/learnmate-ai/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app --timeout 120
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

# ===========================================
# docker-compose.yml - Docker Compose
# ===========================================
---
version: '3.8'

services:
  learnmate-ai:
    build: .
    container_name: learnmate-ai
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - FLASK_ENV=production
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s