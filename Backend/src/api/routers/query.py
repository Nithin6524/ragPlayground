from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.services.rag.base_rag import basic_rag
from src.services.rag.self_query_rag import self_query_rag
from src.services.rag.reranker_rag import reranker_rag
from src.core.logger import logger

router = APIRouter(prefix="/query", tags=["Query"])

class QueryRequest(BaseModel):
    query: str
    rag_type: str = "basic"

@router.post("/")
async def query(request: QueryRequest):
    try:
        logger.info(f"Received query: {request.query}, type: {request.rag_type}")
        if request.rag_type == "basic":
            result = basic_rag(request.query)
        elif request.rag_type == "self_query":
            result = self_query_rag(request.query)
        elif request.rag_type == "reranker":
            result = reranker_rag(request.query)
        else:
            raise HTTPException(status_code=400, detail="Invalid RAG type")
        
        return {
            "answer": result["answer"],
            "context": result["context"],
            "response_time": result["response_time"],
            "rag_type": request.rag_type,
            "rephrased_query": result.get("rephrased_query", None),
            "reranker_scores": result.get("reranker_scores", None)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))