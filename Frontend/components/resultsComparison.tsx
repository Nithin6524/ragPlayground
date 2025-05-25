"use client";

import { useState } from "react";
import { ResultsCard } from "./resultsCard";
import { Search, Zap } from "lucide-react";

const RAG_TYPES = [
    { id: "basic", label: "Basic RAG", gradient: "from-blue-500 to-cyan-500" },
    {
        id: "self_query",
        label: "Self-Query RAG",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        id: "reranker",
        label: "Reranker RAG",
        gradient: "from-indigo-500 to-purple-500",
    },
];

interface ResultsComparisonProps {
    results: Array<{
        answer: string;
        context: Array<{ text: string; filename: string; pages: number[] }>;
        response_time: number;
        rag_type: string;
        rephrased_query?: string | null;
        reranker_scores?: number[] | null;
    }>;
}

export function ResultsComparison({ results }: ResultsComparisonProps) {
    const [activeTab, setActiveTab] = useState("basic");

    if (!results || results.length === 0) {
        return (
            <div className="max-w-6xl mx-auto">
                <div className="relative group">
                    <div className="absolute inset-0 rounded-2xl blur-xl"></div>
                    <div className="relative  border rounded-2xl p-12 text-center">
                        <div className="text-gray-400">
                            <Search className="mx-auto h-16 w-16 mb-6" />
                            <p className="text-xl">
                                Run a query to see results comparison
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Debug results
    console.log("Results received:", results);

    // Map results to ResultsCard format
    const resultsMap = results.reduce((acc, result) => {
        if (!result || !result.rag_type) return acc; // Skip invalid results
        acc[result.rag_type] = {
            answer: result.answer || "No answer provided",
            context:
                result.context?.map((ctx) => ({
                    content: ctx.text || "",
                    source: ctx.filename || "Unknown",
                    page: ctx.pages[0] || 1,
                })) || [],
            responseTime: result.response_time || 0,
            score: result.reranker_scores
                ? Math.max(...result.reranker_scores)
                : null,
        };
        return acc;
    }, {} as Record<string, { answer: string; context: Array<{ content: string; source: string; page: number }>; responseTime: number; score: number | null }>);

    // Debug resultsMap
    console.log("Results map:", resultsMap);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-yellow-400 mr-3" />
                    <h2 className="text-3xl font-bold text-white">
                        Results Comparison
                    </h2>
                </div>
                <p className="text-gray-300 text-lg">
                    Compare outputs from different RAG architectures
                </p>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden mb-8">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2">
                    <nav className="flex space-x-1" aria-label="Tabs">
                        {RAG_TYPES.filter(
                            (ragType) => resultsMap[ragType.id]
                        ).map((ragType) => (
                            <button
                                key={ragType.id}
                                onClick={() => setActiveTab(ragType.id)}
                                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                    activeTab === ragType.id
                                        ? `bg-gradient-to-r ${ragType.gradient} text-white shadow-lg`
                                        : "text-gray-300 hover:text-white hover:bg-white/10"
                                }`}
                                aria-label={`View ${ragType.label} results`}
                            >
                                {ragType.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-6">
                    {resultsMap[activeTab] ? (
                        <ResultsCard
                            title={
                                RAG_TYPES.find((type) => type.id === activeTab)
                                    ?.label || ""
                            }
                            result={resultsMap[activeTab]}
                            gradient={
                                RAG_TYPES.find((type) => type.id === activeTab)
                                    ?.gradient || "from-blue-500 to-cyan-500"
                            }
                        />
                    ) : (
                        <p className="text-gray-400 text-center">
                            No results for {activeTab}
                        </p>
                    )}
                </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-8">
                {RAG_TYPES.filter((ragType) => resultsMap[ragType.id]).map(
                    (ragType) => (
                        <ResultsCard
                            key={ragType.id}
                            title={ragType.label}
                            result={resultsMap[ragType.id]}
                            gradient={ragType.gradient}
                        />
                    )
                )}
            </div>

            {/* Comparison Summary */}
            <div className="mt-12 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full mr-4"></div>
                        Comparison Summary
                    </h3>
                    <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
                        {results.map((result) => (
                            <p key={result.rag_type}>
                                •{" "}
                                <strong
                                    className={`text-${
                                        result.rag_type === "basic"
                                            ? "blue"
                                            : result.rag_type === "self_query"
                                            ? "purple"
                                            : "indigo"
                                    }-400`}
                                >
                                    {
                                        RAG_TYPES.find(
                                            (type) =>
                                                type.id === result.rag_type
                                        )?.label
                                    }
                                </strong>{" "}
                                {result.rag_type === "basic" &&
                                    "provided a concise, straightforward answer."}
                                {result.rag_type === "self_query" &&
                                    "offered comprehensive context with query refinement."}
                                {result.rag_type === "reranker" &&
                                    `delivered nuanced results with a relevance score of ${
                                        result.reranker_scores
                                            ? Math.max(
                                                  ...result.reranker_scores
                                              ).toFixed(2)
                                            : "N/A"
                                    }.`}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
