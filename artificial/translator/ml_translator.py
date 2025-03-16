"""
ML Translation module for the Book Translator API.
Uses Hugging Face transformers for multilingual translation capabilities.
"""
import os
import torch
import logging
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from django.conf import settings

logger = logging.getLogger(__name__)

# Directory to cache the models
MODELS_CACHE_DIR = os.path.join(settings.BASE_DIR, 'ml_models')
os.makedirs(MODELS_CACHE_DIR, exist_ok=True)

# Available translation language pairs
LANGUAGE_PAIRS = {
    'en-es': 'Helsinki-NLP/opus-mt-en-es',  # English to Spanish
    'es-en': 'Helsinki-NLP/opus-mt-es-en',  # Spanish to English
    'en-de': 'Helsinki-NLP/opus-mt-en-de',  # English to German
    'de-en': 'Helsinki-NLP/opus-mt-de-en',  # German to English
    'en-fr': 'Helsinki-NLP/opus-mt-en-fr',  # English to French
    'fr-en': 'Helsinki-NLP/opus-mt-fr-en',  # French to English
    'en-ru': 'Helsinki-NLP/opus-mt-en-ru',  # English to Russian
    'ru-en': 'Helsinki-NLP/opus-mt-ru-en',  # Russian to English
    'en-zh': 'Helsinki-NLP/opus-mt-en-zh',  # English to Chinese
    'zh-en': 'Helsinki-NLP/opus-mt-zh-en',  # Chinese to English
    # Multilingual model for many language combinations
    'multi': 'facebook/m2m100_418M',
}

# Global cache to store loaded models and tokenizers
loaded_models = {}

def get_translator(source_lang, target_lang):
    """
    Get the appropriate translator model and tokenizer for the given language pair.
    
    Args:
        source_lang (str): Source language code
        target_lang (str): Target language code
        
    Returns:
        tuple: (model, tokenizer, model_type)
    """
    lang_pair = f"{source_lang}-{target_lang}"
    
    if lang_pair in loaded_models:
        logger.info(f"Using cached model for {lang_pair}")
        return loaded_models[lang_pair]
    
    # Check if we have a specific model for this language pair
    if lang_pair in LANGUAGE_PAIRS:
        model_name = LANGUAGE_PAIRS[lang_pair]
        logger.info(f"Loading dedicated model for {lang_pair}: {model_name}")
        
        try:
            # Load the model and tokenizer
            tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir=MODELS_CACHE_DIR)
            model = AutoModelForSeq2SeqLM.from_pretrained(model_name, cache_dir=MODELS_CACHE_DIR)
            model_type = "opus-mt"
            
            # Cache the loaded model
            loaded_models[lang_pair] = (model, tokenizer, model_type)
            return model, tokenizer, model_type
        
        except Exception as e:
            logger.error(f"Failed to load dedicated model for {lang_pair}: {str(e)}")
    
    # Fall back to multilingual model
    logger.info(f"Using multilingual model for {lang_pair}")
    model_name = LANGUAGE_PAIRS['multi']
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir=MODELS_CACHE_DIR)
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name, cache_dir=MODELS_CACHE_DIR)
        model_type = "m2m100"
        
        # Cache the loaded model
        loaded_models[lang_pair] = (model, tokenizer, model_type)
        return model, tokenizer, model_type
    
    except Exception as e:
        logger.error(f"Failed to load multilingual model: {str(e)}")
        raise

