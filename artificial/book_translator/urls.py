"""
URL configuration for book_translator project.
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

from books.api import books_api
from translations.api import translations_api

urlpatterns = [
    path('admin/', admin.site.urls),
    # New APIs from refactored apps
    path('api/books/', books_api.urls),
    path('api/translations/', translations_api.urls),
    # Redirect root to API docs
    path('', RedirectView.as_view(url='/api/books/docs'), name='home'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
