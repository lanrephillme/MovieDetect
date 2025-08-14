"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, Plus, Star, Clock, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface MovieDetailModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number | null
}

interface StreamingPlatform {
  name: string
  logo: string
  quality: string
  price: string
  available: boolean
}

interface SimilarMovie {
  id: number
  title: string
  poster: string
  rating: number
  year: number
}

export function MovieDetailModal({ isOpen, onClose, movieId }: MovieDetailModalProps) {
  const [movie, setMovie] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([])
  const [hoveredSimilar, setHoveredSimilar] = useState<number | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const streamingPlatforms: StreamingPlatform[] = [
    { name: "Netflix", logo: "/logos/netflix.png", quality: "4K HDR", price: "Included", available: true },
    { name: "Prime Video", logo: "/logos/prime.png", quality: "4K HDR", price: "$3.99", available: true },
    { name: "Hulu", logo: "/logos/hulu.png", quality: "HD", price: "$2.99", available: false },
    { name: "Disney+", logo: "/logos/disney.png", quality: "4K HDR", price: "Included", available: false },
    { name: "Apple TV+", logo: "/logos/apple.png", quality: "4K HDR", price: "$4.99", available: true },
  ]

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Reviews" },
    { id: "similar", label: "Similar Movies" },
    { id: "feedback", label: "AI Feedback" },
  ]

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails()
      fetchSimilarMovies()

      // Auto-play trailer after 2 seconds
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error)
          setIsVideoPlaying(true)
        }
      }, 2000)
    }

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async () => {
    if (!movieId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/movies/${movieId}`)
      const data = await response.json()

      if (data.success) {
        setMovie({
          ...data.movie,
          trailerUrl: `/trailers/trailer-${movieId}.mp4`,
          backdrop: data.movie.backdrop || `/backdrops/backdrop-${movieId}.jpg`,
          genres: Array.isArray(data.movie.genre) ? data.movie.genre : [data.movie.genre || "Unknown"],
          cast: data.movie.cast || ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Jared Leto"],
          director: data.movie.director || "Denis Villeneuve",
          writers: data.movie.writers || ["Hampton Fancher", "Michael Green"],
          synopsis: data.movie.synopsis || data.movie.description || "No synopsis available.",
        })
      }
    } catch (error) {
      console.error("Error fetching movie details:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarMovies = async () => {
    try {
      const response = await fetch("/api/movies/trending")
      const data = await response.json()
      if (data.success && data.data) {
        setSimilarMovies(data.data.slice(0, 8))
      }
    } catch (error) {
      console.error("Error fetching similar movies:", error)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${movie?.title} on MovieDetect!`)

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text} ${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      email: `mailto:?subject=${text}&body=Check out this movie: ${url}`,
    }

    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank")
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    // Here you would typically send the rating to your API
    console.log(`Rated movie ${movieId} with ${rating} stars`)
  }

  const scrollSimilarMovies = (direction: "left" | "right") => {
    const container = document.getElementById("similar-movies-container")
    if (container) {
      const scrollAmount = 300
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="h-full overflow-y-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-6 right-6 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="animate-pulse text-white text-2xl">Loading movie details...</div>
          </div>
        ) : movie ? (
          <>
            {/* Hero Section with Trailer */}
            <div className="relative h-screen">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={movie.backdrop || movie.poster}
                  alt={movie.title}
                  className={`w-full h-full object-cover transition-opacity duration-1000 ${
                    isVideoPlaying ? "opacity-30" : "opacity-100"
                  }`}
                />
              </div>

              {/* Background Video */}
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover transition-opacity duration-1000 ${
                    isVideoPlaying ? "opacity-80" : "opacity-0"
                  }`}
                  muted={isMuted}
                  loop
                  playsInline
                  poster={movie.backdrop}
                >
                  <source src={movie.trailerUrl} type="video/mp4" />
                </video>
              </div>

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Blur Effect */}
              {isVideoPlaying && (
                <div
                  className="absolute inset-0 backdrop-blur-sm"
                  style={{
                    background: "radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
                  }}
                />
              )}

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 lg:px-12">
                  <div className="max-w-4xl">
                    {/* Movie Info */}
                    <div className="mb-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-semibold">
                          {movie.aiConfidence ? `${movie.aiConfidence}% MATCH` : "FEATURED"}
                        </Badge>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <span className="text-sm">{movie.year}</span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{movie.rating}</span>
                          </div>
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{movie.duration || "148 min"}</span>
                          </div>
                        </div>
                      </div>

                      <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">{movie.title}</h1>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {movie.genres.map((genre: string) => (
                          <Badge key={genre} variant="outline" className="border-gray-400 text-gray-300">
                            {genre}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-lg text-gray-300 mb-8 max-w-3xl leading-relaxed">{movie.synopsis}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold"
                      >
                        <Play className="w-6 h-6 mr-2 fill-current" />
                        Play
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="border-gray-400 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold bg-black/30 backdrop-blur-sm"
                      >
                        <Plus className="w-6 h-6 mr-2" />
                        Add to Watchlist
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="border-gray-400 text-white hover:bg-white/10 p-4 bg-black/30 backdrop-blur-sm"
                        onClick={toggleMute}
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </Button>

                      {/* Share Buttons */}
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-400 text-white hover:bg-white/10 bg-black/30 backdrop-blur-sm"
                          onClick={() => handleShare("whatsapp")}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-400 text-white hover:bg-white/10 bg-black/30 backdrop-blur-sm"
                          onClick={() => handleShare("twitter")}
                        >
                          Twitter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-400 text-white hover:bg-white/10 bg-black/30 backdrop-blur-sm"
                          onClick={() => handleShare("email")}
                        >
                          Email
                        </Button>
                      </div>
                    </div>

                    {/* Streaming Platforms */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4">Available On</h3>
                      <div className="flex flex-wrap gap-4">
                        {streamingPlatforms.map((platform) => (
                          <div
                            key={platform.name}
                            className={`flex items-center space-x-3 p-3 rounded-lg ${
                              platform.available
                                ? "bg-white/10 backdrop-blur-sm border border-white/20"
                                : "bg-gray-800/50 opacity-50"
                            }`}
                          >
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-black">{platform.name[0]}</span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{platform.name}</p>
                              <p className="text-gray-400 text-xs">
                                {platform.quality} • {platform.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Information Section */}
            <div className="bg-black text-white">
              <div className="container mx-auto px-6 lg:px-12 py-12">
                {/* Tabs */}
                <div className="flex space-x-8 mb-8 border-b border-gray-800">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-4 px-2 text-lg font-medium transition-colors ${
                        activeTab === tab.id ? "text-white border-b-2 border-red-600" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === "overview" && (
                    <div className="grid lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-8">
                        <div>
                          <h3 className="text-2xl font-semibold mb-4">Synopsis</h3>
                          <p className="text-gray-300 leading-relaxed text-lg">{movie.synopsis}</p>
                        </div>

                        <div>
                          <h3 className="text-2xl font-semibold mb-4">Cast & Crew</h3>
                          <div className="space-y-4">
                            <div>
                              <span className="text-gray-400">Director:</span>
                              <span className="text-white ml-2">{movie.director}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Writers:</span>
                              <span className="text-white ml-2">{movie.writers.join(", ")}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Starring:</span>
                              <span className="text-white ml-2">{movie.cast.slice(0, 4).join(", ")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <Card className="bg-gray-900 border-gray-800">
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-white">Rate This Movie</h3>
                            <div className="flex space-x-2 mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => handleRating(star)}
                                  className={`w-8 h-8 ${
                                    star <= userRating ? "text-yellow-400" : "text-gray-600"
                                  } hover:text-yellow-400 transition-colors`}
                                >
                                  <Star className="w-full h-full fill-current" />
                                </button>
                              ))}
                            </div>
                            {userRating > 0 && (
                              <p className="text-green-400 text-sm">Thanks for rating! ({userRating}/5 stars)</p>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-900 border-gray-800">
                          <CardContent className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-white">Movie Details</h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Release Date:</span>
                                <span className="text-white">{movie.year}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Runtime:</span>
                                <span className="text-white">{movie.duration || "148 min"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Rating:</span>
                                <span className="text-white">{movie.rating}/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Language:</span>
                                <span className="text-white">English</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold">User Reviews</h3>
                      <div className="space-y-6">
                        {[1, 2, 3].map((review) => (
                          <Card key={review} className="bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold">U{review}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-white font-medium">User {review}</span>
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-4 h-4 ${
                                            star <= 4 ? "text-yellow-400 fill-current" : "text-gray-600"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-gray-300">
                                    This movie exceeded my expectations. The visual effects were stunning and the story
                                    was compelling throughout. Highly recommended for sci-fi fans!
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "similar" && (
                    <div>
                      <h3 className="text-2xl font-semibold mb-6">Similar Movies</h3>
                      <div className="relative group">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
                          onClick={() => scrollSimilarMovies("left")}
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>

                        <div
                          id="similar-movies-container"
                          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
                          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                          {similarMovies.map((similarMovie) => (
                            <div
                              key={similarMovie.id}
                              className="flex-shrink-0 w-48 cursor-pointer group/similar"
                              onMouseEnter={() => setHoveredSimilar(similarMovie.id)}
                              onMouseLeave={() => setHoveredSimilar(null)}
                            >
                              <div
                                className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                                  hoveredSimilar === similarMovie.id ? "scale-105" : "scale-100"
                                }`}
                              >
                                <img
                                  src={similarMovie.poster || "/placeholder.svg"}
                                  alt={similarMovie.title}
                                  className="w-full h-72 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/similar:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                                    <Play className="w-4 h-4 mr-1" />
                                    Play
                                  </Button>
                                </div>
                                <div className="absolute bottom-2 left-2">
                                  <Badge className="bg-black/70 text-white text-xs">
                                    <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                                    {similarMovie.rating}
                                  </Badge>
                                </div>
                              </div>
                              <div className="mt-2">
                                <h4 className="text-white font-medium text-sm line-clamp-2">{similarMovie.title}</h4>
                                <p className="text-gray-400 text-xs">{similarMovie.year}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
                          onClick={() => scrollSimilarMovies("right")}
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeTab === "feedback" && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold">AI Match Analysis</h3>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">AI Confidence Score:</span>
                              <Badge
                                className={`${
                                  (movie.aiConfidence || 85) >= 80
                                    ? "bg-green-500"
                                    : (movie.aiConfidence || 85) >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                } text-white`}
                              >
                                {movie.aiConfidence || 85}%
                              </Badge>
                            </div>
                            <div>
                              <span className="text-gray-400">Match Reasoning:</span>
                              <p className="text-white mt-2">
                                This movie matches your search criteria based on genre preferences, visual style, and
                                thematic elements. The AI detected strong similarities in cinematography and narrative
                                structure.
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-400">Recommended Because:</span>
                              <ul className="text-white mt-2 space-y-1">
                                <li>• Similar visual aesthetics to your previous searches</li>
                                <li>• High rating in your preferred genres</li>
                                <li>• Matches your viewing history patterns</li>
                                <li>• Popular among users with similar tastes</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-screen flex items-center justify-center">
            <div className="text-white text-xl">Movie not found</div>
          </div>
        )}
      </div>
    </div>
  )
}
