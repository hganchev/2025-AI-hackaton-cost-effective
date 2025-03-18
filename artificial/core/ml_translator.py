from transformers import MarianMTModel, MarianTokenizer
import torch
import os
import re
import logging
from typing import List
from django.conf import settings

# Cache for loaded models and tokenizers
_model_cache = {}
_tokenizer_cache = {}

def get_model_name(source_lang: str, target_lang: str) -> str:
    """Get the Hugging Face model name for the language pair"""
    return f"Helsinki-NLP/opus-mt-{source_lang}-{target_lang}"

def load_model_and_tokenizer(source_lang: str, target_lang: str):
    """Load or get from cache the model and tokenizer for a language pair"""
    model_name = get_model_name(source_lang, target_lang)
    cache_key = f"{source_lang}-{target_lang}"
    
    if cache_key not in _model_cache:
        # Set cache directory for models
        cache_dir = os.path.join(settings.BASE_DIR, 'ml_models')
        os.makedirs(cache_dir, exist_ok=True)
        
        # Load model and tokenizer
        tokenizer = MarianTokenizer.from_pretrained(model_name, cache_dir=cache_dir)
        model = MarianMTModel.from_pretrained(model_name, cache_dir=cache_dir)
        
        # Cache them
        _model_cache[cache_key] = model
        _tokenizer_cache[cache_key] = tokenizer
    
    return _model_cache[cache_key], _tokenizer_cache[cache_key]

def translate_text(text: str, source_lang: str, target_lang: str, max_length: int = 400) -> str:
    """Translate text using the ML model"""
    # Load model and tokenizer
    model, tokenizer = load_model_and_tokenizer(source_lang, target_lang)
    
    # Move model to GPU if available
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)
    
    # Encode and translate
    encoded = tokenizer.encode(text, return_tensors="pt", max_length=max_length, truncation=True)
    encoded = encoded.to(device)
    
    # Generate translation
    translated = model.generate(encoded, max_length=max_length)
    
    # Decode and return
    return tokenizer.decode(translated[0], skip_special_tokens=True)

# Get a logger for this module
ml_logger = logging.getLogger(__name__)

def split_text_into_chunks(text: str, chunk_size: int = 1) -> List[str]:
    """Split text into chunks of approximately equal size while preserving sentence integrity"""
    # Preprocess and normalize text
    # Replace multiple whitespaces with a single space
    text = re.sub(r'\s+', ' ', text)
    
    # Normalize newlines for paragraph detection
    text = re.sub(r'\n+', '\n', text)
    
    # Split text into paragraphs
    paragraphs = text.split('\n')
    paragraphs = [p.strip() for p in paragraphs if p.strip()]
    
    try:
        # Try to use NLTK's sentence tokenizer
        import nltk
        try:
            # Specifically download the punkt tokenizer
            nltk.download('punkt', quiet=True)
            from nltk.tokenize import sent_tokenize
            
            # Split paragraphs into sentences using NLTK
            all_sentences = []
            for paragraph in paragraphs:
                sentences = sent_tokenize(paragraph)
                if sentences:
                    all_sentences.extend(sentences)
                    # Add an empty string as paragraph separator
                    all_sentences.append('')
            
            # Remove the last empty separator if it exists
            if all_sentences and not all_sentences[-1]:
                all_sentences.pop()
                
        except Exception as e:
            ml_logger.warning(f"NLTK sentence tokenization failed: {str(e)}. Using fallback method.")
            # Fallback to simple sentence splitting
            all_sentences = []
            for paragraph in paragraphs:
                # Simple regex-based sentence splitting (periods followed by space or end)
                simple_sentences = re.split(r'(?<=[.!?])\s+', paragraph)
                all_sentences.extend([s.strip() + ' ' for s in simple_sentences if s.strip()])
                all_sentences.append('')  # Paragraph separator
            
            if all_sentences and not all_sentences[-1]:
                all_sentences.pop()
    
    except ImportError:
        ml_logger.warning("NLTK not available. Using fallback sentence splitting method.")
        # Fallback if NLTK is not available at all
        all_sentences = []
        for paragraph in paragraphs:
            # Simple regex-based sentence splitting
            simple_sentences = re.split(r'(?<=[.!?])\s+', paragraph)
            all_sentences.extend([s.strip() + ' ' for s in simple_sentences if s.strip()])
            all_sentences.append('')  # Paragraph separator
        
        if all_sentences and not all_sentences[-1]:
            all_sentences.pop()
    
    # Now create chunks respecting sentence boundaries
    chunks = []
    current_chunk = []
    current_size = 0
    
    for sentence in all_sentences:
        sentence_size = len(sentence)
        
        # Check if it's a paragraph separator (empty string)
        if not sentence:
            if current_chunk:
                current_chunk.append('')  # Add paragraph break
                current_size += 1
            continue
        
        # If adding this sentence would exceed chunk size and we already have content
        if current_size + sentence_size > chunk_size and current_chunk:
            # Join current chunk, respecting paragraph structure
            chunk_text = ' '.join(filter(None, current_chunk))
            chunks.append(chunk_text)
            
            # Start a new chunk with current sentence
            current_chunk = [sentence]
            current_size = sentence_size
        else:
            # Add sentence to current chunk
            current_chunk.append(sentence)
            current_size += sentence_size
    
    # Add the last chunk if it exists
    if current_chunk:
        chunk_text = ' '.join(filter(None, current_chunk))
        chunks.append(chunk_text)
    
    return chunks

def get_supported_languages() -> List[str]:
    """Get a list of supported language pairs"""
    # Currently supported languages (can be expanded)
    return [
        "en", "es", "fr", "de", "ru", "zh", "ja", "ko", "ar", "bg"
    ]