# RAG Playground

## Overview

RAG Playground is a web application for uploading PDF documents, querying their content using multiple Retrieval-Augmented Generation (RAG) architectures, and comparing results. It features a responsive UI built with Next.js and Tailwind CSS, a FastAPI backend for PDF processing, and Qdrant for vector storage. Users can upload PDFs, ask questions, select from three RAG pipelines (Basic, Self-Query, Reranker), and view detailed comparisons of answers, context, response times, and relevance scores.

## Features

- **PDF Upload**: Upload one or more PDFs for text extraction and embedding generation.
- **Multi-RAG Queries**: Query PDFs using Basic RAG, Self-Query RAG, or Reranker RAG architectures.
- **Results Comparison**: Compare RAG outputs with answers, retrieved context, response times, and scores in a responsive UI (mobile tabs, desktop grid).
- **Modern UI**: Glassmorphism design with vibrant gradients, built with Tailwind CSS and Lucide icons.
- **Logging**: Backend logs (`logs/app.log`) for debugging and monitoring.


## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/rag-playground.git
   cd rag-playground
   ```

2. **Set Up the Frontend**:
   ```bash
   cd frontend
   npm install


3. **Set Up the Backend**:
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   - Create a `.env` file in `backend/`:
     ```
     JINA_API_KEY=your-jina-api-key
     GROK_API_KEY=your-grok-api-key
     QDRANT_URL=your-qdrant-url
     QDRANT_API_KEY=your-qdrant-api-key
     ```

4. **Configure Qdrant**:
   - Set up a Qdrant Cloud instance or local server.
   - Update `QDRANT_URL` and `QDRANT_API_KEY` in `backend/.env`.

## Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn main:app --reload --port 8000
   ```
   - The API will be available at `http://localhost:8000`.

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   - Open `http://localhost:3000` in your browser.

3. **Verify Setup**:
   - Upload a PDF using the upload form.
   - Query the PDF with different RAG types (Basic, Self-Query, Reranker).
   - Check results in the comparison section.
   - Monitor `backend/logs/app.log` for processing details.

## Project Structure

- `frontend/`: Next.js app with components (`UploadForm.tsx`, `QueryForm.tsx`, `ResultsComparison.tsx`, `ResultsCard.tsx`).
  - `context/`: uploadContext.tsx for maintaining uploading status of a pdf.
  - `components/`: Reusable UI components.
  - `lib/api.ts`: API client for backend calls.
  - `app/page.tsx`: Main page with app layout.
- `backend/`: FastAPI app for PDF processing and querying.
  - `src/api/routers/`: API endpoints (`pdf.py`, `query.py`).
  - `src/services/`: Core logic (`pdf_processor.py`, `vector_store.py`).
  - `logs/`: Log files (`app.log`).
  - `main.py`: FastAPI app entry point.


# ⚠️ RECOMMENDATION

### **Upload PDFs with fewer than 20 pages**  
### for **faster processing and easier checking**.


## Usage

1. **Upload PDFs**:
   - Use the upload form to select and upload PDF files.
   - PDFs are processed, and embeddings are stored in Qdrant.
2. **Query PDFs**:
   - Enter a question in the query form.
   - Select one or more RAG architectures (Basic, Self-Query, Reranker).
   - Submit to retrieve answers and context.
3. **Compare Results**:
   - View results in a mobile-friendly tabbed view or desktop grid.
   - Expand context to see retrieved chunks, sources, and page numbers.
   - Review the comparison summary for insights on RAG performance.


## Deployment

-The frontend is deployed on vercel
  **https://rag-playground-e18n.vercel.app/**

-The backend is deployed on Railway
  **https://ragplayground-production.up.railway.app/**
