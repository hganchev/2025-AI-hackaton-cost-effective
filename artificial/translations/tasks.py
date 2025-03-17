from celery import shared_task, group
import os
import uuid
import logging
from django.conf import settings
from django.db import transaction
from django.db.models import Count, Q

from books.models import Book
from .models import Translation, TranslationChunk
from core.ml_translator import translate_text, split_text_into_chunks
from core.extractor import BookExtractor
from .schemas import TranslationStatus

logger = logging.getLogger(__name__)

@shared_task
def prepare_translation(translation_id, max_length=400, chunk_size=2000):
    """
    Prepare a translation by extracting the book content and creating chunk tasks
    """
    try:
        # Get the translation and related book
        translation = Translation.objects.get(id=translation_id)
        book = translation.book
        
        # Update translation status
        translation.status = TranslationStatus.PROCESSING.value
        translation.save()
        
        # Extract content from book
        content = BookExtractor.extract_from_book(book)
        
        # Split content into chunks
        chunks = split_text_into_chunks(content, chunk_size=chunk_size)
        total_chunks = len(chunks)
        
        # Create chunk records in the database
        chunk_ids = []
        with transaction.atomic():
            for i, chunk_text in enumerate(chunks):
                chunk = TranslationChunk.objects.create(
                    translation=translation,
                    chunk_index=i,
                    original_text=chunk_text,
                    status=TranslationStatus.PENDING.value
                )
                chunk_ids.append(chunk.id)
        
        # Create a group of tasks to translate each chunk
        translation_tasks = group(
            translate_chunk.s(chunk_id, max_length) for chunk_id in chunk_ids
        )
        
        # Launch the group of tasks and add a callback to finalize the translation
        result = translation_tasks.apply_async()
        
        # Save translation details
        translation.total_chunks = total_chunks
        translation.save()
        
        return {
            "success": True,
            "translation_id": translation_id,
            "total_chunks": total_chunks,
            "task_group_id": result.id
        }
    
    except Exception as e:
        logger.error(f"Error preparing translation {translation_id}: {str(e)}")
        
        # Update translation with error
        try:
            translation = Translation.objects.get(id=translation_id)
            translation.status = TranslationStatus.FAILED.value
            translation.error_message = str(e)
            translation.save()
        except:
            pass
            
        return {
            "success": False,
            "translation_id": translation_id,
            "error": str(e)
        }

@shared_task
def translate_chunk(chunk_id, max_length=400):
    """
    Translate a specific chunk of text
    """
    try:
        # Get the chunk and related translation/book
        chunk = TranslationChunk.objects.get(id=chunk_id)
        translation = chunk.translation
        book = translation.book
        
        logger.info(f"Starting translation of chunk {chunk_id} for translation {translation.id}")
        
        # Update chunk status
        chunk.status = TranslationStatus.PROCESSING.value
        chunk.save()
        
        # Translate the chunk
        translated_text = translate_text(
            chunk.original_text,
            book.source_language,
            book.target_language,
            max_length=max_length
        )
        
        # Update the chunk with translation
        chunk.translated_text = translated_text
        chunk.status = TranslationStatus.COMPLETED.value
        chunk.save()
        
        logger.info(f"Completed translation of chunk {chunk_id}, updating translation status")
        
        # Directly update completed chunks count to avoid race conditions
        Translation.objects.filter(id=translation.id).update(
            completed_chunks=TranslationChunk.objects.filter(
                translation_id=translation.id,
                status=TranslationStatus.COMPLETED.value
            ).count()
        )
        
        # Check if all chunks are completed to update the translation status
        check_translation_completion.delay(translation.id)
        
        return {
            "success": True,
            "chunk_id": chunk_id,
            "translation_id": translation.id,
            "chunk_index": chunk.chunk_index
        }
    
    except Exception as e:
        logger.error(f"Error translating chunk {chunk_id}: {str(e)}")
        
        # Update chunk with error
        try:
            chunk = TranslationChunk.objects.get(id=chunk_id)
            chunk.status = TranslationStatus.FAILED.value
            chunk.error_message = str(e)
            chunk.save()
            
            # Also check if this failure affects the overall translation
            check_translation_completion.delay(chunk.translation_id)
        except Exception as inner_e:
            logger.error(f"Error updating failed chunk {chunk_id}: {str(inner_e)}")
            
        return {
            "success": False,
            "chunk_id": chunk_id,
            "error": str(e)
        }

@shared_task
def check_translation_completion(translation_id):
    """
    Check if all chunks for a translation are complete and update the translation status
    """
    try:
        logger.info(f"Checking completion status for translation {translation_id}")
        translation = Translation.objects.get(id=translation_id)
        
        # Count chunks by status
        chunk_counts = TranslationChunk.objects.filter(translation=translation).aggregate(
            total=Count('id'),
            completed=Count('id', filter=Q(status=TranslationStatus.COMPLETED.value)),
            failed=Count('id', filter=Q(status=TranslationStatus.FAILED.value))
        )
        
        total = chunk_counts.get('total', 0)
        completed = chunk_counts.get('completed', 0)
        failed = chunk_counts.get('failed', 0)
        
        logger.info(f"Translation {translation_id} status: total={total}, completed={completed}, failed={failed}")
        
        # Update translation using update() to avoid race conditions
        translation_update = {
            'completed_chunks': completed
        }
        
        # Update translation status based on chunk counts
        if failed > 0:
            translation_update['status'] = TranslationStatus.FAILED.value
            translation_update['error_message'] = f"{failed} chunk(s) failed to translate"
        elif completed == total:
            translation_update['status'] = TranslationStatus.COMPLETED.value
        else:
            translation_update['status'] = TranslationStatus.PROCESSING.value
        
        Translation.objects.filter(id=translation_id).update(**translation_update)
        
        # If translation is completed, trigger the file creation
        if completed == total and failed == 0:
            create_complete_translation_file.delay(translation_id)
        
        return {
            "success": True,
            "translation_id": translation_id,
            "total_chunks": total,
            "completed_chunks": completed,
            "failed_chunks": failed
        }
        
    except Exception as e:
        logger.error(f"Error checking translation completion {translation_id}: {str(e)}")
        return {
            "success": False,
            "translation_id": translation_id,
            "error": str(e)
        }

@shared_task
def create_complete_translation_file(translation_id):
    """
    Create a complete translation file by combining all translated chunks
    """
    try:
        translation = Translation.objects.get(id=translation_id)
        
        # Get all completed chunks, ordered by index
        chunks = TranslationChunk.objects.filter(
            translation=translation, 
            status=TranslationStatus.COMPLETED.value
        ).order_by('chunk_index')
        
        # Create output file
        output_filename = f"translation_{translation.id}_{uuid.uuid4()}.txt"
        output_path = os.path.join(settings.MEDIA_ROOT, 'translations', output_filename)
        
        # Ensure the directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Combine all translated chunks into a single file
        with open(output_path, 'w', encoding='utf-8') as f:
            for i, chunk in enumerate(chunks):
                if i > 0:
                    f.write("\n\n")
                f.write(chunk.translated_text)
        
        # Update the translation record with the file path
        translation.translated_file = f"translations/{output_filename}"
        translation.save()
        
        return {
            "success": True,
            "translation_id": translation_id,
            "file_path": output_path
        }
        
    except Exception as e:
        logger.error(f"Error creating complete translation file for {translation_id}: {str(e)}")
        return {
            "success": False,
            "translation_id": translation_id,
            "error": str(e)
        }