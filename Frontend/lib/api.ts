import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log(API_BASE_URL,"API_BA");
const api = axios.create({
    baseURL: API_BASE_URL,
});
export async function uploadPDF(formData: FormData) {
    const response = await api.post("pdf/upload_pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}

export async function runQuery(query: string, ragType: string) {
    const response = await api.post("/query", {
        query,
        rag_type: ragType,
    });
    return response.data;
}
