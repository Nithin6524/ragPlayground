import io
import PyPDF2
import tiktoken
from src.api.dependencies import get_jina_embedding
from src.services.vector_store import store_pdf_data
from src.core.logger import logger

def chunk_text_by_tokens(text: str, max_tokens: int = 8192) -> list[str]:
    encoder = tiktoken.get_encoding("cl100k_base")
    tokens = encoder.encode(text)

    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]
        chunk_text = encoder.decode(chunk_tokens)
        chunks.append(chunk_text)

    return chunks

def process_pdf_from_bytes(file_bytes: bytes, filename: str, task_id: str, progress_store: dict):
    try:
        logger.info(f"Processing PDF: {filename}, Task ID: {task_id}")
        progress_store[task_id] = {"progress": 10, "status": "extracting text", "filename": filename}

        file_stream = io.BytesIO(file_bytes)
        pdf_reader = PyPDF2.PdfReader(file_stream)

        if not pdf_reader.pages:
            raise ValueError("No pages found in PDF.")

        all_point_ids = []
        extracted_text = ""
        total_pages = len(pdf_reader.pages)

        for page_num, page in enumerate(pdf_reader.pages, 1):
            page_text = page.extract_text() or ""
            if not page_text.strip():
                continue

            extracted_text += page_text
            text_chunks = chunk_text_by_tokens(page_text)

            progress_store[task_id] = {
                "progress":  (page_num / total_pages) * 100,
                "status": f"extracted page {page_num}/{total_pages}",
                "filename": filename
            }

            for i, chunk in enumerate(text_chunks):
                embedding = get_jina_embedding(chunk)
                result = store_pdf_data(
                    filename=filename,
                    text=chunk,
                    page_numbers=[page_num],
                    embedding=embedding
                )
                all_point_ids.append(result["point_id"])


        if not all_point_ids:
            raise ValueError("No meaningful text extracted from the PDF.")

        progress_store[task_id] = {"progress": 100, "status": "completed", "filename": filename}

    except Exception as e:
        logger.error(f"PDF processing failed: {str(e)}")
        progress_store[task_id] = {"progress": 0, "status": f"failed: {str(e)}", "filename": filename}
        
