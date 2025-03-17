from django.contrib import admin
from .models import Book

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'source_language', 'target_language', 'file_format', 'created_at')
    list_filter = ('source_language', 'target_language', 'file_format', 'created_at')
    search_fields = ('title', 'author')
    readonly_fields = ('created_at',)