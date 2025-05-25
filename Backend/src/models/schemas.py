from pydantic import BaseModel
from typing import List
class QueryRequest(BaseModel):
    query: str
    rag_type: str
class QueryResponse(BaseModel):
    answer: str
    context: List[dict]
    response_time: float