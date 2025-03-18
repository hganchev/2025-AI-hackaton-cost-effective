FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies required for sentencepiece and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    g++ \
    gcc \
    git \
    pkg-config \
    libprotobuf-dev \
    protobuf-compiler \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir sentencepiece transformers torch

# Copy project files
COPY . .

# Create media directories
RUN mkdir -p /app/media/books
RUN mkdir -p /app/media/translations
RUN mkdir -p /app/ml_models

# Expose port
EXPOSE 8000

# Run migrations and start server
CMD python manage.py migrate