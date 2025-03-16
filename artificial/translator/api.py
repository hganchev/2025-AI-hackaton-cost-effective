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
from asgiref.sync import sync_to_async

from .schemas import (
    BookBase, BookCreateFromURL, BookCreateFromFile, BookOut,
    TranslationBase, TranslationCreate, TranslationOut, TranslationList,
    TranslationPaginatedOut, TranslationPaginatedCreate,
    ErrorResponse, LanguageEnum
)
from .models import Book, Translation
from .extractor import BookExtractor
from .ml_translator import translate_text, translate_text_paginated, get_supported_languages

api = NinjaAPI(title="Book Translator API", description="ML-based book translation API")

# Helper functions for synchronous database operations wrapped for async usage
@sync_to_async
def get_book_by_id(book_id):
    """Get a book by ID asynchronously"""
    return Book.objects.get(id=book_id)

@sync_to_async
def create_translation_record(book, status="processing"):
    """Create a translation record asynchronously"""
    return Translation.objects.create(book=book, status=status)

@sync_to_async
def update_translation_record(translation_id, status, file_path):
    """Update a translation record asynchronously"""
    translation = Translation.objects.get(id=translation_id)
    translation.status = status
    translation.translated_file = file_path
    translation.save()
    return translation

@sync_to_async
def extract_text_sync(book):
    """Run the synchronous text extraction in an async-safe way"""
    return BookExtractor.extract_from_book(book)

@sync_to_async
def ml_translate_text_sync(text, source_lang, target_lang, max_length=400):
    """Run the ML translation in an async-safe way"""
    return translate_text(text, source_lang, target_lang, max_length=max_length)

@sync_to_async
def ml_translate_paginated_sync(text, source_lang, target_lang, page, page_size, max_length):
    """Run the paginated ML translation in an async-safe way"""
    return translate_text_paginated(text, source_lang, target_lang, page, page_size, max_length)

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
        # Get the book (async-safe)
        try:
            book = await get_book_by_id(translation_data.book_id)
        except Book.DoesNotExist:
            return 404, ErrorResponse(detail=f"Book with ID {translation_data.book_id} not found")
        
        # Create a new translation record (async-safe)
        translation = await create_translation_record(book)
        
        # Extract text content using our BookExtractor (async-safe)
        content = await extract_text_sync(book)
        
        # Get max length from request, default to 400 if not provided
        max_length = translation_data.max_length if hasattr(translation_data, 'max_length') else 400
        
        # Perform ML translation using our ml_translator module
        translated_text = await ml_translate_text_sync(
            content, book.source_language, book.target_language, max_length=max_length
        )
        
        # Create the output file for the translation
        output_filename = f"translation_{translation.id}_{uuid.uuid4()}.txt"
        output_path = os.path.join(settings.MEDIA_ROOT, 'translations', output_filename)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save the translated content to a file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(translated_text)
        
        # Update translation record (async-safe)
        translation = await update_translation_record(
            translation.id, 
            "completed", 
            f"translations/{output_filename}"
        )
        
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
    except Exception as e:
        return 400, ErrorResponse(detail=str(e))

@api.post("/translations/paginated", response={201: TranslationPaginatedOut, 400: ErrorResponse})
async def create_paginated_translation(request: HttpRequest, translation_data: TranslationPaginatedCreate):
    """Create a paginated translation for a book (translate one page at a time)"""
    try:
        # Get the book (async-safe)
        try:
            book = await get_book_by_id(translation_data.book_id)
        except Book.DoesNotExist:
            return 404, ErrorResponse(detail=f"Book with ID {translation_data.book_id} not found")
        
        # Extract text content using our BookExtractor (async-safe)
        content = await extract_text_sync(book)
        
        # Set default values
        page = translation_data.page if hasattr(translation_data, 'page') else 1
        page_size = translation_data.page_size if hasattr(translation_data, 'page_size') else 2000
        max_length = translation_data.max_length if hasattr(translation_data, 'max_length') else 400
        
        # Perform paginated ML translation
        translation_result = await ml_translate_paginated_sync(
            content, 
            book.source_language, 
            book.target_language,
            page=page,
            page_size=page_size,
            max_length=max_length
        )
        
        # Create a translation record if this is the first page
        if page == 1:
            translation = await create_translation_record(book, status="in_progress")
            
            # Create the output file for the translation
            output_filename = f"translation_{translation.id}_{uuid.uuid4()}.txt"
            output_path = os.path.join(settings.MEDIA_ROOT, 'translations', output_filename)
            
            # Ensure the directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Save the translated content to a file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(translation_result["translated_text"])
            
            # Update translation record
            translation = await update_translation_record(
                translation.id, 
                "in_progress" if translation_result["has_next"] else "completed", 
                f"translations/{output_filename}"
            )
        else:
            # Find existing translation for this book
            translation = get_object_or_404(
                Translation.objects.filter(book=book).order_by('-created_at'), 
                book=book
            )
            
            # Append to the existing translation file
            if translation.translated_file:
                file_path = os.path.join(settings.MEDIA_ROOT, translation.translated_file.name)
                with open(file_path, 'a', encoding='utf-8') as f:
                    f.write("\n\n" + translation_result["translated_text"])
                
                # Update translation status
                translation.status = "in_progress" if translation_result["has_next"] else "completed"
                translation.save()
        
        # Return the response
        return 201, TranslationPaginatedOut(
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
            error_message=translation.error_message,
            total_pages=translation_result["total_pages"],
            current_page=translation_result["current_page"],
            has_next=translation_result["has_next"],
            has_previous=translation_result["has_previous"]
        )
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

@api.get("/supported-languages", response=List[str])
def supported_languages(request: HttpRequest):
    """Get a list of supported languages for translation"""
    return get_supported_languages()