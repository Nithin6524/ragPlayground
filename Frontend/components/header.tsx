export function Header() {
  return (
    <header className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10 backdrop-blur-sm"></div>
      <div className="relative container mx-auto px-4 py-16 text-center">
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            RAG Playground
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>
        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Upload PDFs and compare <span className="text-purple-400 font-semibold">Basic</span>,{" "}
          <span className="text-blue-400 font-semibold">Self-Query</span>, and{" "}
          <span className="text-pink-400 font-semibold">Reranker</span> RAG architectures
        </p>
      </div>
    </header>
  )
}
