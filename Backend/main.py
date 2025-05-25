from fastapi import FastAPI
from src.api.routers import pdf

app = FastAPI(title="RAG Playground")

app.include_router(pdf.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}