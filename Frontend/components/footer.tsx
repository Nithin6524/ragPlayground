import { Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm"></div>
            <div className="relative container mx-auto px-4 py-12">
                <div className="flex flex-col items-center text-center">
                    <p className="text-gray-300 mb-2 flex items-center">
                        Built with
                        <Heart className="h-4 w-4 mx-2 text-pink-400" />
                        by{" "}
                        <span className="font-semibold text-blue-400 mx-1">
                            Nithin
                        </span>{" "}
                        for{" "}
                        <span className="font-semibold text-white mx-1">
                            RAG Playground
                        </span>
                    </p>
                    
                </div>
            </div>
        </footer>
    );
}
