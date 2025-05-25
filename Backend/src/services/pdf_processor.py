import PyPDF2
import requests
import uuid
from fastapi import UploadFile
from src.services.vector_store import store_pdf_data
from src.core.config import settings
from src.core.logger import logger
import tiktoken

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
    return response.json()["data"][0]["embedding"]

def chunk_text_by_tokens(text: str, max_tokens: int = 8192) -> list[str]:
    """Split text into chunks based on max_tokens using tiktoken tokenizer"""
    encoder = tiktoken.get_encoding("cl100k_base")
    tokens = encoder.encode(text)

    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]
        chunk_text = encoder.decode(chunk_tokens)
        chunks.append(chunk_text)

    return chunks

def process_pdf(file: UploadFile):
    try:
        logger.info(f"Processing PDF: {file.filename}")

        pdf_reader = PyPDF2.PdfReader(file.file)
        if not pdf_reader.pages:
            raise ValueError("No pages found in PDF.")

        all_point_ids = []
        extracted_text = ""

        for page_num, page in enumerate(pdf_reader.pages, 1):
            page_text = page.extract_text() or ""
            if not page_text.strip():
                continue

            extracted_text += page_text
            # Token-based chunking for the current page
            text_chunks = chunk_text_by_tokens(page_text, max_tokens=8192)

            logger.info(f"Page {page_num}: split into {len(text_chunks)} chunks")

            for i, chunk in enumerate(text_chunks):
                logger.info(f"Generating embedding for page {page_num}, chunk {i + 1}")
                embedding = get_jina_embedding(chunk)

                result = store_pdf_data(
                    filename=file.filename,
                    text=chunk,
                    page_numbers=[page_num],
                    embedding=embedding
                )
                all_point_ids.append(result["point_id"])

        if not all_point_ids:
            raise ValueError("No meaningful text extracted from the PDF.")

        return {
            "filename": file.filename,
            "text": extracted_text[:200],
            "total_pages": len(pdf_reader.pages),
            "total_chunks": len(all_point_ids),
            "point_ids": all_point_ids
        }

    except Exception as e:
        logger.error(f"PDF processing failed: {str(e)}")
        raise RuntimeError(f"PDF processing failed: {str(e)}") from e
