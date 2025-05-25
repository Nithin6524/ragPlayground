from fastapi import FastAPI
from src.api.routers import pdf, query

app = FastAPI(title="RAG Playground")

app.include_router(pdf.router)
app.include_router(query.router)


@app.get("/")
def greeting():
    return {"greeting":"welcome to rag playground api"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/test-config")
async def test_config():
    from src.core.config import settings
    return {
        "jina_api_key": settings.jina_api_key[:4] + "****",
        "groq_api_key": settings.groq_api_key[:4] + "****",
        "qdrant_url": settings.qdrant_url,
        "qdrant_api_key": settings.qdrant_api_key[:4] + "****"
    }