# Book Translator API

A Django application with Django Ninja API that provides ML-based book translation capabilities. This application can translate books provided via URL or uploaded files.

## Features

- Translate books from URLs or uploaded files
- REST API with Django Ninja and SwaggerUI documentation
- Machine learning-based translation
- Multiple language support
- Admin interface for managing translations
- Paginated translation for large books

## Setup and Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Docker (optional, for containerized deployment)

### Installation

#### Option 1: Local Development

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   source .venv/bin/activate  # On Unix/MacOS
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations to create the database:
   ```
   python manage.py migrate
   ```

5. Create a superuser to access the admin panel:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

#### Option 2: Docker Deployment

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Build the Docker image:
   ```
   docker build -t book-translator-api .
   ```

3. Run the Docker container:
   ```
   docker run -p 8000:8000 -v $(pwd)/media:/app/media book-translator-api
   ```

4. If needed, you can create a superuser inside the container:
   ```
   docker exec -it <container_id> python manage.py createsuperuser
   ```

### Accessing the Application

- API documentation: http://localhost:8000/api/docs
- Admin panel: http://localhost:8000/admin
- Homepage: http://localhost:8000/

## Usage

### API Endpoints

- **GET /api/books**: List all books
- **GET /api/books/{id}**: Get book details
- **POST /api/books/from-url**: Create a book from URL
- **POST /api/books/from-file**: Create a book from file upload
- **GET /api/translations**: List all translations
- **GET /api/translations/{id}**: Get translation details
- **POST /api/translations**: Create a new translation job
- **POST /api/translations/paginated**: Create a paginated translation job
- **GET /api/supported-languages**: Get supported languages

### Example: Create a book from URL

```json
POST /api/books/from-url

{
  "title": "Sample Book",
  "author": "John Doe",
  "source_language": "en",
  "target_language": "es",
  "url": "https://example.com/sample-book.pdf"
}
```

### Example: Create a book from file

```
POST /api/books/from-file

Form data:
- title: Sample Book
- author: John Doe
- source_language: en
- target_language: fr
- file: [FILE UPLOAD]
```

### Example: Create a translation

```json
POST /api/translations

{
  "book_id": 1,
  "max_length": 400
}
```

### Example: Create a paginated translation

```json
POST /api/translations/paginated

{
  "book_id": 1,
  "page": 1,
  "page_size": 2000,
  "max_length": 400
}
```

## Extending the ML Translation Model

The current implementation uses a mock ML translation function. To implement a real ML translation model:

1. Update the `translate_text_with_ml` function in `translator/ml_translator.py`
2. Integrate with your preferred ML translation library or API (e.g., Hugging Face Transformers, Google Translate API, etc.)
3. Handle different file formats appropriately

## Docker Environment

The application includes a Docker setup for easy deployment:

- Uses Python 3.13 slim as the base image
- Installs all necessary dependencies for ML processing
- Sets up proper directories for media storage
- Exposes port 8000 for web access

## License

MIT