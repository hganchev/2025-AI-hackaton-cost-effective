from typing import Optional
import PyPDF2
import docx
from ebooklib import epub
import os
import re
from bs4 import BeautifulSoup

class BookExtractor:
    """Utility class for extracting text content from various file formats"""
    
    @staticmethod
    def extract_from_book(book) -> str:
        """Extract text content from a book file"""
        if not book.file:
            raise ValueError("Book has no associated file")
            
        file_path = book.file.path
        file_format = book.file_format.lower() if book.file_format else None
        
        # If no format specified, try to detect from extension
        if not file_format:
            _, ext = os.path.splitext(file_path)
            file_format = ext.lstrip('.').lower()
        
        # Extract based on format
        if file_format == 'pdf':
            return BookExtractor._extract_from_pdf(file_path)
        elif file_format == 'epub':
            return BookExtractor._extract_from_epub(file_path)
        elif file_format == 'txt':
            return BookExtractor._extract_from_txt(file_path)
        elif file_format == 'docx':
            return BookExtractor._extract_from_docx(file_path)
        elif file_format in ['html', 'htm']:
            return BookExtractor._extract_from_html(file_path)
        elif file_format == 'md':
            return BookExtractor._extract_from_txt(file_path)  # Markdown is treated as text
        else:
            raise ValueError(f"Unsupported file format: {file_format}")
    
    @staticmethod
    def _extract_from_pdf(file_path: str) -> str:
        """Extract text from a PDF file"""
        text = []
        with open(file_path, 'rb') as file:
            pdf = PyPDF2.PdfReader(file)
            for page in pdf.pages:
                text.append(page.extract_text())
        return "\n\n".join(text)
    
    @staticmethod
    def _extract_from_epub(file_path: str) -> str:
        """Extract text from an EPUB file"""
        text = []
        book = epub.read_epub(file_path)
        for item in book.get_items_of_type(epub.ITEM_DOCUMENT):
            content = item.get_content().decode('utf-8')
            # Remove HTML tags
            soup = BeautifulSoup(content, 'html.parser')
            text.append(soup.get_text())
        return "\n\n".join(text)
    
    @staticmethod
    def _extract_from_txt(file_path: str) -> str:
        """Extract text from a plain text file"""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    
    @staticmethod
    def _extract_from_docx(file_path: str) -> str:
        """Extract text from a Word document"""
        doc = docx.Document(file_path)
        return "\n\n".join([paragraph.text for paragraph in doc.paragraphs])
    
    @staticmethod
    def _extract_from_html(file_path: str) -> str:
        """Extract text from an HTML file"""
        with open(file_path, 'r', encoding='utf-8') as file:
            soup = BeautifulSoup(file.read(), 'html.parser')
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            return soup.get_text()