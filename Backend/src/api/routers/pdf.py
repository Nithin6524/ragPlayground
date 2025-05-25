from fastapi import APIRouter, UploadFile, File, HTTPException
import PyPDF2
from src.services.vector_store import store_pdf_data

router = APIRouter(prefix="/pdf", tags=["PDF"])

@router.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        page_numbers = []
        for page_num, page in enumerate(pdf_reader.pages, 1):
            page_text = page.extract_text() or ""
            text += page_text
            page_numbers.append(page_num)
        
        mock_storage = store_pdf_data(file.filename, text, page_numbers)
        
        return {
            "message": f"PDF {file.filename} processed",
            "text": text[:200],
            "pages": page_numbers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.post("/test-store")
async def test_store(filename: str = "test.pdf", text: str = "Sample text", pages: list[int] = [1]):
    result = store_pdf_data(filename, text, pages)
    return {"message": "Mock storage successful", "data": result}