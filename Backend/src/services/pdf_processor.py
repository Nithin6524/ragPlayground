from __future__ import annotations

import PyPDF2
import requests
from fastapi import UploadFile
from src.services.vector_store import store_pdf_data
from src.core.config import settings
from src.core.logger import logger

def get_jina_embedding(text: str) -> list[float]:
    """Get embedding using Jina's HTTP API directly"""
    url = "https://api.jina.ai/v1/embeddings"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {settings.jina_api_key}"
    }
    data = {
        "model": "jina-embeddings-v2-base-en",
        "input": [text]
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    
    result = response.json()
    return result["data"][0]["embedding"]

def process_pdf(file: UploadFile):
    try:
        logger.info(f"Processing PDF: {file.filename}")
        # Extract text
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        page_numbers = []
        for page_num, page in enumerate(pdf_reader.pages, 1):
            page_text = page.extract_text() or ""
            text += page_text
            page_numbers.append(page_num)
        logger.info(f"Extracted text from {len(page_numbers)} pages")
        
        # Generate Jina AI embedding using HTTP API
        logger.info("Generating Jina AI embedding")
        embedding = get_jina_embedding(text)
        logger.info(f"Generated embedding of length {len(embedding)}")
        
        # Store in Qdrant
        storage_result = store_pdf_data(file.filename, text, page_numbers, embedding)
        logger.info(f"Stored in Qdrant with point_id: {storage_result['point_id']}")
        
        return {
            "filename": file.filename,
            "text": text[:200],
            "pages": page_numbers,
            "embedding": embedding[:5],
            "point_id": storage_result["point_id"]
        }
    except Exception as e:
        logger.error(f"PDF processing failed: {str(e)}")
        raise Exception(f"PDF processing failed: {str(e)}")