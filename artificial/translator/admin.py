from django.contrib import admin
from .models import Book, Translation

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'source_language', 'target_language', 'created_at')
    list_filter = ('source_language', 'target_language', 'created_at')
    search_fields = ('title', 'author')

@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    list_display = ('book', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('book__title',)