def translate_text(text, source_lang, target_lang, chunk_size=512):
    """
    Translate text from source language to target language.
    
    Args:
        text (str): Text to translate
        source_lang (str): Source language code
        target_lang (str): Target language code
        chunk_size (int): Max chunk size for translation to avoid memory issues
        
    Returns:
        str: Translated text
    """
    try:
        if not text or len(text.strip()) == 0:
            return ""
        
        # Get the appropriate model and tokenizer
        model, tokenizer, model_type = get_translator(source_lang, target_lang)
        
        # Split text into manageable chunks to avoid memory issues
        chunks = split_text_into_chunks(text, chunk_size)
        translated_chunks = []
        
        for chunk in chunks:
            # Process based on model type
            if model_type == "m2m100":
                # M2M100 requires language codes at the tokenizer level
                tokenizer.src_lang = source_lang
                inputs = tokenizer(chunk, return_tensors="pt", padding=True)
                translated_tokens = model.generate(
                    **inputs,
                    forced_bos_token_id=tokenizer.get_lang_id(target_lang),
                    max_length=int(len(chunk.split()) * 1.5) + 10,  # Reasonable length limit
                )
                translated_chunk = tokenizer.batch_decode(translated_tokens, skip_special_tokens=True)[0]
            
            else:  # opus-mt or other models
                # Create a translation pipeline
                translator = pipeline('translation', model=model, tokenizer=tokenizer)
                result = translator(chunk, max_length=int(len(chunk.split()) * 1.5) + 10)
                translated_chunk = result[0]['translation_text']
            
            translated_chunks.append(translated_chunk)
        
        # Join all translated chunks
        return ' '.join(translated_chunks)
    
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        # Return original text with error message if translation fails
        return f"[Translation Error: {str(e)}]\n\n{text}"

def split_text_into_chunks(text, chunk_size=512):
    """
    Split text into chunks of approximately chunk_size words.
    Try to split at paragraph or sentence boundaries when possible.
    
    Args:
        text (str): Text to split
        chunk_size (int): Maximum size of each chunk in words
        
    Returns:
        list: List of text chunks
    """
    # First split by paragraphs
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = []
    current_size = 0
    
    for para in paragraphs:
        # If a single paragraph is too large, split it by sentences
        if len(para.split()) > chunk_size:
            sentences = para.replace('. ', '.\n').split('\n')
            for sentence in sentences:
                sentence_size = len(sentence.split())
                
                if current_size + sentence_size <= chunk_size:
                    current_chunk.append(sentence)
                    current_size += sentence_size
                else:
                    # If the current chunk has content, add it to chunks
                    if current_chunk:
                        chunks.append(' '.join(current_chunk))
                    
                    # If a single sentence is too long, split it by words
                    if sentence_size > chunk_size:
                        words = sentence.split()
                        for i in range(0, len(words), chunk_size):
                            chunks.append(' '.join(words[i:i+chunk_size]))
                        current_chunk = []
                        current_size = 0
                    else:
                        current_chunk = [sentence]
                        current_size = sentence_size
        else:
            para_size = len(para.split())
            if current_size + para_size <= chunk_size:
                current_chunk.append(para)
                current_size += para_size
            else:
                # If the current chunk has content, add it to chunks
                if current_chunk:
                    chunks.append(' '.join(current_chunk))
                current_chunk = [para]
                current_size = para_size
    
    # Add the last chunk if it has content
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

def is_translation_available(source_lang, target_lang):
    """
    Check if translation is available for the given language pair
    
    Args:
        source_lang (str): Source language code
        target_lang (str): Target language code
        
    Returns:
        bool: True if translation is available
    """
    lang_pair = f"{source_lang}-{target_lang}"
    
    # Check if we have a specific model for this language pair
    if lang_pair in LANGUAGE_PAIRS:
        return True
    
    # For M2M100, check if both languages are in the supported languages
    # This is a simplified check - the actual supported language pairs in M2M100
    # are more extensive than what we're listing here
    supported_m2m100_langs = {
        'en', 'es', 'fr', 'de', 'ru', 'zh', 'ar', 'cs', 'it', 
        'ja', 'ko', 'nl', 'pl', 'pt', 'ro', 'tr', 'uk'
    }
    
    return source_lang in supported_m2m100_langs and target_lang in supported_m2m100_langs

def get_supported_languages():
    """
    Get a list of supported language pairs
    
    Returns:
        list: List of supported language codes
    """
    supported_langs = set()
    
    # Add all languages from dedicated models
    for lang_pair in LANGUAGE_PAIRS:
        if lang_pair != 'multi':
            src, tgt = lang_pair.split('-')
            supported_langs.add(src)
            supported_langs.add(tgt)
    
    # Add M2M100 supported languages
    m2m100_langs = {
        'en', 'es', 'fr', 'de', 'ru', 'zh', 'ar', 'cs', 'it', 
        'ja', 'ko', 'nl', 'pl', 'pt', 'ro', 'tr', 'uk'
    }
    supported_langs.update(m2m100_langs)
    
    return sorted(list(supported_langs))