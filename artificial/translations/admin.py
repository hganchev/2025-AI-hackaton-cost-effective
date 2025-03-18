from django.contrib import admin
from .models import Translation, TranslationChunk

@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    list_display = ('id', 'book', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('book__title', 'book__author')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('book',)

@admin.register(TranslationChunk)
class TranslationChunkAdmin(admin.ModelAdmin):
    list_display = ('id', 'translation', 'chunk_index', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('translation__book__title', 'original_text', 'translated_text')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('translation',)