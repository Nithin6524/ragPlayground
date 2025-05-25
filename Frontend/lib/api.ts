import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
});

export async function checkHealth() {
    try {
        const response = await api.get("/health");
        return response.data;
    } catch (error) {
        throw new Error("Health check failed: " + error.message);
    }
}

export async function uploadPDF(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await api.post("/pdf/upload_pdf", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        throw new Error("PDF upload failed: " + error.message);
    }
}

export async function runQuery(query: string, ragType: string) {
    try {
        const response = await api.post("/query", { query, rag_type: ragType });
        console.log(API_BASE_URL,"BASE URL");
        return response.data;

    } catch (error) {
        throw new Error("Query failed: " + error.message);
    }
}
