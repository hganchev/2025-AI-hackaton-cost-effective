from ninja import NinjaAPI, File, UploadedFile, Schema
from ninja.responses import Response
from typing import List, Dict, Any, Optional
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.conf import settings
import os
import uuid
import json
import asyncio
from datetime import datetime
import mimetypes
import requests
import re
from pathlib import Path

from .schemas import (
    BookBase, BookCreateFromURL, BookCreateFromFile, BookOut,
    TranslationBase, TranslationCreate, TranslationOut, TranslationList,
    ErrorResponse
)
from .models import Book, Translation
from .extractor import BookExtractor

api = NinjaAPI(title="Book Translator API", description="ML-based book translation API")

# Mock ML translation function (to be replaced with actual ML model implementation)
async def translate_text_with_ml(text: str, source_lang: str, target_lang: str) -> str:
    """
    Mock function that simulates ML-based translation.
    In a real implementation, this would use a proper ML model.
    """
    # Simulate processing time
    await asyncio.sleep(1)
    
    # Very simple mock translation (just for demonstration)
    if target_lang == "es" and source_lang == "en":
        translation_map = {
            "Hello": "Hola",
            "world": "mundo",
            "book": "libro",
            "language": "idioma",
            "translation": "traducción"
        }
        
        for eng, span in translation_map.items():
            text = text.replace(eng, span)
            
    return text + f" [Translated from {source_lang} to {target_lang}]"

class FileFormatParams(Schema):
    """Schema for file format parameters"""
    title: str
    author: Optional[str] = None
    source_language: str = "en"
    target_language: str = "es"
    file_format: Optional[str] = None

@api.post("/books/from-url", response={201: BookOut, 400: ErrorResponse})
def create_book_from_url(request: HttpRequest, book_data: BookCreateFromURL):
    """Create a new book for translation from a URL"""
    try:
        book = Book.objects.create(
            title=book_data.title,
            author=book_data.author or "",
            source_language=book_data.source_language,
            target_language=book_data.target_language,
            url=str(book_data.url),
            file_format=book_data.file_format
        )
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

@api.post("/books/from-file", response={201: BookOut, 400: ErrorResponse})
def create_book_from_file(
    request: HttpRequest,
    title: str,
    author: Optional[str] = None,
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

@api.get("/books", response=List[BookOut])
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

@api.get("/books/{book_id}", response={200: BookOut, 404: ErrorResponse})
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

@api.post("/translations", response={201: TranslationOut, 400: ErrorResponse})
async def create_translation(request: HttpRequest, translation_data: TranslationCreate):
    """Create a new translation job for a book"""
    try:
        # Get the book
        book = get_object_or_404(Book, id=translation_data.book_id)
        
        # Create a new translation record
        translation = Translation.objects.create(
            book=book,
            status="processing"
        )
        
        # Extract text content using our new BookExtractor
        content = BookExtractor.extract_from_book(book)
        
        # Perform mock ML translation
        translated_text = await translate_text_with_ml(
            content, book.source_language, book.target_language
        )
        
        # Create the output file for the translation
        output_filename = f"translation_{translation.id}_{uuid.uuid4()}.txt"
        output_path = os.path.join(settings.MEDIA_ROOT, 'translations', output_filename)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save the translated content to a file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(translated_text)
        
        # Update translation record
        translation.status = "completed"
        translation.translated_file = f"translations/{output_filename}"
        translation.save()
        
        # Return the response
        return 201, TranslationOut(
            id=translation.id,
            book=BookOut(
                id=book.id,
                title=book.title,
                author=book.author,
                source_language=book.source_language,
                target_language=book.target_language,
                created_at=book.created_at,
                url=book.url,
                file=book.file.url if book.file else None,
                file_format=book.file_format
            ),
            created_at=translation.created_at,
            updated_at=translation.updated_at,
            status=translation.status,
            translated_file=translation.translated_file.url if translation.translated_file else None,
            error_message=translation.error_message
        )
    except Book.DoesNotExist:
        return 404, ErrorResponse(detail=f"Book with ID {translation_data.book_id} not found")
    except Exception as e:
        return 400, ErrorResponse(detail=str(e))

@api.get("/translations", response=List[TranslationOut])
def list_translations(request: HttpRequest):
    """List all translations in the system"""
    translations = Translation.objects.all().select_related('book')
    return [
        TranslationOut(
            id=translation.id,
            book=BookOut(
                id=translation.book.id,
                title=translation.book.title,
                author=translation.book.author,
                source_language=translation.book.source_language,
                target_language=translation.book.target_language,
                created_at=translation.book.created_at,
                url=translation.book.url,
                file=translation.book.file.url if translation.book.file else None,
                file_format=translation.book.file_format
            ),
            created_at=translation.created_at,
            updated_at=translation.updated_at,
            status=translation.status,
            translated_file=translation.translated_file.url if translation.translated_file else None,
            error_message=translation.error_message
        )
        for translation in translations
    ]

@api.get("/translations/{translation_id}", response={200: TranslationOut, 404: ErrorResponse})
def get_translation(request: HttpRequest, translation_id: int):
    """Get details of a specific translation"""
    try:
        translation = get_object_or_404(Translation.objects.select_related('book'), id=translation_id)
        return 200, TranslationOut(
            id=translation.id,
            book=BookOut(
                id=translation.book.id,
                title=translation.book.title,
                author=translation.book.author,
                source_language=translation.book.source_language,
                target_language=translation.book.target_language,
                created_at=translation.book.created_at,
                url=translation.book.url,
                file=translation.book.file.url if translation.book.file else None,
                file_format=translation.book.file_format
            ),
            created_at=translation.created_at,
            updated_at=translation.updated_at,
            status=translation.status,
            translated_file=translation.translated_file.url if translation.translated_file else None,
            error_message=translation.error_message
        )
    except Translation.DoesNotExist:
        return 404, ErrorResponse(detail=f"Translation with ID {translation_id} not found")