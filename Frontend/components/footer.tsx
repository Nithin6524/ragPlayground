import { Github, ExternalLink, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-sm"></div>
      <div className="relative container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-gray-300 mb-2 flex items-center justify-center md:justify-start">
              Built with <Heart className="h-4 w-4 mx-2 text-pink-400" /> using Next.js, Tailwind CSS, and modern AI
              technologies
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto md:mx-0"></div>
          </div>

          <div className="flex items-center space-x-8 text-sm text-gray-300">
            <a
              href="#"
              className="flex items-center hover:text-white transition-colors group"
              aria-label="View GitHub repository"
            >
              <Github className="h-5 w-5 mr-2 group-hover:text-purple-400 transition-colors" />
              GitHub
            </a>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Powered by</span>
              <a
                href="https://jina.ai"
                className="hover:text-purple-400 transition-colors flex items-center group"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jina AI
                <ExternalLink className="h-3 w-3 ml-1 group-hover:text-purple-400 transition-colors" />
              </a>
              <a
                href="https://groq.com"
                className="hover:text-blue-400 transition-colors flex items-center group"
                target="_blank"
                rel="noopener noreferrer"
              >
                Groq
                <ExternalLink className="h-3 w-3 ml-1 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="https://qdrant.tech"
                className="hover:text-indigo-400 transition-colors flex items-center group"
                target="_blank"
                rel="noopener noreferrer"
              >
                Qdrant
                <ExternalLink className="h-3 w-3 ml-1 group-hover:text-indigo-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
