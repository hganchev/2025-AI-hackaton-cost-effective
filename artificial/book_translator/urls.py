"""
URL configuration for book_translator project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from ninja import NinjaAPI

from books.api import books_api
from translations.api import translations_api

# Create a combined API router
api = NinjaAPI(
    title="Book Translation Service",
    version="1.0.0",
    description="Complete API for translating books with ML-based chunk processing",
)

# Add the sub-routers
api.add_router("/books", books_api)
api.add_router("/translations", translations_api)

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints
    path('api/', api.urls),
    # Redirect root to API docs
    path('', RedirectView.as_view(url='/api/docs', permanent=False), name='home'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
