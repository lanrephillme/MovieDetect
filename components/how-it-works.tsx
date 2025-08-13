"use client"

import { Search, Upload, Mic, Video, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Describe Your Memory",
      description: "Tell us what you remember about the movie - a scene, quote, or character detail.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Upload,
      title: "Upload Media",
      description: "Share screenshots, audio clips, or video snippets from the movie you're looking for.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Mic,
      title: "Hum the Soundtrack",
      description: "Can't remember the name but know the tune? Hum or sing the soundtrack for instant recognition.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: Sparkles,
      title: "AI Analysis",
      description: "Our advanced AI processes your input using computer vision, audio recognition, and NLP.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get accurate movie matches with confidence scores and detailed information in seconds.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Video,
      title: "Watch & Enjoy",
      description: "Access trailers, cast info, streaming options, and add movies to your personal watchlist.",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How MovieDetect{" "}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform uses cutting-edge technology to identify movies from any type of input you provide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="relative group bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500" />

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex items-center mb-3">
                    <span className="text-2xl font-bold text-teal-400 mr-3">{index + 1}</span>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  </div>

                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Find Your Movie?</h3>
            <p className="text-gray-300 mb-6">
              Join thousands of movie enthusiasts who've discovered their forgotten favorites with MovieDetect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold px-8 py-3"
              >
                Start Searching Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
