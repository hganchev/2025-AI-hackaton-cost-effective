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
from celery import shared_task

from .schemas import (
    BookBase, BookCreateFromURL, BookCreateFromFile, BookOut,
    TranslationBase, TranslationCreate, TranslationOut, TranslationList,
    TranslationPaginatedOut, TranslationPaginatedCreate,
    ErrorResponse, LanguageEnum, TranslationStatus 
)
from .models import Book, Translation
from .extractor import BookExtractor
from .ml_translator import translate_text, translate_text_paginated, get_supported_languages, split_text_into_chunks

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

# Celery task for translating book chunks
@shared_task
def translate_book_chunks(translation_id, book_id, max_length=400):
    """
    Celery task to translate a book in chunks and save results incrementally
    """
    try:
        book = Book.objects.get(id=book_id)
        translation = Translation.objects.get(id=translation_id)
        
        # Extract text content from the book
        content = BookExtractor.extract_from_book(book)
        
        # Split text into manageable chunks
        chunk_size = 2000  # Characters per chunk
        chunks = split_text_into_chunks(content, chunk_size)
        total_chunks = len(chunks)
        
        # Create the output file for the translation if it doesn't exist
        if not translation.translated_file:
            output_filename = f"translation_{translation.id}_{uuid.uuid4()}.txt"
            output_path = os.path.join(settings.MEDIA_ROOT, 'translations', output_filename)
            
            # Ensure the directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Save an empty file to start with
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write("")
            
            # Update translation record with file path
            translation.translated_file = f"translations/{output_filename}"
            translation.save()
        
        # Get the file path to append translations to
        file_path = os.path.join(settings.MEDIA_ROOT, translation.translated_file.name)
        
        # Translate each chunk and append to file
        for i, chunk in enumerate(chunks):
            # Translate the chunk
            translated_chunk = translate_text(
                chunk, 
                book.source_language, 
                book.target_language, 
                max_length=max_length
            )
            
            # Append to the translation file
            with open(file_path, 'a', encoding='utf-8') as f:
                if i > 0:
                    f.write("\n\n")
                f.write(translated_chunk)
            
            # Update progress status
            progress = min(99, int((i + 1) / total_chunks * 100))
            translation.status = TranslationStatus.PROCESSING.value if progress < 99 else TranslationStatus.COMPLETED.value
            translation.save()
        
        # Mark as completed when done
        translation.status = TranslationStatus.COMPLETED.value
        translation.save()
        
        return {
            "success": True, 
            "translation_id": translation.id,
            "chunks_translated": total_chunks
        }
    
    except Exception as e:
        # Update translation with error status
        try:
            translation = Translation.objects.get(id=translation_id)
            translation.status = TranslationStatus.FAILED.value
            translation.error_message = str(e)
            translation.save()
        except:
            pass
        
        return {
            "success": False, 
            "error": str(e)
        }

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
def create_translation(request: HttpRequest, translation_data: TranslationCreate):
    """Create a new translation job for a book using Celery for async processing"""
    try:
        # Get the book
        try:
            book = Book.objects.get(id=translation_data.book_id)
        except Book.DoesNotExist:
            return 404, ErrorResponse(detail=f"Book with ID {translation_data.book_id} not found")
        
        # Create a new translation record with pending status
        translation = Translation.objects.create(
            book=book, 
            status=TranslationStatus.PENDING.value
        )
        
        # Get max length from request, default to 400 if not provided
        max_length = translation_data.max_length if hasattr(translation_data, 'max_length') else 400
        
        # Queue the Celery task to process the translation in chunks
        translate_book_chunks.delay(
            translation.id,
            book.id,
            max_length
        )
        
        # Return the translation object immediately
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
            status=TranslationStatus(translation.status),
            translated_file=None,  # Will be populated by the Celery task
            error_message=translation.error_message
        )
    except Exception as e:
        return 400, ErrorResponse(detail=str(e))

@api.get("/translations/paginated", response={200: TranslationPaginatedOut, 404: ErrorResponse})
def get_paginated_translation(
    request: HttpRequest, 
    translation_id: int,
    page: int = 1,
    page_size: int = 2000
):
    """Get a specific page of a translated book"""
    try:
        # Find the translation
        translation = get_object_or_404(
            Translation.objects.select_related('book'),
            id=translation_id
        )
        
        # Check if the translation file exists
        if not translation.translated_file:
            return 404, ErrorResponse(detail="Translation file not found")
        
        # Get the file path
        file_path = os.path.join(settings.MEDIA_ROOT, translation.translated_file.name)
        if not os.path.exists(file_path):
            return 404, ErrorResponse(detail="Translation file not found on disk")
        
        # Read the translation file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Calculate pagination
        total_chars = len(content)
        total_pages = max(1, (total_chars + page_size - 1) // page_size)
        
        # Ensure page is within bounds
        page = max(1, min(page, total_pages))
        
        # Extract the requested page of content
        start_idx = (page - 1) * page_size
        end_idx = min(start_idx + page_size, total_chars)
        page_content = content[start_idx:end_idx]
        
        # Create response
        return 200, TranslationPaginatedOut(
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
            status=TranslationStatus(translation.status),
            translated_file=translation.translated_file.url if translation.translated_file else None,
            error_message=translation.error_message,
            total_pages=total_pages,
            current_page=page,
            has_next=page < total_pages,
            has_previous=page > 1
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
            status=TranslationStatus(translation.status),
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
            status=TranslationStatus(translation.status),
            translated_file=translation.translated_file.url if translation.translated_file else None,
            error_message=translation.error_message
        )
    except Translation.DoesNotExist:
        return 404, ErrorResponse(detail=f"Translation with ID {translation_id} not found")

@api.get("/supported-languages", response=List[str])
def supported_languages(request: HttpRequest):
    """Get a list of supported languages for translation"""
    return get_supported_languages()