"use client"

import { useState, useEffect, useRef } from "react"
import { X, Play, Plus, Share2, Star, Clock, Calendar, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MovieDetailModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number | null
}

interface MovieDetails {
  id: number
  title: string
  synopsis: string
  year: number
  rating: number
  duration: string
  genre: string[]
  director: string
  cast: string[]
  backdrop: string
  poster: string
  trailerUrl: string
  streamingPlatforms: {
    name: string
    quality: string
    price: string
    available: boolean
  }[]
  reviews: {
    author: string
    rating: number
    comment: string
    date: string
  }[]
  similarMovies: {
    id: number
    title: string
    poster: string
    rating: number
    year: number
  }[]
  aiInsights: {
    matchScore: number
    reasons: string[]
    mood: string
    themes: string[]
  }
}

export function MovieDetailModal({ isOpen, onClose, movieId }: MovieDetailModalProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const videoRef = useRef<HTMLVideoElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && movieId) {
      setLoading(true)
      fetchMovieDetails(movieId)

      // Auto-play trailer after 1 second
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error)
          setIsVideoPlaying(true)
        }
      }, 1000)
    } else {
      setMovieDetails(null)
      setIsVideoPlaying(false)
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async (id: number) => {
    try {
      // Mock data - in real app, this would be an API call
      const mockDetails: MovieDetails = {
        id,
        title: "Blade Runner 2049",
        synopsis:
          "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years. This discovery leads to a quest that could plunge what's left of society into chaos.",
        year: 2017,
        rating: 8.0,
        duration: "2h 44m",
        genre: ["Science Fiction", "Thriller", "Drama"],
        director: "Denis Villeneuve",
        cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Jared Leto", "Robin Wright"],
        backdrop: "/blade-runner-2049-cityscape.png",
        poster: "/blade-runner-2049-poster.png",
        trailerUrl: "/trailers/blade-runner-2049-trailer.mp4",
        streamingPlatforms: [
          { name: "Netflix", quality: "4K HDR", price: "Included", available: true },
          { name: "Amazon Prime", quality: "4K HDR", price: "$3.99", available: true },
          { name: "Apple TV+", quality: "4K Dolby Vision", price: "$4.99", available: true },
          { name: "Disney+", quality: "HD", price: "Not Available", available: false },
        ],
        reviews: [
          {
            author: "John Smith",
            rating: 9,
            comment:
              "A masterpiece of science fiction cinema. Villeneuve has created a worthy successor to the original.",
            date: "2023-12-15",
          },
          {
            author: "Sarah Johnson",
            rating: 8,
            comment: "Visually stunning with incredible performances. The cinematography is breathtaking.",
            date: "2023-12-10",
          },
          {
            author: "Mike Chen",
            rating: 7,
            comment: "Great film but a bit slow-paced. The world-building is exceptional though.",
            date: "2023-12-08",
          },
        ],
        similarMovies: [
          { id: 2, title: "The Matrix", poster: "/matrix-movie-poster.png", rating: 8.7, year: 1999 },
          { id: 3, title: "Ex Machina", poster: "/ex-machina-poster.png", rating: 7.7, year: 2014 },
          { id: 4, title: "Her", poster: "/her-ai-romance-movie-poster.png", rating: 8.0, year: 2013 },
          { id: 5, title: "Interstellar", poster: "/interstellar-inspired-poster.png", rating: 8.6, year: 2014 },
        ],
        aiInsights: {
          matchScore: 92,
          reasons: [
            "Matches your preference for sci-fi thrillers",
            "Similar to movies you've rated highly",
            "Acclaimed director Denis Villeneuve",
            "High production value and cinematography",
          ],
          mood: "Contemplative and Atmospheric",
          themes: ["Identity", "Technology", "Future Society", "Human Connection"],
        },
      }

      setMovieDetails(mockDetails)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching movie details:", error)
      setLoading(false)
    }
  }

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/movie/${movieId}`
    const text = `Check out ${movieDetails?.title}!`

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`)
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`)
        break
    }
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    // In real app, this would save to backend
    console.log(`Rated movie ${movieId} with ${rating} stars`)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full overflow-y-auto">
        <div ref={modalRef} className="min-h-full bg-black text-white animate-in fade-in duration-300">
          {loading ? (
            <div className="h-screen flex items-center justify-center">
              <div className="animate-pulse text-xl">Loading movie details...</div>
            </div>
          ) : movieDetails ? (
            <>
              {/* Hero Section with Video */}
              <div className="relative h-screen">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 z-20 bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm rounded-full w-12 h-12"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </Button>

                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={movieDetails.backdrop || "/placeholder.svg"}
                    alt={movieDetails.title}
                    className={`w-full h-full object-cover transition-all duration-1000 ${
                      isVideoPlaying ? "scale-110 blur-sm opacity-50" : "scale-100 blur-0 opacity-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                </div>

                {/* Video Overlay */}
                {isVideoPlaying && (
                  <div className="absolute inset-0">
                    <video ref={videoRef} className="w-full h-full object-cover" muted={isMuted} loop playsInline>
                      <source src={movieDetails.trailerUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                  </div>
                )}

                {/* Video Controls */}
                <div className="absolute top-6 left-6 z-20">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Movie Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{movieDetails.title}</h1>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold">{movieDetails.rating}</span>
                      </div>
                      <span className="text-gray-300">{movieDetails.year}</span>
                      <span className="text-gray-300">{movieDetails.duration}</span>
                      <Badge className="bg-red-600 text-white">HD</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {movieDetails.genre.map((genre) => (
                        <Badge key={genre} variant="outline" className="border-gray-400 text-gray-300">
                          {genre}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-lg text-gray-200 mb-8 max-w-3xl leading-relaxed">{movieDetails.synopsis}</p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold">
                        <Play className="w-5 h-5 mr-2" />
                        Watch Now
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/20 bg-transparent"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Add to Watchlist
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/20 bg-transparent"
                      >
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Information Tabs */}
              <div className="px-8 md:px-12 py-12">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-900 mb-8">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger
                      value="similar"
                      className="data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Similar Movies
                    </TabsTrigger>
                    <TabsTrigger
                      value="ai-insights"
                      className="data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      AI Insights
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">Movie Details</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-300">Released: {movieDetails.year}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-300">Duration: {movieDetails.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Director: </span>
                            <span className="text-white">{movieDetails.director}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Cast: </span>
                            <span className="text-white">{movieDetails.cast.join(", ")}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-4">Streaming Platforms</h3>
                        <div className="space-y-3">
                          {movieDetails.streamingPlatforms.map((platform) => (
                            <div
                              key={platform.name}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                platform.available ? "bg-gray-800" : "bg-gray-900 opacity-50"
                              }`}
                            >
                              <div>
                                <span className="font-semibold">{platform.name}</span>
                                <div className="text-sm text-gray-400">{platform.quality}</div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-semibold ${platform.available ? "text-green-400" : "text-red-400"}`}
                                >
                                  {platform.price}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* User Rating */}
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Rate This Movie</h3>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => handleRating(star)}
                            className="transition-colors"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= (hoveredStar || userRating) ? "text-yellow-400 fill-current" : "text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                        {userRating > 0 && (
                          <span className="ml-4 text-gray-300">
                            You rated this {userRating} star{userRating !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-6">
                    <h3 className="text-2xl font-bold">User Reviews</h3>
                    {movieDetails.reviews.map((review, index) => (
                      <div key={index} className="bg-gray-900 p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold">{review.author}</div>
                              <div className="text-sm text-gray-400">{review.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{review.rating}/10</span>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="similar" className="space-y-6">
                    <h3 className="text-2xl font-bold">Similar Movies</h3>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white hover:bg-black/90 rounded-full w-10 h-10"
                        onClick={() => scrollSimilarMovies("left")}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>

                      <div
                        id="similar-movies-scroll"
                        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {movieDetails.similarMovies.map((movie) => (
                          <div
                            key={movie.id}
                            className="flex-shrink-0 w-48 cursor-pointer group"
                            onClick={() => {
                              // In real app, this would open the new movie's details
                              console.log("Open movie:", movie.id)
                            }}
                          >
                            <div className="relative overflow-hidden rounded-lg transition-transform group-hover:scale-105">
                              <img
                                src={movie.poster || "/placeholder.svg"}
                                alt={movie.title}
                                className="w-full h-72 object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                <h4 className="text-white font-semibold text-sm mb-1">{movie.title}</h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300 text-xs">{movie.year}</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-white text-xs">{movie.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white hover:bg-black/90 rounded-full w-10 h-10"
                        onClick={() => scrollSimilarMovies("right")}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="ai-insights" className="space-y-6">
                    <h3 className="text-2xl font-bold">AI Recommendation Insights</h3>

                    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-lg border border-blue-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold">Match Score</h4>
                        <div className="text-3xl font-bold text-green-400">{movieDetails.aiInsights.matchScore}%</div>
                      </div>
                      <p className="text-gray-300">
                        This movie is highly recommended for you based on your viewing history and preferences.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Why This Movie?</h4>
                        <ul className="space-y-2">
                          {movieDetails.aiInsights.reasons.map((reason, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-300">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-3">Movie Themes</h4>
                        <div className="flex flex-wrap gap-2">
                          {movieDetails.aiInsights.themes.map((theme) => (
                            <Badge key={theme} className="bg-purple-600 text-white">
                              {theme}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-4">
                          <span className="text-gray-400">Mood: </span>
                          <span className="text-white font-medium">{movieDetails.aiInsights.mood}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl mb-4">Movie not found</div>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
