from django.db import models

class Book(models.Model):
    """Model representing a book to be translated"""
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    source_language = models.CharField(max_length=50, default='en')
    target_language = models.CharField(max_length=50)
    file = models.FileField(upload_to='books/', null=True, blank=True)
    url = models.URLField(max_length=500, null=True, blank=True)
    
    def __str__(self):
        return f"{self.title} ({self.source_language} → {self.target_language})"
    
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
    
    def __str__(self):
        return f"Translation of {self.book.title} - {self.status}"
