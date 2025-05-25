from src.api.dependencies import get_groq_client, get_jina_embedding, get_qdrant_client
from src.services.rag.base_rag import basic_rag
from src.core.logger import logger
import time

def self_query_rag(query: str):
    try:
        start_time = time.time()
        logger.info(f"Processing Self-Query RAG: {query}")
        
        # Rephrase query with Groq
        groq_client = get_groq_client()
        rephrase_prompt = f"Rephrase this query for clarity: {query}"
        rephrase_response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": rephrase_prompt}],
            max_tokens=50
        )
        rephrased_query = rephrase_response.choices[0].message.content
        logger.info(f"Rephrased query: {rephrased_query}")
        
        # Run Basic RAG with rephrased query
        result = basic_rag(rephrased_query)
        result["rephrased_query"] = rephrased_query
        result["response_time"] = round(time.time() - start_time, 2)
        
        return result
    except Exception as e:
        logger.error(f"Self-Query RAG failed: {str(e)}")
        raise Exception(f"Self-Query RAG failed: {str(e)}")