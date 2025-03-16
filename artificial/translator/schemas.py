from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Union
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

class TranslationStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed" 
    FAILED = "failed"

class BookBase(BaseModel):
    title: str
    author: Optional[str] = None
    source_language: LanguageEnum = LanguageEnum.ENGLISH
    target_language: LanguageEnum

class BookCreateFromURL(BookBase):
    url: HttpUrl

class BookCreateFromFile(BookBase):
    file_id: str  # Will be used to reference the uploaded file

class BookOut(BookBase):
    id: int
    created_at: datetime
    url: Optional[HttpUrl] = None
    file: Optional[str] = None

class TranslationBase(BaseModel):
    book_id: int

class TranslationOut(BaseModel):
    id: int
    book: BookOut
    created_at: datetime
    updated_at: datetime
    status: TranslationStatus
    translated_file: Optional[str] = None
    error_message: Optional[str] = None

class TranslationCreate(BaseModel):
    book_id: int

class TranslationList(BaseModel):
    translations: List[TranslationOut]

class ErrorResponse(BaseModel):
    detail: str