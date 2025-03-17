from django.db import models
from books.models import Book

class Translation(models.Model):
    """Model representing a translation of a book"""
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='translations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    translated_file = models.FileField(upload_to='translations/', null=True, blank=True)
    error_message = models.TextField(blank=True)
    total_chunks = models.IntegerField(default=0)
    completed_chunks = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Translation of {self.book.title} - {self.status}"

class TranslationChunk(models.Model):
    """Model representing a chunk of a translated book"""
    translation = models.ForeignKey(Translation, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.IntegerField(help_text="The index of this chunk in the translation sequence")
    original_text = models.TextField(help_text="The original text of this chunk before translation")
    translated_text = models.TextField(null=True, blank=True, help_text="The translated text of this chunk")
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    error_message = models.TextField(blank=True)
    
    class Meta:
        ordering = ['chunk_index']
        unique_together = ['translation', 'chunk_index']
        
    def __str__(self):
        return f"Chunk {self.chunk_index} of {self.translation}"