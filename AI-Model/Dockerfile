FROM python:3.9-slim

WORKDIR /app

# Install system dependencies if any (e.g., for numpy/scipy compilation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port (if app.py runs a server, usually 5001 based on your config)
EXPOSE 5001

# Command to run the application (assuming app.py is the entry point)
CMD ["python", "app.py"]
