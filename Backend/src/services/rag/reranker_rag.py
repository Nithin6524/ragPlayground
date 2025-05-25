from src.api.dependencies import get_jina_embedding, get_qdrant_client, get_groq_client, get_jina_reranker
from src.core.logger import logger
from qdrant_client.http.models import Filter, FieldCondition
import time

def reranker_rag(query: str):
    try:
        start_time = time.time()
        logger.info(f"Processing Reranker RAG query: {query}")
        
        # Embed query
        query_embedding = get_jina_embedding(query)
        logger.info("Generated query embedding")
        
        # Search Qdrant
        client = get_qdrant_client()
        search_result = client.search(
            collection_name="rag_playground",
            query_vector=query_embedding,
            limit=5
        )
        documents = [hit.payload["text"] for hit in search_result]
        context = [
            {"text": hit.payload["text"], "filename": hit.payload["filename"], "pages": hit.payload["pages"]}
            for hit in search_result
        ]
        logger.info(f"Retrieved {len(context)} chunks from Qdrant")
        
        # Rerank with Jina
        scores = get_jina_reranker(query, documents)
        sorted_pairs = sorted(zip(scores, context), key=lambda x: x[0], reverse=True)
        top_context = [pair[1] for pair in sorted_pairs[:3]]
        top_scores = [pair[0] for pair in sorted_pairs[:3]]
        logger.info(f"Reranked to {len(top_context)} chunks")
        
        # Generate response with Groq
        groq_client = get_groq_client()
        prompt = f"Query: {query}\nContext: {top_context}\nAnswer concisely:"
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
            "context": top_context,
            "response_time": round(response_time, 2),
            "reranker_scores": [round(score, 3) for score in top_scores]
        }
    except Exception as e:
        logger.error(f"Reranker RAG failed: {str(e)}")
        raise Exception(f"Reranker RAG failed: {str(e)}")