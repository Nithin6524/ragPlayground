from qdrant_client import QdrantClient
import requests
from groq import Groq
from src.core.config import settings
from src.core.logger import logger

def get_qdrant_client():
    return QdrantClient(
        url=settings.qdrant_url,
        api_key=settings.qdrant_api_key
    )

def get_jina_embedding(text: str) -> list[float]:
    url = "https://api.jina.ai/v1/embeddings"
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {settings.jina_api_key}"}
    data = {"model": "jina-embeddings-v2-base-en", "input": [text]}
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()["data"][0]["embedding"]

def get_jina_reranker(query: str, documents: list[str]) -> list[float]:
    url = "https://api.jina.ai/v1/rerank"
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {settings.jina_api_key}"}
    data = {
        "model": "jina-reranker-v1-base-en",
        "query": query,
        "documents": documents
    }
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    result = response.json()
    logger.info(f"Jina reranker response: {result}")
    # Jina reranker returns scores in "results" with "relevance_score"
    return [item["relevance_score"] for item in result["results"]]

def get_groq_client():
    return Groq(api_key=settings.groq_api_key)