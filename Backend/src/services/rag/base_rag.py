from src.api.dependencies import get_qdrant_client, get_jina_embedding, get_groq_client
from src.core.logger import logger
import time

def basic_rag(query: str):
    try:
        start_time = time.time()
        logger.info(f"Processing Basic RAG query: {query}")
        
        # Input validation
        if not query.strip():
            raise ValueError("Query cannot be empty")
        
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
        
        # Format context for LLM
        context_text = "\n\n".join([
            f"Source: {item['filename']} (pages {item['pages']})\nContent: {item['text']}"
            for item in context
        ])
        
        # Generate response with Groq
        groq_client = get_groq_client()
        prompt = f"Query: {query}\n\nContext:\n{context_text}\n\nAnswer concisely based on the context:"
        
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