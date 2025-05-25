from src.api.dependencies import get_qdrant_client, get_jina_embedding, get_groq_client
from src.core.logger import logger
from qdrant_client.http.models import Filter, FieldCondition
import time

def basic_rag(query: str):
    try:
        start_time = time.time()
        logger.info(f"Processing Basic RAG query: {query}")
        
        # Embed query
        query_embedding = get_jina_embedding(query)
        logger.info("Generated query embedding")
        
        # Search Qdrant
        client = get_qdrant_client()
        search_result = client.search(
            collection_name="rag_playground",
            query_vector=query_embedding,
            limit=3
        )
        context = [
            {"text": hit.payload["text"], "filename": hit.payload["filename"], "pages": hit.payload["pages"]}
            for hit in search_result
        ]
        logger.info(f"Retrieved {len(context)} chunks from Qdrant")
        
        # Generate response with Groq
        groq_client = get_groq_client()
        prompt = f"Query: {query}\nContext: {context}\nAnswer concisely:"
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        answer = response.choices[0].message.content
        logger.info("Generated LLM response")
        
        response_time = time.time() - start_time
        return {
            "answer": answer,
            "context": context,
            "response_time": round(response_time, 2)
        }
    except Exception as e:
        logger.error(f"Basic RAG failed: {str(e)}")
        raise Exception(f"Basic RAG failed: {str(e)}")