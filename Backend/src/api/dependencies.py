from qdrant_client import QdrantClient
from src.core.config import settings

def get_qdrant_client():
    return QdrantClient(
        url=settings.qdrant_url,
        api_key=settings.qdrant_api_key
    )