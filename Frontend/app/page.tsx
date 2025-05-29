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
        <div
            className="min-h-screen bg-black 
 relative overflow-hidden"
        >
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
