from src.api.dependencies import get_groq_client, get_jina_embedding, get_qdrant_client
from src.services.rag.base_rag import basic_rag
from src.core.logger import logger
import time

def self_query_rag(query: str):
    try:
        start_time = time.time()
        logger.info(f"Processing Self-Query RAG: {query}")
        
        # Input validation
        if not query.strip():
            raise ValueError("Query cannot be empty")
        
        # Rephrase query with Groq
        groq_client = get_groq_client()
        rephrase_prompt = f"""Rephrase the following query to make it clearer and more specific for document search. Keep the core meaning but improve clarity and search effectiveness:

Query: {query}

Rephrased query:"""
        
        rephrase_response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": rephrase_prompt}],
            max_tokens=100,
            temperature=0.3
        )
        
        rephrased_query = rephrase_response.choices[0].message.content.strip()
        
        # Fallback to original query if rephrasing fails
        if not rephrased_query:
            logger.warning("Rephrasing returned empty result, using original query")
            rephrased_query = query
        
        logger.info(f"Rephrased query: {rephrased_query}")
        
        # Run Basic RAG with rephrased query
        result = basic_rag(rephrased_query)
        
        # Add self-query specific metadata
        result["original_query"] = query
        result["rephrased_query"] = rephrased_query
        result["response_time"] = round(time.time() - start_time, 2)
        
        logger.info(f"Self-Query RAG completed in {result['response_time']}s")
        return result
        
    except Exception as e:
        logger.error(f"Self-Query RAG failed: {str(e)}")
        raise Exception(f"Self-Query RAG failed: {str(e)}")