# Book Translator API

A Django application with Django Ninja API that provides ML-based book translation capabilities. This application can translate books provided via URL or uploaded files.

## Features

- Translate books from URLs or uploaded files
- REST API with Django Ninja and SwaggerUI documentation
- Machine learning-based translation
- Multiple language support
- Admin interface for managing translations

## Setup and Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

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
   pip install django djangorestframework django-ninja pydantic
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

7. Access the application at:
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
  "book_id": 1
}
```

## Extending the ML Translation Model

The current implementation uses a mock ML translation function. To implement a real ML translation model:

1. Update the `translate_text_with_ml` function in `translator/api.py`
2. Integrate with your preferred ML translation library or API (e.g., Hugging Face Transformers, Google Translate API, etc.)
3. Handle different file formats appropriately

## License

MIT