from ninja import Router, File, UploadedFile
from typing import List
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.conf import settings
import os
import uuid
from pathlib import Path

from .models import Book
from .schemas import (
    BookBase, BookCreateFromURL, BookOut, 
    BookList, ErrorResponse, FileFormatEnum
)
from .tasks import download_book_from_url

# Create the API router for the books app
books_api = Router(tags=["Books"])

@books_api.post("/from-url", response={201: BookOut, 400: ErrorResponse})
def create_book_from_url(request: HttpRequest, book_data: BookCreateFromURL):
    """Create a new book for translation from a URL"""
    try:
        # Create book record
        book = Book.objects.create(
            title=book_data.title,
            author=book_data.author or "",
            source_language=book_data.source_language,
            target_language=book_data.target_language,
            url=str(book_data.url),
            file_format=book_data.file_format
        )
        
        # Queue a background task to download the book
        download_book_from_url.delay(book.id)
        
        return 201, BookOut(
            id=book.id,
            title=book.title,
            author=book.author,
            source_language=book.source_language,
            target_language=book.target_language,
            created_at=book.created_at,
            url=book.url,
            file_format=book.file_format
        )
    except Exception as e:
        return 400, ErrorResponse(detail=str(e))

@books_api.post("/from-file", response={201: BookOut, 400: ErrorResponse})
def create_book_from_file(
    request: HttpRequest,
    title: str,
    author: str = None,
    source_language: str = "en",
    target_language: str = "es",
    file: UploadedFile = File(...)
):
    """Create a new book for translation from a file upload"""
    try:
        # Validate file extension
        filename = file.name.lower()
        valid_extensions = ['pdf', 'epub', 'txt', 'docx', 'html', 'md']
        
        # Get file extension
        extension = Path(filename).suffix.lstrip('.')
        
        if extension not in valid_extensions:
            return 400, ErrorResponse(detail=f"Unsupported file format. Supported formats: {', '.join(valid_extensions)}")
        
        # Save the uploaded file
        file_name = f"{uuid.uuid4()}_{file.name}"
        file_path = os.path.join(settings.MEDIA_ROOT, 'books', file_name)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Save the file
        with open(file_path, 'wb') as dest:
            for chunk in file.chunks():
                dest.write(chunk)
        
        # Create the book record
        book = Book.objects.create(
            title=title,
            author=author or "",
            source_language=source_language,
            target_language=target_language,
            file=f"books/{file_name}",
            file_format=extension
        )
        
        return 201, BookOut(
            id=book.id,
            title=book.title,
            author=book.author,
            source_language=book.source_language,
            target_language=book.target_language,
            created_at=book.created_at,
            file=book.file.url if book.file else None,
            file_format=book.file_format
        )
    except Exception as e:
        return 400, ErrorResponse(detail=str(e))

@books_api.get("", response=List[BookOut])
def list_books(request: HttpRequest):
    """List all books in the system"""
    books = Book.objects.all()
    return [
        BookOut(
            id=book.id,
            title=book.title,
            author=book.author,
            source_language=book.source_language,
            target_language=book.target_language,
            created_at=book.created_at,
            url=book.url,
            file=book.file.url if book.file else None,
            file_format=book.file_format
        )
        for book in books
    ]

@books_api.get("/{book_id}", response={200: BookOut, 404: ErrorResponse})
def get_book(request: HttpRequest, book_id: int):
    """Get details of a specific book"""
    try:
        book = get_object_or_404(Book, id=book_id)
        return 200, BookOut(
            id=book.id,
            title=book.title,
            author=book.author,
            source_language=book.source_language,
            target_language=book.target_language,
            created_at=book.created_at,
            url=book.url,
            file=book.file.url if book.file else None,
            file_format=book.file_format
        )
    except Book.DoesNotExist:
        return 404, ErrorResponse(detail=f"Book with ID {book_id} not found")