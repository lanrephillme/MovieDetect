"use client"

import { useState } from "react"
import { Search, Zap, Brain, Eye, Mic, ImageIcon, Film, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SearchPlaceholderProps {
  searchQuery?: string
  searchType?: string
  onClose?: () => void
}

export function SearchPlaceholder({ searchQuery, searchType, onClose }: SearchPlaceholderProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  const getSearchTypeIcon = (type: string) => {
    switch (type) {
      case "voice":
        return <Mic className="w-6 h-6" />
      case "image":
        return <ImageIcon className="w-6 h-6" />
      case "audio":
        return <Film className="w-6 h-6" />
      case "face":
        return <Eye className="w-6 h-6" />
      default:
        return <Search className="w-6 h-6" />
    }
  }

  const getSearchTypeLabel = (type: string) => {
    switch (type) {
      case "voice":
        return "Voice Search"
      case "image":
        return "Image Search"
      case "audio":
        return "Audio Search"
      case "face":
        return "Face Recognition"
      default:
        return "Text Search"
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-black to-emerald-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]" />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-teal-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Logo and Branding */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                MovieDetect
              </span>
            </div>

            {/* Search Type Indicator */}
            {searchType && (
              <Card className="bg-black/40 backdrop-blur-md border-gray-800 inline-block">
                <CardContent className="px-6 py-3">
                  <div className="flex items-center space-x-3 text-teal-400">
                    {getSearchTypeIcon(searchType)}
                    <span className="font-medium">{getSearchTypeLabel(searchType)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Animated Search Icon */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <div className={`transition-transform duration-1000 ${isAnimating ? "scale-110" : "scale-100"}`}>
                  <Search className="w-12 h-12 text-teal-400" />
                </div>
              </div>

              {/* Pulsing rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-teal-400/30 rounded-full animate-ping" />
                <div className="absolute w-32 h-32 border border-emerald-400/20 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">AI Search Coming Soon</h1>
              <p className="text-xl text-gray-300 max-w-lg mx-auto leading-relaxed">
                We're building something incredible. Our advanced AI-powered movie detection system is currently under
                development.
              </p>
            </div>

            {/* Search Query Display */}
            {searchQuery && (
              <Card className="bg-black/40 backdrop-blur-md border-gray-800 max-w-md mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-300 truncate">"{searchQuery}"</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
              {[
                { icon: <Mic className="w-5 h-5" />, label: "Voice" },
                { icon: <ImageIcon className="w-5 h-5" />, label: "Image" },
                { icon: <Film className="w-5 h-5" />, label: "Audio" },
                { icon: <Eye className="w-5 h-5" />, label: "Face" },
              ].map((feature, index) => (
                <Card key={index} className="bg-black/20 backdrop-blur-sm border-gray-800/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-teal-400 mb-2 flex justify-center">{feature.icon}</div>
                    <span className="text-sm text-gray-400">{feature.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Zap className="w-4 h-4 text-teal-400" />
                <span>Development in progress</span>
              </div>

              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="space-y-4 pt-4">
              <p className="text-gray-400">Want to be notified when it's ready?</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8"
                >
                  Back to Home
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent px-8"
                >
                  Get Notified
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500">Expected launch: Coming soon • Follow our progress for updates</p>
          </div>
        </div>
      </div>
    </div>
  )
}
