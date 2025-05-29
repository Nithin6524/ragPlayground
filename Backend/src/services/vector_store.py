from qdrant_client.http import models
from src.api.dependencies import get_qdrant_client
import uuid

def store_pdf_data(filename: str, text: str, page_numbers: list[int], embedding: list[float]):
    client = get_qdrant_client()
    
    # Create collection if not exists
    try:
        client.create_collection(
            collection_name="rag_playground",
            vectors_config=models.VectorParams(size=len(embedding), distance=models.Distance.COSINE)
        )
    except Exception as e:
        if "already exists" not in str(e).lower():
            raise e
    
    point_id = str(uuid.uuid4())
    client.upsert(
        collection_name="rag_playground",
        points=[
            models.PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "filename": filename,
                    "text": text,  
                    "pages": page_numbers
                }
            )
        ]
    )
    return {"point_id": point_id, "filename": filename, "pages": page_numbers}
