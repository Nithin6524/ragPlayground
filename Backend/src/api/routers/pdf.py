from fastapi import APIRouter, UploadFile, File, HTTPException
import PyPDF2

router = APIRouter(prefix="/pdf", tags=["PDF"])

@router.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    try:
        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        page_numbers = []
        for page_num, page in enumerate(pdf_reader.pages, 1):
            page_text = page.extract_text() or ""
            text += page_text
            page_numbers.append(page_num)
        
        # Mock Qdrant storage (to be replaced later)
        mock_storage = {"filename": file.filename, "text": text, "pages": page_numbers}
        
        return {
            "message": f"PDF {file.filename} processed",
            "text": text[:200],  # Return first 200 chars for testing
            "pages": page_numbers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")