from ninja import Router
from typing import List, Dict, Any
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

from books.models import Book
from books.schemas import BookOut
from .models import Translation, TranslationChunk
from .schemas import (
    TranslationCreate, TranslationOut,
    TranslationDetailOut, TranslationChunkOut,
    TranslationPaginatedOut, ErrorResponse, TranslationStatus
)
from .tasks import prepare_translation, translate_chunk
from core.ml_translator import get_supported_languages

# Create the API router for the translations app
translations_api = Router(tags=["Translations"])

@translations_api.post("", response={201: TranslationOut, 400: ErrorResponse, 404: ErrorResponse})
def create_translation(request: HttpRequest, data: TranslationCreate):
    """Create a new translation for a book"""
    try:
        # Get the book
        try:
            book = Book.objects.get(id=data.book_id)
        except Book.DoesNotExist:
            return 404, ErrorResponse(detail=f"Book with ID {data.book_id} not found")
        
        # Create a new translation with pending status
        translation = Translation.objects.create(
            book=book,
            status=TranslationStatus.PENDING.value,
            total_chunks=0,
            completed_chunks=0
        )
        
        # Get translation parameters
        max_length = data.max_length if hasattr(data, 'max_length') else 400
        chunk_size = data.chunk_size if hasattr(data, 'chunk_size') else 2000
        
        # Queue the task to prepare translation
        prepare_translation.delay(translation.id, max_length, chunk_size)
        
        # Return the translation details
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
            total_chunks=translation.total_chunks,
            completed_chunks=translation.completed_chunks,
            error_message=translation.error_message
        )
    except Exception as e:
        return 400, ErrorResponse(detail=str(e))

@translations_api.get("", response=List[TranslationOut])
def list_translations(request: HttpRequest):
    """List all translations"""
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
            total_chunks=getattr(translation, 'total_chunks', 0),
            completed_chunks=getattr(translation, 'completed_chunks', 0),
            error_message=translation.error_message
        )
        for translation in translations
    ]

@translations_api.get("/by-book/{book_id}", response=List[TranslationOut])
def list_translations_by_book(request: HttpRequest, book_id: int):
    """List all translations for a specific book"""
    try:
        book = get_object_or_404(Book, id=book_id)
        translations = Translation.objects.filter(book=book).select_related('book')
        
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
                total_chunks=getattr(translation, 'total_chunks', 0),
                completed_chunks=getattr(translation, 'completed_chunks', 0),
                error_message=translation.error_message
            )
            for translation in translations
        ]
    except Book.DoesNotExist:
        return []

@translations_api.get("/{translation_id}", response={200: TranslationDetailOut, 404: ErrorResponse})
def get_translation(request: HttpRequest, translation_id: int):
    """Get details of a specific translation including its chunks"""
    try:
        # Use select_related to fetch book in the same query
        translation = get_object_or_404(
            Translation.objects.select_related('book'),
            id=translation_id
        )
        
        # Optimize chunk query with annotated status counts
        chunks = (TranslationChunk.objects
                 .filter(translation=translation)
                 .order_by('chunk_index')
                 .defer('original_text')  # Don't load original_text as it's not needed
                 .only(
                     'id', 'chunk_index', 'status', 'translated_text',
                     'created_at', 'updated_at', 'error_message'
                 ))
        
        # Get completed chunks count efficiently using count() with filter
        completed_chunks = TranslationChunk.objects.filter(
            translation=translation,
            status=TranslationStatus.COMPLETED.value
        ).count()
        
        return 200, TranslationDetailOut(
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
            total_chunks=translation.total_chunks,
            completed_chunks=completed_chunks,
            error_message=translation.error_message,
            chunks=[
                TranslationChunkOut(
                    id=chunk.id,
                    chunk_index=chunk.chunk_index,
                    status=TranslationStatus(chunk.status),
                    translated_text=chunk.translated_text,
                    created_at=chunk.created_at,
                    updated_at=chunk.updated_at,
                    error_message=chunk.error_message
                )
                for chunk in chunks
            ]
        )
    except Translation.DoesNotExist:
        return 404, ErrorResponse(detail=f"Translation with ID {translation_id} not found")

