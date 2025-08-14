"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  Play,
  Plus,
  Share,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Star,
  Clock,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

interface Movie {
  id: number
  title: string
  poster: string
  backdrop: string
  year: number
  rating: number
  genre: string[]
  synopsis: string
  duration: string
  director: string
  cast: string[]
  trailer: string
  isInWatchlist?: boolean
  aiConfidence?: number
  streamingPlatforms: Array<{
    name: string
    icon: string
    link: string
    type: string
    price?: string
  }>
  similarMovies: Array<{
    id: number
    title: string
    poster: string
    rating: number
    year: number
  }>
}

interface MovieDetailModalProps {
  movieId: number | null
  isOpen: boolean
  onClose: () => void
}

export function MovieDetailModal({ movieId, isOpen, onClose }: MovieDetailModalProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [userRating, setUserRating] = useState<"like" | "dislike" | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Mock movie data - in real app, this would come from API
  const mockMovieData: { [key: number]: Movie } = {
    1: {
      id: 1,
      title: "Blade Runner 2049",
      poster: "/blade-runner-2049-poster.png",
      backdrop: "/blade-runner-2049-cityscape.png",
      year: 2017,
      rating: 8.2,
      genre: ["Sci-Fi", "Thriller", "Drama"],
      synopsis:
        "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years. The film explores themes of identity, humanity, and what it means to be alive in a world where the line between human and artificial intelligence is increasingly blurred.",
      duration: "2h 44m",
      director: "Denis Villeneuve",
      cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Jared Leto"],
      trailer: "/placeholder-trailer.mp4",
      aiConfidence: 95,
      streamingPlatforms: [
        { name: "Netflix", icon: "/netflix-icon.png", link: "https://netflix.com", type: "subscription" },
        { name: "Prime Video", icon: "/prime-icon.png", link: "https://primevideo.com", type: "subscription" },
        { name: "Apple TV", icon: "/appletv-icon.png", link: "https://tv.apple.com", type: "rent", price: "$3.99" },
        {
          name: "Google Play",
          icon: "/googleplay-icon.png",
          link: "https://play.google.com",
          type: "buy",
          price: "$14.99",
        },
      ],
      similarMovies: [
        { id: 2, title: "The Matrix", poster: "/matrix-movie-poster.png", rating: 8.7, year: 1999 },
        { id: 3, title: "Interstellar", poster: "/interstellar-inspired-poster.png", rating: 8.6, year: 2014 },
        { id: 4, title: "Ex Machina", poster: "/ex-machina-poster.png", rating: 7.7, year: 2014 },
        { id: 5, title: "Her", poster: "/her-ai-romance-movie-poster.png", rating: 8.0, year: 2013 },
        { id: 6, title: "Arrival", poster: "/placeholder.svg", rating: 7.9, year: 2016 },
      ],
    },
  }

  useEffect(() => {
    if (isOpen && movieId) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        const movieData = mockMovieData[movieId] || {
          id: movieId,
          title: "Unknown Movie",
          poster: "/placeholder.svg",
          backdrop: "/placeholder.svg",
          year: 2023,
          rating: 7.5,
          genre: ["Drama"],
          synopsis: "Movie details not available.",
          duration: "2h 0m",
          director: "Unknown Director",
          cast: ["Unknown Actor"],
          trailer: "/placeholder-trailer.mp4",
          streamingPlatforms: [],
          similarMovies: [],
        }

        setMovie(movieData)
        setIsInWatchlist(movieData.isInWatchlist || false)
        setIsLoading(false)
      }, 500)
    }
  }, [isOpen, movieId])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Auto-play trailer after 2 seconds
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              setIsVideoPlaying(true)
            })
            .catch(() => {
              console.log("Auto-play failed")
            })
        }
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
          })
          .catch(() => {
            console.log("Play failed")
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

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
    // API call to update watchlist
  }

  const handleRating = (rating: "like" | "dislike") => {
    setUserRating(userRating === rating ? null : rating)
    // API call to submit rating
  }

  const submitFeedback = () => {
    if (feedback.trim()) {
      console.log("Submitting feedback:", feedback)
      // API call to submit feedback
      setFeedback("")
      setShowFeedback(false)
      alert("Thank you for your feedback!")
    }
  }

  const shareMovie = (platform: string) => {
    const url = window.location.href
    const text = `Check out ${movie?.title} on MovieDetect!`

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`)
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + "\n\n" + url)}`)
        break
    }
  }

  const scrollSimilarMovies = (direction: "left" | "right") => {
    const container = document.getElementById("similar-movies-scroll")
    if (container) {
      const scrollAmount = 300
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (!isOpen) return null

  if (isLoading || !movie) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      <div ref={modalRef} className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-screen">
          {/* Background Video/Image */}
          <div className="absolute inset-0">
            {isVideoPlaying ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted={isMuted}
                loop
                playsInline
                poster={movie.backdrop}
                onError={() => {
                  console.log("Video failed, showing backdrop")
                  setIsVideoPlaying(false)
                }}
              >
                <source src={movie.trailer} type="video/mp4" />
              </video>
            ) : (
              <img
                src={movie.backdrop || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-6 right-6 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Video Controls */}
          <div className="absolute top-6 right-20 flex space-x-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
              onClick={handleVideoToggle}
            >
              <Play className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
              onClick={handleMuteToggle}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-6 lg:px-8 pb-20">
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">{movie.title}</h1>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-medium text-lg">{movie.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">{movie.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">{movie.duration}</span>
                  </div>
                  {movie.aiConfidence && (
                    <Badge className="bg-green-600 text-white">{movie.aiConfidence}% AI Match</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((g) => (
                    <Badge key={g} variant="outline" className="border-gray-400 text-gray-300 bg-black/30">
                      {g}
                    </Badge>
                  ))}
                </div>

                <p className="text-gray-200 text-lg leading-relaxed mb-8 max-w-3xl">{movie.synopsis}</p>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mb-8">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold">
                    <Play className="w-6 h-6 mr-2" />
                    Play
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={toggleWatchlist}
                    className={`border-white/50 hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg ${
                      isInWatchlist ? "text-green-400 border-green-400" : "text-white"
                    }`}
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    {isInWatchlist ? "In My List" : "My List"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                    onClick={() => shareMovie("twitter")}
                  >
                    <Share className="w-6 h-6 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Rating Buttons */}
                <div className="flex items-center space-x-4 mb-8">
                  <span className="text-gray-300">Rate this movie:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRating("like")}
                    className={`border-gray-600 hover:bg-gray-800 bg-black/30 backdrop-blur-sm ${
                      userRating === "like" ? "text-green-400 border-green-400" : "text-gray-300"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRating("dislike")}
                    className={`border-gray-600 hover:bg-gray-800 bg-black/30 backdrop-blur-sm ${
                      userRating === "dislike" ? "text-red-400 border-red-400" : "text-gray-300"
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    Dislike
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-black px-6 lg:px-8 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Cast & Crew */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-white mb-6">Cast & Crew</h3>
                  <div className="mb-4">
                    <span className="text-gray-400">Director: </span>
                    <span className="text-white">{movie.director}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cast: </span>
                    <span className="text-white">{movie.cast.join(", ")}</span>
                  </div>
                </div>

                {/* Streaming Platforms */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-white mb-6">Watch Now</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {movie.streamingPlatforms.map((platform, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-gray-900 p-4 h-auto flex flex-col items-center space-y-2"
                        onClick={() => window.open(platform.link, "_blank")}
                      >
                        <div className="text-lg font-semibold">{platform.name}</div>
                        <div className="text-sm text-gray-400">
                          {platform.type === "subscription" ? "Included" : platform.price}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Share Options */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-white mb-6">Share</h3>
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white bg-transparent"
                      onClick={() => shareMovie("whatsapp")}
                    >
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white bg-transparent"
                      onClick={() => shareMovie("twitter")}
                    >
                      Twitter/X
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-transparent"
                      onClick={() => shareMovie("email")}
                    >
                      Email
                    </Button>
                  </div>
                </div>

                {/* Similar Movies Carousel */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Similar Movies</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 bg-transparent"
                        onClick={() => scrollSimilarMovies("left")}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 bg-transparent"
                        onClick={() => scrollSimilarMovies("right")}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div
                    id="similar-movies-scroll"
                    className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {movie.similarMovies.map((similarMovie) => (
                      <div
                        key={similarMovie.id}
                        className="flex-shrink-0 w-48 cursor-pointer group"
                        onClick={() => {
                          setMovie(null)
                          setIsLoading(true)
                          // Simulate loading new movie
                          setTimeout(() => {
                            const newMovieData = mockMovieData[similarMovie.id] || {
                              ...movie,
                              id: similarMovie.id,
                              title: similarMovie.title,
                              poster: similarMovie.poster,
                              year: similarMovie.year,
                              rating: similarMovie.rating,
                            }
                            setMovie(newMovieData)
                            setIsLoading(false)
                          }, 500)
                        }}
                      >
                        <img
                          src={similarMovie.poster || "/placeholder.svg"}
                          alt={similarMovie.title}
                          className="w-full h-72 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                        <div className="mt-3">
                          <h4 className="text-white font-medium text-sm line-clamp-2">{similarMovie.title}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-400 text-xs">{similarMovie.year}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-gray-300 text-xs">{similarMovie.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">Improve AI Search</h3>
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white bg-transparent"
                      onClick={() => setShowFeedback(!showFeedback)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Feedback
                    </Button>
                  </div>

                  {showFeedback && (
                    <div className="space-y-4 bg-gray-900 rounded-lg p-6">
                      <p className="text-gray-300 text-sm">
                        Help us improve our AI search accuracy by sharing your thoughts about this recommendation.
                      </p>
                      <Textarea
                        placeholder="Was this recommendation accurate? What could we improve?"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[120px]"
                      />
                      <div className="flex space-x-3">
                        <Button
                          onClick={submitFeedback}
                          disabled={!feedback.trim()}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Submit Feedback
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowFeedback(false)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-gray-900 rounded-lg p-6">
                  <img
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full rounded-lg mb-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Release Year: </span>
                      <span className="text-white">{movie.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration: </span>
                      <span className="text-white">{movie.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating: </span>
                      <span className="text-white">{movie.rating}/10</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Genres: </span>
                      <span className="text-white">{movie.genre.join(", ")}</span>
                    </div>
                    {movie.aiConfidence && (
                      <div>
                        <span className="text-gray-400">AI Confidence: </span>
                        <span className="text-green-400">{movie.aiConfidence}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
