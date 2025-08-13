"use client"

import { Search, ImageIcon, Mic, Video, Brain, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Search,
    title: "Text Search",
    description: "Simply type what you're looking for - movie titles, actors, directors, or even plot descriptions.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: ImageIcon,
    title: "Image Recognition",
    description: "Upload a screenshot, poster, or any image from a movie and we'll identify it instantly.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Mic,
    title: "Voice Search",
    description: "Speak naturally about the movie you're thinking of - our AI understands context and nuance.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Video,
    title: "Video Analysis",
    description: "Upload a video clip or trailer and we'll analyze it to find the exact movie or similar ones.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Brain,
    title: "AI Recommendations",
    description: "Get personalized movie suggestions based on your viewing history and preferences.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "All searches are processed in real-time with lightning-fast results and high accuracy.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How MovieDetect Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI technology makes finding movies effortless. Use any combination of search methods to
            discover your next favorite film.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-teal-50 px-6 py-3 rounded-full">
            <Brain className="w-5 h-5 text-teal-600" />
            <span className="text-teal-800 font-medium">Powered by Advanced AI & Machine Learning</span>
          </div>
        </div>
      </div>
    </section>
  )
}
