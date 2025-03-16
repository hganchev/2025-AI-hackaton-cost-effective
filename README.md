# Book Translation & Sharing Platform

![Book Translation App Screenshot](book-translate-share-app.PNG)

## Project Overview

This application provides an AI-powered book translation platform that allows users to upload books in various formats and have them translated into different languages using state-of-the-art machine learning models. The system extracts text content from the uploaded documents, processes it in manageable chunks, and applies neural machine translation to produce high-quality translations.

### Key Features

- **Multi-format Support**: Upload and translate books in PDF, EPUB, TXT, DOCX, HTML, and Markdown formats
- **ML-powered Translation**: Utilizes Hugging Face transformers for high-quality neural machine translation
- **Multiple Language Support**: Supports translation between various language pairs
- **Paginated Processing**: Handles large documents by breaking them into manageable chunks
- **RESTful API**: Comprehensive API for integration with other applications
- **Modern Web Interface**: Clean, responsive frontend built with Next.js and Tailwind CSS

## Tech Stack

### Backend (Artificial Intelligence Service)

- **Framework**: Django 5.1.7
- **API**: Django Ninja (FastAPI-inspired REST framework)
- **ML Libraries**:
  - Hugging Face Transformers
  - PyTorch
- **Document Processing**:
  - PyPDF2 (PDF extraction)
  - EbookLib (EPUB handling)
  - python-docx (DOCX processing)
  - BeautifulSoup4 (HTML parsing)
  - Markdown (Markdown processing)
- **Database**: SQLite (for development)
- **Containerization**: Docker

### Frontend 

- **Framework**: Next.js 14.1.0
- **UI Components**: Custom components with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **TypeScript**: For type safety and improved developer experience

### DevOps

- **Containerization**: Docker
- **Orchestration**: Docker Compose

## Architecture

The application follows a microservices architecture with:

1. **AI Service** (Django): Handles document processing, ML translation, and API endpoints
2. **Backend Service**: Manages user authentication, book sharing, and overall business logic
3. **Frontend Service**: Provides the user interface for interacting with the application

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/2025-AI-hackaton-cost-effective.git
cd 2025-AI-hackaton-cost-effective
```

2. Start the application:
```bash
docker-compose up
```

3. Access the application at `http://localhost:3000`

## API Documentation

The API documentation is available at `/api/docs` once the application is running.

## Future Enhancements

- Implement user authentication and authorization
- Add support for more language pairs
- Improve translation quality with fine-tuned models
- Implement real-time translation progress updates
- Add collaborative features for shared translations