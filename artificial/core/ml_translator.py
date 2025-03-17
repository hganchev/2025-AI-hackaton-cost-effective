from transformers import MarianMTModel, MarianTokenizer
import torch
import os
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

def split_text_into_chunks(text: str, chunk_size: int = 2000) -> List[str]:
    """Split text into chunks of approximately equal size"""
    # Split into sentences first (simple approach)
    sentences = text.replace('\n', ' ').split('.')
    
    chunks = []
    current_chunk = []
    current_size = 0
    
    for sentence in sentences:
        sentence = sentence.strip() + '.'  # Add back the period
        sentence_size = len(sentence)
        
        if current_size + sentence_size > chunk_size and current_chunk:
            # Save current chunk and start a new one
            chunks.append(' '.join(current_chunk))
            current_chunk = [sentence]
            current_size = sentence_size
        else:
            # Add sentence to current chunk
            current_chunk.append(sentence)
            current_size += sentence_size
    
    # Add the last chunk if it exists
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

def get_supported_languages() -> List[str]:
    """Get a list of supported language pairs"""
    # Currently supported languages (can be expanded)
    return [
        "en", "es", "fr", "de", "ru", "zh", "ja", "ko", "ar", "bg"
    ]