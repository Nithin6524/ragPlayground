from fastapi import APIRouter, UploadFile, File, HTTPException
from src.services.pdf_processor import process_pdf
from src.services.vector_store import store_pdf_data

router = APIRouter(prefix="/pdf", tags=["PDF"])

@router.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    try:
        result = process_pdf(file)
        return {
            "message": f"PDF {file.filename} processed",
            "text": result["text"],
            "pages": result["pages"],
            "embedding": result["embedding"],
            "point_id": result["point_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-store")
async def test_store(filename: str = "test.pdf", text: str = "Sample text", pages: list[int] = [1]):
    result = store_pdf_data(filename, text, pages, [0.1] * 768)
    return {"message": "Mock storage successful", "data": result}