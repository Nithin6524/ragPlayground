"use client";

import type React from "react";
import { useState } from "react";
import {
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { uploadPDF } from "../lib/api";

export function UploadForm() {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<
        "idle" | "success" | "error"
    >("idle");
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadStatus("idle");

        try {
            // Upload each file to backend
            const fileNames: string[] = [];
            for (const file of files) {
                if (!file.name.endsWith(".pdf")) {
                    throw new Error("Only PDF files are allowed");
                }
                const response = await uploadPDF(file);
                fileNames.push(file.name);
            }
            setUploadedFiles(fileNames);
            setUploadStatus("success");
        } catch (error: any) {
            setUploadStatus("error");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="relative">
                {/* Glass morphism card */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl  transition-all duration-300"></div>
                <div className="relative border border-white/40 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full blur-lg opacity-50"></div>
                                <div className="relative bg-gradient-to-r from-purple-500 to-violet-500 p-4 rounded-full">
                                    <Upload className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-white mt-6 mb-3">
                                Upload PDFs
                            </h2>
                            <p className="text-gray-300 text-lg">
                                Select one or more PDF files to analyze
                            </p>
                        </div>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf"
                                multiple
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                className="hidden"
                                id="pdf-upload"
                                aria-label="Upload PDF files"
                            />
                            <label
                                htmlFor="pdf-upload"
                                className={` relative inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                                    isUploading
                                        ? "bg-gray-500/50 cursor-not-allowed text-gray-300"
                                        : "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg  transform hover:scale-105"
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl blur opacity-0 transition-opacity duration-300"></div>
                                <div className="relative flex items-center">
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="-ml-1 mr-3 h-6 w-6" />
                                            Upload PDF(s)
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* Status Messages */}
                        {uploadStatus === "success" && (
                            <div className="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                                    <span className="text-green-300 font-semibold text-lg">
                                        PDFs processed successfully!
                                    </span>
                                </div>
                            </div>
                        )}

                        {uploadStatus === "error" && (
                            <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
                                    <span className="text-red-300 font-semibold text-lg">
                                        Upload failed. Please try again.
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Uploaded Files List */}
                        {uploadedFiles.length > 0 && (
                            <div className="mt-8 text-left">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Uploaded Files:
                                </h3>
                                <div className="space-y-3">
                                    {uploadedFiles.map((fileName, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center p-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
                                        >
                                            <FileText className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0" />
                                            <span className="text-gray-300 truncate">
                                                {fileName}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
