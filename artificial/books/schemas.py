from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum

class LanguageEnum(str, Enum):
    ENGLISH = "en"
    SPANISH = "es"
    FRENCH = "fr"
    GERMAN = "de"
    RUSSIAN = "ru"
    CHINESE = "zh"
    JAPANESE = "ja"
    KOREAN = "ko"
    ARABIC = "ar"
    BULGARIAN = "bg"

class FileFormatEnum(str, Enum):
    PDF = "pdf"
    EPUB = "epub"
    TXT = "txt"
    DOCX = "docx"
    HTML = "html"
    MARKDOWN = "md"

class BookBase(BaseModel):
    title: str
    author: Optional[str] = None
    source_language: LanguageEnum = LanguageEnum.ENGLISH
    target_language: LanguageEnum

class BookCreateFromURL(BookBase):
    url: HttpUrl
    file_format: Optional[FileFormatEnum] = None  # Optional format hint for URL content

class BookCreateFromFile(BookBase):
    file_id: str  # Will be used to reference the uploaded file
    file_format: FileFormatEnum

class BookOut(BookBase):
    id: int
    created_at: datetime
    url: Optional[HttpUrl] = None
    file: Optional[str] = None
    file_format: Optional[FileFormatEnum] = None

class BookList(BaseModel):
    books: List[BookOut]

class ErrorResponse(BaseModel):
    detail: str