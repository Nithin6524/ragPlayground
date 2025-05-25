from fastapi import FastAPI

app = FastAPI(title="RAG Playground")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}