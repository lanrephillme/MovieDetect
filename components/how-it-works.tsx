import { Search, Brain, Zap, Target } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Search Your Way",
    description:
      "Describe a scene, upload a screenshot, hum a tune, or search by actor. Our AI understands multiple input types.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Advanced machine learning algorithms analyze your input using computer vision, natural language processing, and audio recognition.",
  },
  {
    icon: Target,
    title: "Precise Matching",
    description:
      "Our AI cross-references millions of movies, scenes, and metadata to find exact matches with confidence scores.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get comprehensive movie information, streaming availability, and personalized recommendations in seconds.",
  },
]

export function HowItWorks() {
  return (
    <div className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">How MovieDetect Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powered by cutting-edge AI technology, MovieDetect makes finding any movie effortless and accurate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full w-16 h-16 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
