"use client";

import type React from "react";
import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { runQuery } from "../lib/api";

const RAG_TYPES = [
    {
        id: "basic",
        label: "Basic RAG",
        description: "Standard retrieval-augmented generation",
        gradient: "from-blue-500 to-cyan-500",
        bgGradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
        id: "self_query",
        label: "Self-Query RAG",
        description: "Query understanding and filtering",
        gradient: "from-purple-500 to-violet-500",
        bgGradient: "from-purple-500/20 to-pink-500/20",
    },
    {
        id: "reranker",
        label: "Reranker RAG",
        description: "Advanced result reranking",
        gradient: "from-indigo-500 to-purple-500",
        bgGradient: "from-indigo-500/20 to-purple-500/20",
    },
];

interface QueryFormProps {
    onResults: (results: any[]) => void;
}

export function QueryForm({ onResults }: QueryFormProps) {
    const [query, setQuery] = useState("");
    const [selectedRAGTypes, setSelectedRAGTypes] = useState<string[]>([
        "basic",
    ]);
    const [isQuerying, setIsQuerying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRAGTypeChange = (ragType: string) => {
        setSelectedRAGTypes((prev) =>
            prev.includes(ragType)
                ? prev.filter((type) => type !== ragType)
                : [...prev, ragType]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || selectedRAGTypes.length === 0) return;

        setIsQuerying(true);
        setError(null);

        try {
            const queryResults = [];
            for (const ragType of selectedRAGTypes) {
                const result = await runQuery(query, ragType);
                queryResults.push({ ...result, rag_type: ragType }); // Ensure rag_type is included
            }
            onResults(queryResults);
        } catch (error: any) {
            setError("Query failed: " + error.message);
        } finally {
            setIsQuerying(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="relative">
                <div className="absolute inset-0  rounded-2xl blur-xl"></div>
                <div className="relative  border border-white/40 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Sparkles className="h-8 w-8 text-purple-400 mr-3" />
                            <h2 className="text-3xl font-bold text-white">
                                Query Configuration
                            </h2>
                        </div>
                        <p className="text-gray-300 text-lg">
                            Enter your question and select RAG architectures to
                            compare
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label
                                htmlFor="query"
                                className="block text-lg font-semibold text-white mb-4"
                            >
                                Your Question
                            </label>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur"></div>
                                <div className="relative flex items-center">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-pink-700 z-10" />
                                    <input
                                        type="text"
                                        id="query"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        placeholder="Ask a question about your PDFs..."
                                        className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300  text-lg"
                                        aria-label="Enter your query"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-white mb-6">
                                Select RAG Architectures to Compare
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {RAG_TYPES.map((ragType) => (
                                    <div
                                        key={ragType.id}
                                        className="relative group"
                                    >
                                        <div
                                            className={`absolute inset-0 `}
                                        ></div>
                                        <label
                                            className={`relative block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                                selectedRAGTypes.includes(
                                                    ragType.id
                                                )
                                                    ? `border-white/40  bg-gradient-to-br ${ragType.bgGradient} backdrop-blur-sm`
                                                    : "border-white/20 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedRAGTypes.includes(
                                                    ragType.id
                                                )}
                                                onChange={() =>
                                                    handleRAGTypeChange(
                                                        ragType.id
                                                    )
                                                }
                                                className="sr-only"
                                                aria-label={`Select ${ragType.label}`}
                                            />
                                            <div className="flex items-start">
                                                <div
                                                    className={`flex-shrink-0 w-6 h-6 border-2 rounded-md mt-1 mr-4 ${
                                                        selectedRAGTypes.includes(
                                                            ragType.id
                                                        )
                                                            ? `bg-gradient-to-r ${ragType.gradient} border-transparent`
                                                            : "border-white/40"
                                                    }`}
                                                >
                                                    {selectedRAGTypes.includes(
                                                        ragType.id
                                                    ) && (
                                                        <svg
                                                            className="w-4 h-4 text-white ml-0.5 mt-0.5"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="min-h-22">
                                                    <div className="font-bold text-white text-lg mb-2">
                                                        {ragType.label}
                                                    </div>
                                                    <div className="text-gray-300">
                                                        {ragType.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={
                                    !query.trim() ||
                                    selectedRAGTypes.length === 0 ||
                                    isQuerying
                                }
                                className={`bg-gradient-to-r from-purple-600 to-violet-600  relative inline-flex items-center px-10 py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
                                    !query.trim() ||
                                    selectedRAGTypes.length === 0 ||
                                    isQuerying
                                        ? "bg-gray-500/50 cursor-not-allowed text-gray-400"
                                        : "bg-gradient-to-r text-white shadow-2xl cursor-pointer transform hover:scale-105"
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl blur opacity-0 "></div>
                                <div className="relative flex items-center text-gray-100">
                                    {isQuerying ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6" />
                                            Processing Query...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="-ml-1 mr-3 h-6 w-6" />
                                            Run Query
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center justify-center">
                                    <span className="text-red-300 font-semibold text-lg">
                                        {error}
                                    </span>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