@translations_api.get("/{translation_id}/paginated", response={200: TranslationPaginatedOut, 404: ErrorResponse})
def get_paginated_translation(
    request: HttpRequest,
    translation_id: int,
    page: int = 1,
    page_size: int = 2000
):
    """Get a paginated view of a translation's content"""
    try:
        translation = get_object_or_404(Translation, id=translation_id)
        chunks = list(TranslationChunk.objects.filter(
            translation=translation,
            status='completed'
        ).order_by('chunk_index'))
        
        # Check if translation has chunks
        if not chunks:
            return 404, ErrorResponse(detail="No translated chunks found for this translation")
            
        # Combine all chunk texts
        full_text = "\n\n".join(chunk.translated_text for chunk in chunks if chunk.translated_text)
        
        # Calculate pagination
        total_chars = len(full_text)
        total_pages = max(1, (total_chars + page_size - 1) // page_size)
        
        # Ensure page is within bounds
        page = max(1, min(page, total_pages))
        
        # Extract the requested page of content
        start_idx = (page - 1) * page_size
        end_idx = min(start_idx + page_size, total_chars)
        page_content = full_text[start_idx:end_idx] if start_idx < total_chars else ""
        
        return 200, TranslationPaginatedOut(
            id=translation.id,
            book_id=translation.book.id,
            page_content=page_content,
            total_pages=total_pages,
            current_page=page,
            has_next=page < total_pages,
            has_previous=page > 1
        )
    except Translation.DoesNotExist:
        return 404, ErrorResponse(detail=f"Translation with ID {translation_id} not found")

@translations_api.get("/{translation_id}/chunk/{chunk_index}", response={200: TranslationChunkOut, 404: ErrorResponse})
def get_translation_chunk(
    request: HttpRequest,
    translation_id: int,
    chunk_index: int
):
    """Get a specific chunk from a translation"""
    try:
        translation = get_object_or_404(Translation, id=translation_id)
        chunk = get_object_or_404(TranslationChunk, translation=translation, chunk_index=chunk_index)
        
        return 200, TranslationChunkOut(
            id=chunk.id,
            chunk_index=chunk.chunk_index,
            status=TranslationStatus(chunk.status),
            translated_text=chunk.translated_text,
            created_at=chunk.created_at,
            updated_at=chunk.updated_at,
            error_message=chunk.error_message
        )
    except (Translation.DoesNotExist, TranslationChunk.DoesNotExist):
        return 404, ErrorResponse(detail=f"Translation chunk not found")

@translations_api.get("/book/{book_id}/language/{language_code}", response={200: Dict[str, Any], 404: ErrorResponse})
def get_full_translation(request: HttpRequest, book_id: int, language_code: str):
    """
    Retrieve the full translation text for a book by language
    
    Parameters:
    - book_id: ID of the book
    - language_code: ISO language code for the translation (e.g., 'es', 'fr')
    
    Optional query parameters:
    - search: Text to search within the translation
    """
    try:
        book = get_object_or_404(Book, id=book_id)
    except Book.DoesNotExist:
        return 404, ErrorResponse(detail=f"Book with ID {book_id} not found")
    
    # Get translations for this book in the specified language
    translations = Translation.objects.filter(
        book=book,
        target_language=language_code
    )
    
    if not translations.exists():
        return 404, ErrorResponse(detail=f"No translations found for book {book_id} in language {language_code}")
    
    # Handle search if provided
    search_query = request.query_params.get('search')
    chunks = TranslationChunk.objects.filter(
        translation__in=translations,
        status='completed'
    ).order_by('chunk_index')
    
    if search_query:
        # Use PostgreSQL full-text search
        vector = SearchVector('translated_text', weight='A')
        query = SearchQuery(search_query)
        
        chunks = chunks.annotate(
            search=vector,
            rank=SearchRank(vector, query)
        ).filter(search=query).order_by('-rank')
    
    # Organize the response
    result = {
        'book': {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'source_language': book.source_language
        },
        'target_language': language_code,
        'chunks': []
    }
    
    # Add each translated chunk
    for chunk in chunks:
        result['chunks'].append({
            'chunk_index': chunk.chunk_index,
            'content': chunk.translated_text
        })
    
    return 200, result