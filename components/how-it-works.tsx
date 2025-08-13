"use client"

import { Search, ImageIcon, Mic, Video, Brain, Zap } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Text Search",
    description: "Search for movies using natural language descriptions, plot details, or any text-based queries.",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: ImageIcon,
    title: "Image Recognition",
    description: "Upload movie posters, screenshots, or any image to find similar movies instantly.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Mic,
    title: "Voice Search",
    description: "Speak your movie preferences and let our AI understand what you're looking for.",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Video,
    title: "Video Analysis",
    description: "Upload video clips or trailers to find movies with similar scenes, style, or content.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Get personalized movie suggestions powered by advanced machine learning algorithms.",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Lightning-fast search results with detailed movie information and streaming availability.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How MovieDetect Works</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover movies like never before with our revolutionary AI-powered search technology. Find exactly what
            you're looking for using multiple input methods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative bg-gray-900 rounded-xl p-8 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${feature.bgColor} mb-6`}>
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>

                <div className="absolute top-4 right-4 text-gray-700 font-bold text-2xl">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-6 py-3">
            <Brain className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Powered by Advanced AI Technology</span>
          </div>
        </div>
      </div>
    </section>
  )
}
