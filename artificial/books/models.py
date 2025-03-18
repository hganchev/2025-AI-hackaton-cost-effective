from django.db import models
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError

def validate_book_file(file):
    """Validate the size of the uploaded book file."""
    # 50MB file size limit
    max_size = 50 * 1024 * 1024
    if file.size > max_size:
        raise ValidationError(f'File size must be no more than {max_size/1024/1024}MB')

class Book(models.Model):
    """Model representing a book to be translated"""
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    source_language = models.CharField(max_length=50, default='en')
    target_language = models.CharField(max_length=50)
    file = models.FileField(
        upload_to='books/', 
        null=True, 
        blank=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=['pdf', 'epub', 'txt', 'docx', 'html', 'md']
            ),
            validate_book_file
        ],
        help_text="Supported formats: PDF, EPUB, TXT, DOCX, HTML, MD (max 50MB)"
    )
    url = models.URLField(max_length=500, null=True, blank=True)
    file_format = models.CharField(
        max_length=10, 
        null=True, 
        blank=True,
        choices=[
            ('pdf', 'PDF'),
            ('epub', 'EPUB'),
            ('txt', 'Plain Text'),
            ('docx', 'Word Document'),
            ('html', 'HTML'),
            ('md', 'Markdown'),
        ]
    )
    
    def __str__(self):
        return f"{self.title} ({self.source_language} → {self.target_language})"
    
    def save(self, *args, **kwargs):
        """Override save to automatically detect file format from file extension"""
        if self.file and not self.file_format:
            filename = self.file.name.lower()
            if filename.endswith('.pdf'):
                self.file_format = 'pdf'
            elif filename.endswith('.epub'):
                self.file_format = 'epub'
            elif filename.endswith('.txt'):
                self.file_format = 'txt'
            elif filename.endswith('.docx'):
                self.file_format = 'docx'
            elif filename.endswith('.html'):
                self.file_format = 'html'
            elif filename.endswith('.md'):
                self.file_format = 'md'
        super().save(*args, **kwargs)