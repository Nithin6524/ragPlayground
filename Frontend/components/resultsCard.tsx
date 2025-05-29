"use client";

import { useState } from "react";
import { ChevronDown, Clock, Star, FileText } from "lucide-react";

interface ContextItem {
    content: string;
    source: string;
    page: number;
}

interface Result {
    answer: string;
    context: ContextItem[];
    responseTime: number;
    score: number | null;
}

interface ResultsCardProps {
    title: string;
    result: Result;
    gradient: string;
}

export function ResultsCard({ title, result, gradient }: ResultsCardProps) {
    const [showContext, setShowContext] = useState(false);

    return (
        <div className="relative group h-full">
            {/* Glow effect */}
            <div
                className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-all duration-300`}
            ></div>

            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl h-full flex flex-col">
                {/* Header with gradient border */}
                <div
                    className={`bg-gradient-to-r ${gradient} p-0.5 rounded-t-2xl`}
                >
                    <div className="bg-black/20 backdrop-blur-sm rounded-t-2xl p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center text-blue-300 bg-gray-400/50 px-3 py-1 rounded-full">
                                    <Clock className="h-4 w-4 mr-1 brightness-200" />
                                    <span className="text-white font-bold">
                                        {result.responseTime}s
                                    </span>
                                </div>
                                {result.score && (
                                    <div className="flex items-center text-yellow-300 bg-yellow-500/20 px-3 py-1 rounded-full">
                                        <Star className="h-4 w-4 mr-1" />
                                        <span className="font-semibold">
                                            {result.score}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    {/* Answer */}
                    <div className="mb-6 flex-1">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                            Answer
                        </h4>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                            <p className="text-gray-200 leading-relaxed text-lg">
                                {result.answer}
                            </p>
                        </div>
                    </div>

                    {/* Context Toggle */}
                    <div className="border-t border-white/10 pt-6">
                        <button
                            onClick={() => setShowContext(!showContext)}
                            className="flex items-center justify-between w-full text-left text-gray-300 hover:text-white transition-colors group"
                            aria-expanded={showContext}
                            aria-label={`${
                                showContext ? "Hide" : "Show"
                            } context sources`}
                        >
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                <span className="font-semibold">
                                    Retrieved Context ({result.context.length}{" "}
                                    chunks)
                                </span>
                            </div>
                            <div
                                className={`transform transition-transform duration-200 ${
                                    showContext ? "rotate-180" : ""
                                }`}
                            >
                                <ChevronDown className="h-5 w-5" />
                            </div>
                        </button>

                        {showContext && (
                            <div className="mt-4 space-y-4">
                                {result.context.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                                    >
                                        <p className="text-gray-300 mb-3 leading-relaxed overflow-auto h-72 ">
                                            {item.content}
                                        </p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-200 bg-amber-700/30 font-semibold  px-2 py-1 rounded">
                                                {item.source}
                                            </span>
                                            <span
                                                className={`text-white bg-gray-300/30  p-1.5 rounded `}
                                            >
                                                Page {item.page}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
