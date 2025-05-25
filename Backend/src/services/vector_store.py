def store_pdf_data(filename: str, text: str, page_numbers: list[int]):
    # Mock Qdrant storage (replace with real Qdrant later)
    mock_storage = {
        "filename": filename,
        "text": text[:200],  # Truncate for testing
        "pages": page_numbers,
        "mock_embedding": [0.1] * 768  # Fake 768-dim embedding
    }
    return mock_storage