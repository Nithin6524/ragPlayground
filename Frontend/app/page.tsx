"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { UploadForm } from "@/components/uploadForm";
import { QueryForm } from "@/components/queryForm";
import { ResultsComparison } from "@/components/resultsComparison";
import { Footer } from "@/components/footer";

export default function RAGPlayground() {
    const [queryResults, setQueryResults] = useState<any[]>([]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <Header />

                <main className="container mx-auto px-4 py-8 space-y-8">
                    <UploadForm />
                    <QueryForm onResults={setQueryResults} />
                    <ResultsComparison results={queryResults} />
                </main>

                <Footer />
            </div>
        </div>
    );
}
