"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Search, Mic, Camera, Upload, Volume2, VolumeX, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "./search-modal"

export function MovieDetectHero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showSearchGrid, setShowSearchGrid] = useState(true)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-play video after 3 seconds
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
            // Hide search grid and show Watch Now button after video starts
            setTimeout(() => {
              setShowSearchGrid(false)
            }, 2000)
          })
          .catch((error) => {
            console.log("Hero video autoplay failed:", error)
            setIsVideoPlaying(false)
          })
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
        setShowSearchGrid(true)
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
            setTimeout(() => {
              setShowSearchGrid(false)
            }, 1000)
          })
          .catch((error) => {
            console.log("Hero video play failed:", error)
            setIsVideoPlaying(false)
          })
      }
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const searchMethods = [
    {
      icon: Search,
      title: "Text Search",
      description: "Search by movie title, actor, or genre",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Mic,
      title: "Voice Search",
      description: "Describe the movie you're looking for",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Camera,
      title: "Image Search",
      description: "Upload a movie poster or screenshot",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Upload,
      title: "Audio Search",
      description: "Upload audio clip from the movie",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: Play,
      title: "Video Search",
      description: "Upload a video clip to find the movie",
      color: "from-red-500 to-red-600",
    },
    {
      icon: Camera,
      title: "Face Search",
      description: "Find movies by actor's face",
      color: "from-pink-500 to-pink-600",
    },
  ]

  return (
    <>
      <section className="relative h-screen overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            poster="/blade-runner-2049-cityscape.png"
            onError={(e) => {
              console.log("Hero video failed to load, using fallback image")
              setIsVideoPlaying(false)
            }}
          >
            <source src="/placeholder-trailer.mp4" type="video/mp4" />
          </video>

          {/* Fallback background image */}
          {!isVideoPlaying && (
            <img
              src="/blade-runner-2049-cityscape.png"
              alt="Hero Background"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />
          )}

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Video Controls */}
        <div className="absolute top-6 right-6 flex space-x-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 text-white hover:bg-black/70 rounded-full"
            onClick={handleVideoToggle}
          >
            <Play className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 text-white hover:bg-black/70 rounded-full"
            onClick={handleMuteToggle}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Find Any Movie
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Using AI
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-gray-200 mb-12 max-w-2xl leading-relaxed">
                Revolutionary AI-powered movie discovery. Search by voice, image, audio, video, or even describe what
                you remember.
              </p>

              {/* Search Methods Grid - Shown initially and when video is paused */}
              <div
                className={`transition-all duration-1000 ease-in-out ${
                  showSearchGrid ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {searchMethods.map((method, index) => (
                    <button
                      key={index}
                      onClick={() => setIsSearchOpen(true)}
                      className={`group relative p-6 rounded-xl bg-gradient-to-br ${method.color} hover:scale-105 transition-all duration-300 text-left`}
                    >
                      <div className="absolute inset-0 bg-black/20 rounded-xl group-hover:bg-black/10 transition-colors" />
                      <div className="relative">
                        <method.icon className="w-8 h-8 text-white mb-3" />
                        <h3 className="text-white font-semibold text-lg mb-2">{method.title}</h3>
                        <p className="text-white/80 text-sm">{method.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    size="lg"
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                  >
                    <Search className="w-6 h-6 mr-2" />
                    Start Searching
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                  >
                    <Info className="w-6 h-6 mr-2" />
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Watch Now Button - Shown when video is playing */}
              <div
                className={`transition-all duration-1000 ease-in-out ${
                  !showSearchGrid ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold">
                    <Play className="w-6 h-6 mr-2" />
                    Watch Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="w-6 h-6 mr-2" />
                    Search Movies
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                  >
                    <Info className="w-6 h-6 mr-2" />
                    More Info
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
