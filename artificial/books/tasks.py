from celery import shared_task
import os
import uuid
import logging
from django.conf import settings
from django.core.files.storage import default_storage
import requests

from .models import Book
from core.extractor import BookExtractor

logger = logging.getLogger(__name__)

@shared_task
def extract_book_content(book_id):
    """
    Extract text content from a book for later translation
    """
    try:
        book = Book.objects.get(id=book_id)
        content = BookExtractor.extract_from_book(book)
        
        # Store the extracted content in a temporary file
        temp_filename = f"book_content_{book_id}_{uuid.uuid4()}.txt"
        temp_path = os.path.join(settings.MEDIA_ROOT, 'temp', temp_filename)
        
        # Ensure temp directory exists
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)
        
        # Save the content to the file
        with open(temp_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        return {
            "success": True,
            "book_id": book_id,
            "content_path": temp_path,
            "content_length": len(content)
        }
        
    except Exception as e:
        logger.error(f"Error extracting book content for book {book_id}: {str(e)}")
        return {
            "success": False,
            "book_id": book_id,
            "error": str(e)
        }

@shared_task
def download_book_from_url(book_id):
    """
    Download a book from URL and save it to storage
    """
    try:
        book = Book.objects.get(id=book_id)
        if not book.url:
            raise ValueError("Book has no URL to download from")
        
        # Get the file extension from URL (if any)
        url_path = book.url.split('?')[0]  # Remove query parameters
        extension = os.path.splitext(url_path)[1].lower()
        
        # Default to .txt if no extension found
        if not extension:
            extension = '.txt'
            
        # Create a unique filename
        filename = f"{uuid.uuid4()}{extension}"
        file_path = os.path.join('books', filename)
        
        # Download the file
        response = requests.get(book.url, stream=True)
        response.raise_for_status()
        
        # Save to storage
        with default_storage.open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Update the book with the file path
        book.file = file_path
        
        # Try to detect file format from extension
        if extension.endswith('.pdf'):
            book.file_format = 'pdf'
        elif extension.endswith('.epub'):
            book.file_format = 'epub'
        elif extension.endswith('.txt'):
            book.file_format = 'txt'
        elif extension.endswith('.docx'):
            book.file_format = 'docx'
        elif extension.endswith('.html') or extension.endswith('.htm'):
            book.file_format = 'html'
        elif extension.endswith('.md'):
            book.file_format = 'md'
        
        book.save()
        
        return {
            "success": True,
            "book_id": book_id,
            "file_path": file_path
        }
        
    except Exception as e:
        logger.error(f"Error downloading book from URL for book {book_id}: {str(e)}")
        return {
            "success": False,
            "book_id": book_id,
            "error": str(e)
        }