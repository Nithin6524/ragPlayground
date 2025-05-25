import PyPDF2
from fastapi import UploadFile
from src.services.vector_store import store_pdf_data

def process_pdf(file: UploadFile):
    try:
        # Extract text
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        page_numbers = []
        for page_num, page in enumerate(pdf_reader.pages, 1):
            page_text = page.extract_text() or ""
            text += page_text
            page_numbers.append(page_num)
        
        # Mock Jina AI embedding
        mock_embedding = [0.1] * 768
        
        # Store in mock Qdrant
        storage_result = store_pdf_data(file.filename, text, page_numbers)
        
        return {
            "filename": file.filename,
            "text": text[:200],
            "pages": page_numbers,
            "embedding": mock_embedding[:5]
        }
    except Exception as e:
        raise Exception(f"PDF processing failed: {str(e)}")