from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def home(request):
    """
    Homepage view that redirects to the API documentation.
    """
    return redirect('api-docs')  # Django Ninja API docs URL

def about(request):
    """
    About page with information about the book translation service.
    """
    context = {
        'title': 'Book Translator',
        'description': 'ML-powered service for translating books.',
    }
    return HttpResponse("""
        <html>
            <head>
                <title>Book Translator</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #333; }
                    a { color: #0066cc; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    .container { background: #f9f9f9; padding: 20px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Book Translator API</h1>
                    <p>This is a machine learning powered service for translating books.</p>
                    <p>Use our API to translate books from URLs or uploaded files.</p>
                    <p><a href="/api/docs">API Documentation</a></p>
                </div>
            </body>
        </html>
    """)
