"use client"

import { useState, useEffect, useRef } from "react"
import { X, Star, Play, Plus, Volume2, VolumeX, Clock, ExternalLink, Heart, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MovieDetailModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number | null
  searchType?: string
  confidenceScore?: number
}

interface MovieDetail {
  id: number
  title: string
  year: number
  duration: number
  genre: string[]
  synopsis: string
  poster: string
  backdrop: string
  trailer: string
  ratings: {
    tmdb: number
    imdb: number
    rottenTomatoes: number
    userAverage: number
  }
  streamingPlatforms: {
    name: string
    icon: string
    link: string
    type: string // 'subscription' | 'rent' | 'buy'
    price?: string
  }[]
  cast: {
    name: string
    character: string
    image: string
  }[]
  reviews: {
    source: string
    author: string
    content: string
    rating: number
    date: string
  }[]
  similarMovies: {
    id: number
    title: string
    poster: string
    rating: number
    year: number
  }[]
  isInWatchlist: boolean
  userRating?: number
}

export function MovieDetailModal({ isOpen, onClose, movieId, searchType, confidenceScore }: MovieDetailModalProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "similar" | "feedback">("overview")
  const [userRating, setUserRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackEmail, setFeedbackEmail] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails(movieId)
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async (id: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/movies/${id}`)
      const data = await response.json()

      if (data.success) {
        setMovie(data.movie)
        setUserRating(data.movie.userRating || 0)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching movie details:", error)
      // Fallback mock data for demo
      setMovie({
        id: id,
        title: "Blade Runner 2049",
        year: 2017,
        duration: 164,
        genre: ["Sci-Fi", "Thriller", "Drama"],
        synopsis:
          "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
        poster: "/blade-runner-2049-poster.png",
        backdrop: "/blade-runner-2049-cityscape.png",
        trailer: "/placeholder-trailer.mp4",
        ratings: {
          tmdb: 8.0,
          imdb: 8.0,
          rottenTomatoes: 88,
          userAverage: 8.2,
        },
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
        cast: [
          { name: "Ryan Gosling", character: "K", image: "/cast-1.jpg" },
          { name: "Harrison Ford", character: "Rick Deckard", image: "/cast-2.jpg" },
          { name: "Ana de Armas", character: "Joi", image: "/cast-3.jpg" },
          { name: "Jared Leto", character: "Niander Wallace", image: "/cast-4.jpg" },
        ],
        reviews: [
          {
            source: "IMDb",
            author: "MovieCritic2023",
            content:
              "A visually stunning sequel that honors the original while creating something entirely new. The cinematography is breathtaking.",
            rating: 9,
            date: "2023-10-15",
          },
          {
            source: "Rotten Tomatoes",
            author: "Critics Consensus",
            content:
              "Blade Runner 2049 is a rare sequel that enhances its predecessor while standing as a remarkable achievement in its own right.",
            rating: 8.8,
            date: "2023-10-10",
          },
          {
            source: "User Review",
            author: "SciFiFan",
            content:
              "Denis Villeneuve has crafted a masterpiece. Every frame is a work of art, and the story respects the legacy while pushing boundaries.",
            rating: 10,
            date: "2023-10-12",
          },
        ],
        similarMovies: [
          { id: 2, title: "The Matrix", poster: "/matrix-movie-poster.png", rating: 8.7, year: 1999 },
          { id: 3, title: "Interstellar", poster: "/interstellar-inspired-poster.png", rating: 8.6, year: 2014 },
          { id: 4, title: "Ex Machina", poster: "/ex-machina-poster.png", rating: 7.7, year: 2014 },
          { id: 5, title: "Her", poster: "/her-ai-romance-movie-poster.png", rating: 8.0, year: 2013 },
          { id: 6, title: "Arrival", poster: "/placeholder.svg", rating: 7.9, year: 2016 },
          { id: 7, title: "Ghost in the Shell", poster: "/placeholder.svg", rating: 7.3, year: 2017 },
        ],
        isInWatchlist: false,
        userRating: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!movie) return

    try {
      const response = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      })

      const result = await response.json()
      if (result.success) {
        setMovie((prev) => (prev ? { ...prev, isInWatchlist: !prev.isInWatchlist } : null))
      }
    } catch (error) {
      console.error("Error updating watchlist:", error)
    }
  }

  const handleRateMovie = async (rating: number) => {
    if (!movie) return

    try {
      const response = await fetch("/api/movies/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id, rating }),
      })

      const result = await response.json()
      if (result.success) {
        setUserRating(rating)
        setMovie((prev) => (prev ? { ...prev, userRating: rating } : null))
      }
    } catch (error) {
      console.error("Error rating movie:", error)
    }
  }

  const handleShare = async (platform: "whatsapp" | "twitter" | "email") => {
    if (!movie) return

    const shareData = {
      title: movie.title,
      text: `Check out ${movie.title} (${movie.year}) on MovieDetect!`,
      url: `${window.location.origin}/movie/${movie.id}`,
    }

    try {
      switch (platform) {
        case "whatsapp":
          window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`)
          break
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
          )
          break
        case "email":
          window.open(
            `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
          )
          break
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleSimilarMovieClick = (similarMovie: any) => {
    fetchMovieDetails(similarMovie.id)
    setActiveTab("overview")
  }

  const handleSubmitFeedback = async () => {
    if (!movie || !feedbackText.trim()) return

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          searchType,
          confidenceScore,
          feedback: feedbackText,
          email: feedbackEmail,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setFeedbackText("")
        setFeedbackEmail("")
        alert("Thank you for your feedback!")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
    }
  }

  const getConfidenceColor = (score?: number) => {
    if (!score) return "bg-gray-500"
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl bg-gray-900 rounded-lg overflow-hidden max-h-[95vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
              <p className="text-white mt-4">Loading movie details...</p>
            </div>
          ) : movie ? (
            <>
              {/* Header with close button */}
              <div className="absolute top-4 right-4 z-10">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-black/50">
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Video/Backdrop Section */}
              <div className="relative h-96 overflow-hidden">
                {isPlaying && movie.trailer ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                  >
                    <source src={movie.trailer} type="video/mp4" />
                    <img
                      src={movie.backdrop || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </video>
                ) : (
                  <img
                    src={movie.backdrop || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                {/* Video Controls */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-gray-500 text-white hover:bg-black/70"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-gray-500 text-white hover:bg-black/70"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                </div>

                {/* AI Confidence Score Badge */}
                {confidenceScore && (
                  <div className="absolute top-4 right-16">
                    <Badge className={`${getConfidenceColor(confidenceScore)} text-white`}>
                      AI Match: {confidenceScore}%{confidenceScore < 60 && " ⚠️"}
                    </Badge>
                  </div>
                )}

                {/* Movie Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end space-x-6">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-32 h-48 object-cover rounded-lg shadow-lg"
                    />
                    <div className="flex-1 space-y-4">
                      <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                        <div className="flex items-center space-x-4 text-gray-300">
                          <span>{movie.year}</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{movie.duration} min</span>
                          </div>
                          <div className="flex space-x-2">
                            {movie.genre.map((g) => (
                              <Badge key={g} variant="outline" className="border-gray-500 text-gray-300">
                                {g}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white">TMDb: {movie.ratings.tmdb}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white">IMDb: {movie.ratings.imdb}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white">RT: {movie.ratings.rottenTomatoes}%</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button className="bg-white text-black hover:bg-gray-200 px-8">
                          <Play className="w-5 h-5 mr-2" />
                          Play
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-500 text-white hover:bg-white/10 bg-transparent"
                          onClick={handleAddToWatchlist}
                        >
                          {movie.isInWatchlist ? (
                            <>
                              <Heart className="w-5 h-5 mr-2 fill-current text-red-500" />
                              In Watchlist
                            </>
                          ) : (
                            <>
                              <Plus className="w-5 h-5 mr-2" />
                              Add to Watchlist
                            </>
                          )}
                        </Button>

                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRateMovie(star)}
                              className="text-gray-400 hover:text-yellow-400 transition-colors"
                            >
                              <Star className={`w-5 h-5 ${star <= userRating ? "text-yellow-400 fill-current" : ""}`} />
                            </button>
                          ))}
                        </div>

                        {/* Share Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-500 text-white hover:bg-white/10 bg-transparent"
                            onClick={() => handleShare("whatsapp")}
                          >
                            WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-500 text-white hover:bg-white/10 bg-transparent"
                            onClick={() => handleShare("twitter")}
                          >
                            Twitter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-500 text-white hover:bg-white/10 bg-transparent"
                            onClick={() => handleShare("email")}
                          >
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streaming Platforms */}
              <div className="px-6 py-4 bg-gray-800">
                <h3 className="text-white font-semibold mb-3">Watch On:</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.streamingPlatforms.map((platform, index) => (
                    <a
                      key={index}
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <img
                        src={platform.icon || "/placeholder-logo.png"}
                        alt={platform.name}
                        className="w-6 h-6 rounded"
                      />
                      <span className="text-white text-sm">{platform.name}</span>
                      {platform.price && <span className="text-gray-300 text-xs">({platform.price})</span>}
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-700">
                <div className="flex space-x-8 px-6">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "reviews", label: "Reviews" },
                    { id: "similar", label: "Similar Movies" },
                    { id: "feedback", label: "Feedback" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-teal-500 text-teal-400"
                          : "border-transparent text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                        <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Cast</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {movie.cast.map((actor, index) => (
                            <div key={index} className="text-center">
                              <img
                                src={actor.image || "/placeholder-user.jpg"}
                                alt={actor.name}
                                className="w-20 h-20 rounded-full object-cover mb-2 mx-auto"
                              />
                              <p className="text-sm text-white font-medium">{actor.name}</p>
                              <p className="text-xs text-gray-400">{actor.character}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Release Year:</span>
                            <span className="text-white">{movie.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white">{movie.duration} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Genres:</span>
                            <span className="text-white">{movie.genre.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white">Reviews & Ratings</h3>
                    <div className="grid gap-6">
                      {movie.reviews.map((review, index) => (
                        <Card key={index} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-white font-medium">{review.author}</h4>
                                <p className="text-gray-400 text-sm">
                                  {review.source} • {review.date}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white">{review.rating}/10</span>
                              </div>
                            </div>
                            <p className="text-gray-300">{review.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "similar" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white">Similar Movies</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {movie.similarMovies.map((similarMovie) => (
                        <Card
                          key={similarMovie.id}
                          className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => handleSimilarMovieClick(similarMovie)}
                        >
                          <CardContent className="p-0">
                            <img
                              src={similarMovie.poster || "/placeholder.svg"}
                              alt={similarMovie.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-3">
                              <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">{similarMovie.title}</h4>
                              <p className="text-gray-400 text-xs mb-1">{similarMovie.year}</p>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-400">{similarMovie.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "feedback" && (
                  <div className="space-y-6 max-w-2xl">
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-2">Feedback</h3>
                      <p className="text-gray-400">Help us improve our search results and recommendations.</p>
                    </div>

                    {searchType && (
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-white text-sm">
                          <strong>Search Method:</strong> {searchType}
                        </p>
                        {confidenceScore && (
                          <p className="text-white text-sm">
                            <strong>AI Confidence:</strong> {confidenceScore}%
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="feedback" className="text-white">
                          Your Feedback
                        </Label>
                        <Textarea
                          id="feedback"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Was this the movie you were looking for? How can we improve our search?"
                          className="mt-1 bg-gray-800 border-gray-600 text-white"
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email (optional)
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={feedbackEmail}
                          onChange={(e) => setFeedbackEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="mt-1 bg-gray-800 border-gray-600 text-white"
                        />
                      </div>

                      <Button
                        onClick={handleSubmitFeedback}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                        disabled={!feedbackText.trim()}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-white">Movie not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
