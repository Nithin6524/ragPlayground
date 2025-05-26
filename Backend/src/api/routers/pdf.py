from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
import uuid

from src.services.pdf_processor import process_pdf_from_bytes  # updated function name

router = APIRouter(prefix="/pdf", tags=["PDF"])

# In-memory progress store (for demo; replace with Redis in prod)
progress_store = {}

@router.post("/upload_pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    task_id = str(uuid.uuid4())
    progress_store[task_id] = {"progress": 0, "status": "starting", "filename": file.filename}

    # Read bytes here to keep file open during request
    file_bytes = await file.read()

    # Schedule background processing
    background_tasks.add_task(process_pdf_from_bytes, file_bytes, file.filename, task_id, progress_store)

    return {"message": f"Started processing {file.filename}", "task_id": task_id}


@router.get("/progress/{task_id}")
async def get_progress(task_id: str):
    return progress_store.get(task_id, {"progress": 0, "status": "not found"})
