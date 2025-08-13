"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Plus,
  Star,
  Share2,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface MoviePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number | null
  searchType?: string
  confidence?: number
}

interface MovieDetails {
  id: number
  title: string
  year: number
  rating: number
  duration: number
  genre: string[]
  synopsis: string
  poster: string
  backdrop: string
  trailer: string
  cast: Array<{ name: string; character: string; image: string }>
  director: string
  writers: string[]
  streamingPlatforms: Array<{ name: string; logo: string; available: boolean; price?: string }>
  reviews: {
    imdb: number
    rottenTomatoes: { critics: number; audience: number }
    userReviews: Array<{ user: string; rating: number; comment: string; date: string }>
  }
  similarMovies: Array<{ id: number; title: string; poster: string; rating: number }>
}

export function MoviePreviewModal({ isOpen, onClose, movieId, searchType, confidence }: MoviePreviewModalProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "similar" | "feedback">("overview")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [similarMoviesIndex, setSimilarMoviesIndex] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails()
      checkWatchlistStatus()
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/movies/${movieId}/details`)
      // const data = await response.json()

      // Mock movie details for now
      const mockDetails: MovieDetails = {
        id: movieId!,
        title: movieId === 1 ? "Blade Runner 2049" : movieId === 2 ? "The Matrix" : "Inception",
        year: movieId === 1 ? 2017 : movieId === 2 ? 1999 : 2010,
        rating: movieId === 1 ? 8.0 : movieId === 2 ? 8.7 : 8.8,
        duration: movieId === 1 ? 164 : movieId === 2 ? 136 : 148,
        genre: movieId === 1 ? ["Sci-Fi", "Thriller"] : movieId === 2 ? ["Action", "Sci-Fi"] : ["Sci-Fi", "Thriller"],
        synopsis:
          movieId === 1
            ? "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years."
            : movieId === 2
              ? "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix."
              : "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        poster:
          movieId === 1
            ? "/blade-runner-2049-poster.png"
            : movieId === 2
              ? "/matrix-movie-poster.png"
              : "/inception-movie-poster.png",
        backdrop:
          movieId === 1
            ? "/blade-runner-2049-cityscape.png"
            : movieId === 2
              ? "/matrix-digital-rain.png"
              : "/inception-movie-poster.png",
        trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
        cast: [
          { name: "Ryan Gosling", character: "K", image: "/placeholder-user.jpg" },
          { name: "Harrison Ford", character: "Rick Deckard", image: "/placeholder-user.jpg" },
          { name: "Ana de Armas", character: "Joi", image: "/placeholder-user.jpg" },
          { name: "Jared Leto", character: "Niander Wallace", image: "/placeholder-user.jpg" },
        ],
        director: movieId === 1 ? "Denis Villeneuve" : movieId === 2 ? "The Wachowskis" : "Christopher Nolan",
        writers:
          movieId === 1
            ? ["Hampton Fancher", "Michael Green"]
            : movieId === 2
              ? ["The Wachowskis"]
              : ["Christopher Nolan"],
        streamingPlatforms: [
          { name: "Netflix", logo: "🎬", available: true },
          { name: "Amazon Prime", logo: "📺", available: true, price: "$3.99" },
          { name: "Apple TV+", logo: "🍎", available: false },
          { name: "Disney+", logo: "🏰", available: false },
          { name: "HBO Max", logo: "🎭", available: true },
        ],
        reviews: {
          imdb: movieId === 1 ? 8.0 : movieId === 2 ? 8.7 : 8.8,
          rottenTomatoes: {
            critics: movieId === 1 ? 88 : movieId === 2 ? 83 : 87,
            audience: movieId === 1 ? 81 : movieId === 2 ? 85 : 91,
          },
          userReviews: [
            {
              user: "MovieBuff2023",
              rating: 5,
              comment: "Absolutely stunning visuals and compelling story!",
              date: "2024-01-15",
            },
            {
              user: "CinemaLover",
              rating: 4,
              comment: "Great sequel that honors the original while adding new depth.",
              date: "2024-01-10",
            },
            { user: "SciFiFan", rating: 5, comment: "A masterpiece of science fiction cinema.", date: "2024-01-05" },
          ],
        },
        similarMovies: [
          { id: 101, title: "Ghost in the Shell", poster: "/placeholder.svg", rating: 7.5 },
          { id: 102, title: "Ex Machina", poster: "/ex-machina-poster.png", rating: 7.7 },
          { id: 103, title: "Her", poster: "/her-ai-romance-movie-poster.png", rating: 8.0 },
          { id: 104, title: "Minority Report", poster: "/placeholder.svg", rating: 7.6 },
          { id: 105, title: "Total Recall", poster: "/placeholder.svg", rating: 7.5 },
        ],
      }

      setMovieDetails(mockDetails)
    } catch (error) {
      console.error("Error fetching movie details:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkWatchlistStatus = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/watchlist/check/${movieId}`)
      // const data = await response.json()
      // setIsInWatchlist(data.inWatchlist)

      // Mock watchlist status
      setIsInWatchlist(Math.random() > 0.5)
    } catch (error) {
      console.error("Error checking watchlist status:", error)
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleWatchlistToggle = async () => {
    try {
      const endpoint = isInWatchlist ? "/api/watchlist/remove" : "/api/watchlist/add"
      // TODO: Replace with actual API call
      // await fetch(endpoint, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ movieId })
      // })

      setIsInWatchlist(!isInWatchlist)
    } catch (error) {
      console.error("Error updating watchlist:", error)
    }
  }

  const handleRating = async (rating: number) => {
    try {
      // TODO: Replace with actual API call
      // await fetch("/api/movies/rate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ movieId, rating })
      // })

      setUserRating(rating)
    } catch (error) {
      console.error("Error submitting rating:", error)
    }
  }

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/movie/${movieId}`
    const text = `Check out ${movieDetails?.title} on MovieDetect!`

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

  const handleFeedbackSubmit = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch("/api/feedback/submit", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     movieId,
      //     searchType,
      //     confidence,
      //     feedback,
      //     helpful: true
      //   })
      // })

      setFeedback("")
      alert("Thank you for your feedback!")
    } catch (error) {
      console.error("Error submitting feedback:", error)
    }
  }

  const scrollSimilarMovies = (direction: "left" | "right") => {
    const maxIndex = Math.max(0, (movieDetails?.similarMovies.length || 0) - 4)
    if (direction === "left") {
      setSimilarMoviesIndex(Math.max(0, similarMoviesIndex - 1))
    } else {
      setSimilarMoviesIndex(Math.min(maxIndex, similarMoviesIndex + 1))
    }
  }

  if (!isOpen || !movieDetails) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl bg-gray-900 rounded-lg overflow-hidden max-h-[95vh] overflow-y-auto">
          {/* Header with Trailer */}
          <div className="relative h-96 bg-gray-800">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={movieDetails.backdrop}
                  muted={isMuted}
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={movieDetails.trailer} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <Button
                    onClick={handlePlayPause}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={handleMuteToggle}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Close Button */}
                <Button
                  onClick={onClose}
                  size="sm"
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Movie Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold text-white">{movieDetails.title}</h1>
                        {confidence && (
                          <Badge
                            className={`${
                              confidence >= 80 ? "bg-green-500" : confidence >= 60 ? "bg-yellow-500" : "bg-red-500"
                            } text-white`}
                          >
                            {confidence}% Match
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-white/80 mb-3">
                        <span>{movieDetails.year}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{movieDetails.rating}</span>
                        </div>
                        <span>{movieDetails.duration}min</span>
                        <span>{movieDetails.director}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {movieDetails.genre.map((g) => (
                          <Badge key={g} variant="outline" className="border-white/30 text-white">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleWatchlistToggle}
                        className={`${
                          isInWatchlist ? "bg-teal-600 hover:bg-teal-700" : "bg-white/20 hover:bg-white/30"
                        } text-white backdrop-blur-sm`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                      </Button>

                      {/* Rating Stars */}
                      <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-md px-3 py-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className="text-white hover:text-yellow-400 transition-colors"
                          >
                            <Star className={`w-4 h-4 ${star <= userRating ? "text-yellow-400 fill-current" : ""}`} />
                          </button>
                        ))}
                      </div>

                      {/* Share Button */}
                      <div className="relative group">
                        <Button className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => handleShare("whatsapp")}
                              className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded text-sm"
                            >
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleShare("twitter")}
                              className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded text-sm"
                            >
                              Twitter/X
                            </button>
                            <button
                              onClick={() => handleShare("email")}
                              className="block w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded text-sm"
                            >
                              Email
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Content Tabs */}
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
              {[
                { id: "overview", label: "Overview" },
                { id: "reviews", label: "Reviews" },
                { id: "similar", label: "Similar Movies" },
                { id: "feedback", label: "Feedback" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "bg-teal-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Synopsis */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                  <p className="text-gray-300 leading-relaxed">{movieDetails.synopsis}</p>
                </div>

                {/* Cast */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Cast</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {movieDetails.cast.map((actor, index) => (
                      <div key={index} className="text-center">
                        <img
                          src={actor.image || "/placeholder.svg"}
                          alt={actor.name}
                          className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                        />
                        <p className="text-white text-sm font-medium">{actor.name}</p>
                        <p className="text-gray-400 text-xs">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Streaming Platforms */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Where to Watch</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {movieDetails.streamingPlatforms.map((platform, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          platform.available ? "border-teal-500 bg-teal-500/10" : "border-gray-600 bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{platform.logo}</span>
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                platform.available ? "text-teal-400" : "text-gray-400"
                              }`}
                            >
                              {platform.name}
                            </p>
                            {platform.available && platform.price && (
                              <p className="text-xs text-gray-300">{platform.price}</p>
                            )}
                            {!platform.available && <p className="text-xs text-gray-500">Not Available</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Professional Reviews */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Professional Reviews</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">{movieDetails.reviews.imdb}</div>
                        <div className="text-gray-300 text-sm">IMDb Rating</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-400 mb-1">
                          {movieDetails.reviews.rottenTomatoes.critics}%
                        </div>
                        <div className="text-gray-300 text-sm">Critics Score</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {movieDetails.reviews.rottenTomatoes.audience}%
                        </div>
                        <div className="text-gray-300 text-sm">Audience Score</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* User Reviews */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">User Reviews</h3>
                  <div className="space-y-4">
                    {movieDetails.reviews.userReviews.map((review, index) => (
                      <Card key={index} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{review.user[0].toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{review.user}</p>
                                <p className="text-gray-400 text-xs">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "similar" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Similar Movies</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => scrollSimilarMovies("left")}
                      disabled={similarMoviesIndex === 0}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => scrollSimilarMovies("right")}
                      disabled={similarMoviesIndex >= Math.max(0, movieDetails.similarMovies.length - 4)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movieDetails.similarMovies.slice(similarMoviesIndex, similarMoviesIndex + 4).map((movie) => (
                    <Card
                      key={movie.id}
                      className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors group"
                      onClick={() => {
                        // TODO: Open this movie in the modal
                        console.log("Open movie:", movie.id)
                      }}
                    >
                      <CardContent className="p-3">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-32 object-cover rounded mb-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `/placeholder.svg?height=128&width=96&query=${encodeURIComponent(movie.title)}`
                          }}
                        />
                        <h4 className="text-white font-medium text-sm group-hover:text-teal-400 transition-colors">
                          {movie.title}
                        </h4>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-gray-400 text-xs">{movie.rating}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Help Us Improve</h3>
                  <p className="text-gray-300 mb-4">
                    Was this search result helpful? Your feedback helps us improve our AI matching accuracy.
                  </p>
                </div>

                {searchType && confidence && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <h4 className="text-white font-medium mb-2">Search Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Search Method:</span>
                          <span className="text-white capitalize">{searchType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">AI Confidence:</span>
                          <Badge
                            className={`${
                              confidence >= 80 ? "bg-green-500" : confidence >= 60 ? "bg-yellow-500" : "bg-red-500"
                            } text-white text-xs`}
                          >
                            {confidence}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <label className="block text-white font-medium mb-2">Share your feedback:</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us about your search experience, accuracy of results, or suggestions for improvement..."
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20"
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback.trim()}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      Helpful
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Not Helpful
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
