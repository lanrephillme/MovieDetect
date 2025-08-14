"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "@/components/search-modal"
import { Play, Plus, Share2, Pause, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"

interface SearchResult {
  id: number
  title: string
  year: number
  poster: string
  backdrop: string
  rating: number
  genre: string[]
  synopsis: string
  confidence: number
  matchReason: string
  trailer: string
  streamingPlatforms: Array<{
    name: string
    icon: string
    link: string
    type: string
    price?: string
  }>
}

interface HeroMovie {
  id: number
  title: string
  year: number
  genre: string[]
  rating: number
  synopsis: string
  backdrop: string
  trailer: string
}

const featuredMovie = {
  id: 1,
  title: "Dune: Part Two",
  description:
    "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. When faced with a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
  year: 2024,
  rating: "8.8",
  duration: "166 min",
  genre: ["Sci-Fi", "Adventure", "Drama"],
  director: "Denis Villeneuve",
  cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
  backdrop: "/dune-part-two-poster.png",
  trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
}

export function MovieDetectHero() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSearchOpen) {
        setIsPlaying(true)
        if (videoRef.current) {
          videoRef.current.play()
        }
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isSearchOpen])

  useEffect(() => {
    const handleVideoEnd = () => {
      setIsPlaying(false)
      setShowControls(true)
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener("ended", handleVideoEnd)
      return () => video.removeEventListener("ended", handleVideoEnd)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleAddToWatchlist = () => {
    // Add to watchlist logic
    console.log("Added to watchlist:", featuredMovie.title)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: featuredMovie.title,
          text: featuredMovie.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      console.log("Link copied to clipboard")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {isPlaying ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            playsInline
            onPlay={() => setShowControls(false)}
            onPause={() => setShowControls(true)}
          >
            <source src={featuredMovie.trailer} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={featuredMovie.backdrop || "/placeholder.svg"}
            alt={featuredMovie.title}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E17]/90 via-[#0B0E17]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-transparent" />
      </div>

      {/* Video Controls */}
      {isPlaying && (
        <div className="absolute top-24 right-6 z-30 flex gap-2">
          <Button variant="ghost" size="sm" onClick={toggleMute} className="bg-black/50 text-white hover:bg-black/70">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto w-full text-center">
          {/* About MovieDetect Section */}
          <div className="mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Discover Movies with <span className="gradient-text">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-[#B3B3B3] max-w-3xl mx-auto mb-8 leading-relaxed">
              MovieDetect revolutionizes how you discover entertainment. Use our advanced AI-powered search to find
              movies and TV shows through text, voice, images, videos, audio clips, or even face recognition. Simply
              describe what you're looking for, upload a screenshot, hum a tune, or show us a face - our AI will find
              exactly what you need.
            </p>
          </div>

          {/* Search Methods Button */}
          <div className="mb-16">
            <Button
              onClick={() => setIsSearchOpen(true)}
              size="lg"
              className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] text-lg px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#00E6E6]/25"
            >
              Explore Search Methods
            </Button>
          </div>

          {/* Featured Movie Info */}
          {showControls && (
            <div className="animate-fadeIn">
              <div className="text-left max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{featuredMovie.title}</h2>
                <div className="flex items-center gap-4 text-[#B3B3B3] mb-4">
                  <span className="bg-[#00E6E6] text-[#0B0E17] px-2 py-1 rounded font-semibold">
                    ⭐ {featuredMovie.rating}
                  </span>
                  <span>{featuredMovie.year}</span>
                  <span>{featuredMovie.duration}</span>
                  <span>{featuredMovie.genre.join(", ")}</span>
                </div>
                <p className="text-[#B3B3B3] mb-6 leading-relaxed">{featuredMovie.description}</p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Play Trailer
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleAddToWatchlist}
                    variant="outline"
                    size="lg"
                    className="border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17] font-semibold bg-transparent"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add to Watchlist
                  </Button>

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-black font-semibold bg-transparent"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
