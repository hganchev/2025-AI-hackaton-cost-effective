from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from books.schemas import BookOut

class TranslationStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed" 
    FAILED = "failed"

class TranslationBase(BaseModel):
    book_id: int

class TranslationCreate(TranslationBase):
    max_length: Optional[int] = 400  # Maximum length of tokens for translation
    chunk_size: Optional[int] = 2000  # Characters per chunk

class TranslationChunkOut(BaseModel):
    id: int
    chunk_index: int
    status: TranslationStatus
    translated_text: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    error_message: Optional[str] = None

class TranslationOut(BaseModel):
    id: int
    book: BookOut
    created_at: datetime
    updated_at: datetime
    status: TranslationStatus
    total_chunks: int
    completed_chunks: int
    error_message: Optional[str] = None

class TranslationDetailOut(TranslationOut):
    chunks: List[TranslationChunkOut]

class TranslationChunkRequest(BaseModel):
    translation_id: int
    chunk_index: int

class TranslationPaginatedOut(BaseModel):
    id: int
    book_id: int
    page_content: str
    total_pages: int
    current_page: int
    has_next: bool
    has_previous: bool

class TranslationList(BaseModel):
    translations: List[TranslationOut]

class ErrorResponse(BaseModel):
    detail: str