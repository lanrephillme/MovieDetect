"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Mic, ImageIcon, Video, Music, User, Sparkles, ArrowRight, Home, Zap } from "lucide-react"

interface SearchPlaceholderProps {
  searchType?: "text" | "voice" | "image" | "audio" | "video" | "face"
  query?: string
}

export function SearchPlaceholder({ searchType = "text", query }: SearchPlaceholderProps) {
  const [progress, setProgress] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Animate progress bar
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 75 ? 75 : prev + 1))
    }, 50)

    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }))
    setParticles(newParticles)

    return () => clearInterval(timer)
  }, [])

  const getSearchIcon = () => {
    switch (searchType) {
      case "voice":
        return <Mic className="w-8 h-8" />
      case "image":
        return <ImageIcon className="w-8 h-8" />
      case "audio":
        return <Music className="w-8 h-8" />
      case "video":
        return <Video className="w-8 h-8" />
      case "face":
        return <User className="w-8 h-8" />
      default:
        return <Search className="w-8 h-8" />
    }
  }

  const getSearchLabel = () => {
    switch (searchType) {
      case "voice":
        return "Voice Search"
      case "image":
        return "Image Search"
      case "audio":
        return "Audio Search"
      case "video":
        return "Video Search"
      case "face":
        return "Face Recognition"
      default:
        return "Text Search"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-teal-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          {/* Search Icon with Pulse Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-r from-teal-500 to-emerald-500 p-6 rounded-full text-white">
                {getSearchIcon()}
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              MovieDetect
            </span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6">{getSearchLabel()} Coming Soon</h2>

          {/* Search Query Display */}
          {query && (
            <Card className="mb-8 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-teal-500 text-teal-400">
                    {getSearchLabel()}
                  </Badge>
                  <span className="text-white font-medium">"{query}"</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Development Status */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-medium text-white">Development in Progress</span>
            </div>

            <div className="bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{progress}% Complete</p>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            We're building an revolutionary AI-powered search experience that will let you find movies using{" "}
            <span className="text-teal-400 font-semibold">voice commands</span>,{" "}
            <span className="text-emerald-400 font-semibold">images</span>,{" "}
            <span className="text-blue-400 font-semibold">audio clips</span>, and even{" "}
            <span className="text-purple-400 font-semibold">facial recognition</span>.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Mic className="w-5 h-5" />, label: "Voice Search", color: "text-teal-400" },
              { icon: <ImageIcon className="w-5 h-5" />, label: "Image Search", color: "text-emerald-400" },
              { icon: <Music className="w-5 h-5" />, label: "Audio Search", color: "text-blue-400" },
              { icon: <Video className="w-5 h-5" />, label: "Video Search", color: "text-purple-400" },
              { icon: <User className="w-5 h-5" />, label: "Face Recognition", color: "text-pink-400" },
              { icon: <Sparkles className="w-5 h-5" />, label: "AI Powered", color: "text-yellow-400" },
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className={`${feature.color} mb-2 flex justify-center`}>{feature.icon}</div>
                  <p className="text-sm text-gray-300">{feature.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              onClick={() => (window.location.href = "/features")}
            >
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Coming Soon Badge */}
          <div className="mt-8">
            <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 text-sm">
              🚀 Launching Soon - Stay Tuned!
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
