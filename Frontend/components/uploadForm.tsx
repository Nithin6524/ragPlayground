"use client";

import React, { useState, useEffect } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { uploadPDF } from "../lib/api"; // Your API helper
import { useUpload } from "../app/context/uploadContext";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
export function UploadForm() {
    const { isUploading, setIsUploading } = useUpload();
    const [file, setFile] = useState<File | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    // Poll progress every second while task is running
    useEffect(() => {
        if (!taskId) return;

        const interval = setInterval(async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/pdf/progress/${taskId}`
                );
                const { progress, status, filename } = response.data;
                setProgress(progress);
                setStatus(status);

                if (
                    progress >= 100 ||
                    status.toLowerCase().includes("failed")
                ) {
                    setIsUploading(false);
                    setMessage(
                        status.toLowerCase().includes("failed")
                            ? `Upload failed: ${status}`
                            : `${filename} processed successfully!`
                    );
                    setTaskId(null);
                    setFile(null);
                    clearInterval(interval);
                }
            } catch {
                setIsUploading(false);
                setMessage("Failed to fetch progress");
                setTaskId(null);
                setFile(null);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [taskId, setIsUploading]);

    // Handle file selection & upload
    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile || !selectedFile.name.endsWith(".pdf")) {
            setMessage("Please select a valid PDF file");
            return;
        }

        setFile(selectedFile);
        setIsUploading(true);
        setMessage(null);
        setProgress(0);
        setStatus("starting");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            const response = await uploadPDF(formData);
            setTaskId(response.task_id);
        } catch (error: any) {
            setIsUploading(false);
            setMessage(error.response?.data?.detail || "Upload failed");
            setFile(null);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="relative">
                <div className="absolute inset-0  rounded-2xl blur-xl transition-all duration-300"></div>
                <div className="relative border border-white/40 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="relative inline-block">
                                <div className="absolute inset-0  rounded-full blur-lg opacity-50"></div>
                                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-full">
                                    <Upload className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white mt-6 mb-3">
                                Upload PDF
                            </h2>
                            <p className="text-gray-300 text-lg">
                                Select a PDF file to analyze
                            </p>
                        </div>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={isUploading} // disable input while uploading
                                className="hidden"
                                id="pdf-upload"
                                aria-label="Upload PDF file"
                            />
                            <label
                                htmlFor="pdf-upload"
                                className={`relative inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                                    isUploading || !file
                                        ? "bg-gray-500/50 cursor-not-allowed text-gray-300"
                                        : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg transform hover:scale-105"
                                }`}

                                >
                                <div className="relative flex items-center">
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="-ml-1 mr-3 h-6 w-6" />
                                            Upload PDF
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>
                        {isUploading && (
                            <div className="mt-6">
                                <div className="text-white text-lg mb-2">
                                    {status}
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2.5">
                                    <div
                                        className="bg-gradient-to-r from-cyan-600 to-blue-500 h-2.5 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-white text-right mt-1">
                                    {progress.toFixed(0)}%
                                </div>
                            </div>
                        )}
                        {message && (
                            <div
                                className={`mt-6 p-4 rounded-xl backdrop-blur-sm ${
                                    message.toLowerCase().includes("failed") ||
                                    message.toLowerCase().includes("valid")
                                        ? "bg-red-500/20 border border-red-400/30"
                                        : "bg-green-500/20 border border-green-400/30"
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    {message.toLowerCase().includes("failed") ||
                                    message.toLowerCase().includes("valid") ? (
                                        <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
                                    ) : (
                                        <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                                    )}
                                    <span
                                        className={`font-semibold text-lg ${
                                            message
                                                .toLowerCase()
                                                .includes("failed") ||
                                            message
                                                .toLowerCase()
                                                .includes("valid")
                                                ? "text-red-300"
                                                : "text-green-300"
                                        }`}
                                    >
                                        {message}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
