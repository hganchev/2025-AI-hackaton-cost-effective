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

# File content extraction functions for different formats
def extract_text_from_pdf(file_path):
    """Extract text content from PDF files"""
    try:
        # In a real implementation, you would use a library like PyPDF2 or pdfminer.six
        # Here we're just simulating the extraction
        return f"[PDF Content extracted from {file_path}]\n\nThis is a simulation of PDF text extraction."
    except Exception as e:
        return f"Error extracting PDF content: {str(e)}"

def extract_text_from_epub(file_path):
    """Extract text content from EPUB files"""
    try:
        # In a real implementation, you would use a library like ebooklib
        # Here we're just simulating the extraction
        return f"[EPUB Content extracted from {file_path}]\n\nThis is a simulation of EPUB text extraction."
    except Exception as e:
        return f"Error extracting EPUB content: {str(e)}"

def extract_text_from_docx(file_path):
    """Extract text content from DOCX files"""
    try:
        # In a real implementation, you would use a library like python-docx
        # Here we're just simulating the extraction
        return f"[DOCX Content extracted from {file_path}]\n\nThis is a simulation of DOCX text extraction."
    except Exception as e:
        return f"Error extracting DOCX content: {str(e)}"

def extract_text_from_txt(file_path):
    """Extract text content from plain text files"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Try another common encoding if UTF-8 fails
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
        except Exception as e:
            return f"Error extracting TXT content: {str(e)}"
    except Exception as e:
        return f"Error extracting TXT content: {str(e)}"

def extract_text_from_html(file_path):
    """Extract text content from HTML files"""
    try:
        # In a real implementation, you would use a library like BeautifulSoup
        # Here we're just simulating the extraction with basic HTML tag removal
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # Very basic HTML tag removal (for demonstration only)
        content = re.sub(r'<[^>]+>', '', content)
        return content
    except Exception as e:
        return f"Error extracting HTML content: {str(e)}"

def extract_text_from_md(file_path):
    """Extract text content from Markdown files"""
    try:
        # Markdown is already readable as plain text
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error extracting Markdown content: {str(e)}"

def extract_text_from_url(url):
    """Extract text content from a URL (simulate downloading and processing)"""
    try:
        # In a real implementation, you would use requests to get the content
        # and then process based on content type
        # Here we're just simulating the extraction
        return f"[Content extracted from URL: {url}]\n\nThis is a simulation of URL content extraction."
    except Exception as e:
        return f"Error extracting content from URL: {str(e)}"

def extract_text_based_on_format(book):
    """Extract text content from a book based on its format"""
    if book.file:
        file_path = book.file.path
        if book.file_format == 'pdf':
            return extract_text_from_pdf(file_path)
        elif book.file_format == 'epub':
            return extract_text_from_epub(file_path)
        elif book.file_format == 'txt':
            return extract_text_from_txt(file_path)
        elif book.file_format == 'docx':
            return extract_text_from_docx(file_path)
        elif book.file_format == 'html':
            return extract_text_from_html(file_path)
        elif book.file_format == 'md':
            return extract_text_from_md(file_path)
        else:
            # Default to treating as text file
            return extract_text_from_txt(file_path)
    elif book.url:
        return extract_text_from_url(book.url)
    else:
        return "No content source available for this book."

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
            url=str(book_data.url)
        )
        return 201, BookOut(
            id=book.id,
            title=book.title,
            author=book.author,
            source_language=book.source_language,
            target_language=book.target_language,
            created_at=book.created_at,
            url=book.url
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
    file_format: Optional[str] = None,
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
            file=book.file.url if book.file else None
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
            file=book.file.url if book.file else None
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
            file=book.file.url if book.file else None
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
        
        # Extract text content based on book format
        content = extract_text_based_on_format(book)
        
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
                file=book.file.url if book.file else None
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
                file=translation.book.file.url if translation.book.file else None
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
                file=translation.book.file.url if translation.book.file else None
            ),
            created_at=translation.created_at,
            updated_at=translation.updated_at,
            status=translation.status,
            translated_file=translation.translated_file.url if translation.translated_file else None,
            error_message=translation.error_message
        )
    except Translation.DoesNotExist:
        return 404, ErrorResponse(detail=f"Translation with ID {translation_id} not found")