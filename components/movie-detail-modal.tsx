"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  Star,
  Play,
  Plus,
  Volume2,
  VolumeX,
  Clock,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
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

interface StreamingPlatform {
  name: string
  icon: string
  link: string
  type: "subscription" | "rent" | "buy"
  price?: string
  quality?: string
}

interface Review {
  id: string
  source: "imdb" | "rotten_tomatoes" | "user"
  author: string
  content: string
  rating: number
  date: string
  helpful?: number
  avatar?: string
}

interface CastMember {
  id: number
  name: string
  character: string
  image: string
  popularity?: number
}

interface SimilarMovie {
  id: number
  title: string
  poster: string
  rating: number
  year: number
  genre: string[]
  similarity?: number
  previewUrl?: string
}

interface MovieDetail {
  id: number
  title: string
  originalTitle?: string
  year: number
  duration: number
  genre: string[]
  synopsis: string
  poster: string
  backdrop: string
  trailer?: string
  trailerUrl?: string
  previewUrl?: string
  director: string
  writers: string[]
  country: string[]
  language: string[]
  budget?: number
  boxOffice?: number
  ratings: {
    tmdb: number
    imdb: number
    rottenTomatoes: number
    userAverage: number
    metacritic?: number
  }
  streamingPlatforms: StreamingPlatform[]
  cast: CastMember[]
  reviews: Review[]
  similarMovies: SimilarMovie[]
  isInWatchlist: boolean
  userRating?: number
  watchProgress?: number
  releaseDate: string
  certification: string
  keywords: string[]
  tagline?: string
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
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [similarMoviesPage, setSimilarMoviesPage] = useState(0)
  const [hoveredSimilarMovie, setHoveredSimilarMovie] = useState<number | null>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const similarMoviesPerPage = 6

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails(movieId)
    }
  }, [isOpen, movieId])

  useEffect(() => {
    if (isOpen && movie && videoRef.current) {
      // Auto-play trailer after modal opens
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error)
        }
      }, 500)
    }
  }, [isOpen, movie])

  const fetchMovieDetails = async (id: number) => {
    try {
      setLoading(true)

      const response = await fetch(`/api/movies/${id}`)
      const data = await response.json()

      if (data.success) {
        const movieWithPreview = {
          ...data.movie,
          previewUrl: `/previews/preview-${id}.mp4`,
          tagline: "The key to the future is finally unearthed.",
          similarMovies: data.movie.similarMovies.map((similar: SimilarMovie) => ({
            ...similar,
            previewUrl: `/previews/preview-${similar.id}.mp4`,
          })),
        }
        setMovie(movieWithPreview)
        setUserRating(movieWithPreview.userRating || 0)
        await fetchStreamingPlatforms(id)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching movie details:", error)

      // Enhanced fallback with more realistic data
      const mockMovie: MovieDetail = {
        id: id,
        title: "Blade Runner 2049",
        originalTitle: "Blade Runner 2049",
        year: 2017,
        duration: 164,
        genre: ["Science Fiction", "Thriller", "Drama"],
        synopsis:
          "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos. K's discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.",
        poster: "/blade-runner-2049-poster.png",
        backdrop: "/blade-runner-2049-cityscape.png",
        trailer: "/placeholder-trailer.mp4",
        trailerUrl: "https://www.youtube.com/watch?v=gCcx85zbxz4",
        previewUrl: `/previews/preview-${id}.mp4`,
        director: "Denis Villeneuve",
        writers: ["Hampton Fancher", "Michael Green"],
        country: ["United States", "United Kingdom", "Canada"],
        language: ["English"],
        budget: 150000000,
        boxOffice: 259239658,
        releaseDate: "2017-10-06",
        certification: "R",
        keywords: ["dystopia", "android", "sequel", "cyberpunk", "artificial intelligence"],
        tagline: "The key to the future is finally unearthed.",
        ratings: {
          tmdb: 8.0,
          imdb: 8.0,
          rottenTomatoes: 88,
          userAverage: 8.2,
          metacritic: 81,
        },
        streamingPlatforms: [
          {
            name: "Netflix",
            icon: "/netflix-icon.png",
            link: "https://netflix.com/title/80185906",
            type: "subscription",
            quality: "4K HDR",
          },
          {
            name: "Prime Video",
            icon: "/prime-icon.png",
            link: "https://primevideo.com",
            type: "subscription",
            quality: "4K HDR",
          },
          {
            name: "Apple TV",
            icon: "/appletv-icon.png",
            link: "https://tv.apple.com",
            type: "rent",
            price: "$3.99",
            quality: "4K HDR",
          },
          {
            name: "Google Play Movies",
            icon: "/googleplay-icon.png",
            link: "https://play.google.com",
            type: "buy",
            price: "$14.99",
            quality: "HD",
          },
        ],
        cast: [
          { id: 1, name: "Ryan Gosling", character: "Officer K", image: "/cast-1.jpg", popularity: 95 },
          { id: 2, name: "Harrison Ford", character: "Rick Deckard", image: "/cast-2.jpg", popularity: 92 },
          { id: 3, name: "Ana de Armas", character: "Joi", image: "/cast-3.jpg", popularity: 88 },
          { id: 4, name: "Jared Leto", character: "Niander Wallace", image: "/cast-4.jpg", popularity: 85 },
          { id: 5, name: "Sylvia Hoeks", character: "Luv", image: "/cast-5.jpg", popularity: 78 },
          { id: 6, name: "Robin Wright", character: "Lieutenant Joshi", image: "/cast-6.jpg", popularity: 82 },
        ],
        reviews: [
          {
            id: "1",
            source: "imdb",
            author: "MovieCritic2023",
            content:
              "A visually stunning sequel that honors the original while creating something entirely new. Denis Villeneuve has crafted a masterpiece that explores themes of humanity, identity, and what it means to be alive. The cinematography by Roger Deakins is absolutely breathtaking, with every frame looking like a work of art.",
            rating: 9,
            date: "2023-10-15",
            helpful: 234,
            avatar: "/reviewer-1.jpg",
          },
          {
            id: "2",
            source: "rotten_tomatoes",
            author: "Critics Consensus",
            content:
              "Blade Runner 2049 is a rare sequel that enhances its predecessor while standing as a remarkable achievement in its own right. It successfully expands the world while maintaining the philosophical depth and visual splendor that made the original a classic.",
            rating: 8.8,
            date: "2023-10-10",
            helpful: 156,
          },
          {
            id: "3",
            source: "user",
            author: "SciFiFan_2049",
            content:
              "This movie exceeded all my expectations. As a huge fan of the original, I was worried about a sequel, but Villeneuve delivered something special. The story respects the legacy while pushing boundaries. Hans Zimmer's score is haunting and perfect.",
            rating: 10,
            date: "2023-10-12",
            helpful: 89,
            avatar: "/reviewer-2.jpg",
          },
        ],
        similarMovies: [
          {
            id: 2,
            title: "The Matrix",
            poster: "/matrix-movie-poster.png",
            rating: 8.7,
            year: 1999,
            genre: ["Action", "Sci-Fi"],
            similarity: 92,
            previewUrl: "/previews/preview-2.mp4",
          },
          {
            id: 3,
            title: "Interstellar",
            poster: "/interstellar-inspired-poster.png",
            rating: 8.6,
            year: 2014,
            genre: ["Drama", "Sci-Fi"],
            similarity: 89,
            previewUrl: "/previews/preview-3.mp4",
          },
          {
            id: 4,
            title: "Ex Machina",
            poster: "/ex-machina-poster.png",
            rating: 7.7,
            year: 2014,
            genre: ["Drama", "Sci-Fi"],
            similarity: 87,
            previewUrl: "/previews/preview-4.mp4",
          },
          {
            id: 5,
            title: "Her",
            poster: "/her-ai-romance-movie-poster.png",
            rating: 8.0,
            year: 2013,
            genre: ["Drama", "Romance", "Sci-Fi"],
            similarity: 85,
            previewUrl: "/previews/preview-5.mp4",
          },
          {
            id: 6,
            title: "Arrival",
            poster: "/placeholder.svg",
            rating: 7.9,
            year: 2016,
            genre: ["Drama", "Sci-Fi"],
            similarity: 83,
            previewUrl: "/previews/preview-6.mp4",
          },
          {
            id: 7,
            title: "Ghost in the Shell",
            poster: "/placeholder.svg",
            rating: 7.3,
            year: 2017,
            genre: ["Action", "Sci-Fi"],
            similarity: 81,
            previewUrl: "/previews/preview-7.mp4",
          },
        ],
        isInWatchlist: false,
        userRating: 0,
        watchProgress: 0,
      }

      setMovie(mockMovie)
    } finally {
      setLoading(false)
    }
  }

  const fetchStreamingPlatforms = async (movieId: number) => {
    try {
      if (process.env.JUSTWATCH_API_KEY) {
        const response = await fetch(`/api/streaming/platforms?movieId=${movieId}`)
        const data = await response.json()

        if (data.success && movie) {
          setMovie((prev) => (prev ? { ...prev, streamingPlatforms: data.platforms } : null))
        }
      }
    } catch (error) {
      console.error("Error fetching streaming platforms:", error)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!movie) return

    try {
      const endpoint = movie.isInWatchlist ? "/api/watchlist/remove" : "/api/watchlist/add"
      const response = await fetch(endpoint, {
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
      title: `${movie.title} (${movie.year})`,
      text: `Check out ${movie.title} on MovieDetect! ${movie.synopsis.substring(0, 100)}...`,
      url: `${window.location.origin}/movie/${movie.id}`,
    }

    try {
      switch (platform) {
        case "whatsapp":
          window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`)
          break
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}&hashtags=MovieDetect,${movie.genre[0]?.replace(/\s+/g, "")}`,
          )
          break
        case "email":
          window.open(
            `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text}\n\n${shareData.url}`)}`,
          )
          break
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleSimilarMovieClick = (similarMovie: SimilarMovie) => {
    fetchMovieDetails(similarMovie.id)
    setActiveTab("overview")
    setSimilarMoviesPage(0)
  }

  const handleSimilarMovieHover = (movieId: number) => {
    setHoveredSimilarMovie(movieId)
  }

  const handleSimilarMovieLeave = () => {
    setHoveredSimilarMovie(null)
  }

  const handleSubmitFeedback = async () => {
    if (!movie || !feedbackText.trim()) return

    setIsSubmittingFeedback(true)
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
        alert("Thank you for your feedback! We'll use it to improve our search results.")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const getConfidenceColor = (score?: number) => {
    if (!score) return "bg-gray-500"
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const paginatedSimilarMovies =
    movie?.similarMovies.slice(
      similarMoviesPage * similarMoviesPerPage,
      (similarMoviesPage + 1) * similarMoviesPerPage,
    ) || []

  const totalSimilarPages = Math.ceil((movie?.similarMovies.length || 0) / similarMoviesPerPage)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="w-full h-full overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
              <p className="text-white mt-4 text-lg">Loading movie details...</p>
              <p className="text-gray-400 text-sm mt-2">Fetching data from multiple sources...</p>
            </div>
          </div>
        ) : movie ? (
          <>
            {/* Close Button */}
            <div className="absolute top-6 right-6 z-30">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-black/50 bg-black/30 backdrop-blur-sm w-12 h-12 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Cinematic Hero Section */}
            <div className="relative h-screen overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={movie.backdrop || movie.poster}
                  alt={movie.title}
                  className={`w-full h-full object-cover transition-all duration-1000 ${
                    isPlaying && isVideoLoaded ? "opacity-0" : "opacity-100"
                  }`}
                />
              </div>

              {/* Background Video */}
              {isPlaying && (
                <div className="absolute inset-0">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    loop
                    playsInline
                    onLoadedData={handleVideoLoad}
                    poster={movie.backdrop || movie.poster}
                  >
                    <source src={movie.previewUrl} type="video/mp4" />
                  </video>

                  {/* Soft blur overlay */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              {/* Video Controls */}
              <div className="absolute top-6 left-6 flex space-x-3 z-20">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* AI Confidence Score Badge */}
              {confidenceScore && (
                <div className="absolute top-6 right-20 z-20">
                  <Badge
                    className={`${getConfidenceColor(confidenceScore)} text-white backdrop-blur-sm text-sm px-3 py-1`}
                  >
                    AI Match: {confidenceScore}%{confidenceScore < 60 && " ⚠️"}
                  </Badge>
                </div>
              )}

              {/* Movie Info */}
              <div className="absolute bottom-0 left-0 right-0 p-12">
                <div className="max-w-4xl">
                  <div className="mb-6">
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 leading-tight tracking-tight">
                      {movie.title}
                    </h1>
                    {movie.tagline && <p className="text-2xl text-gray-200 mb-6 font-light">{movie.tagline}</p>}

                    <div className="flex items-center space-x-8 text-gray-300 text-lg mb-6">
                      <span className="font-medium">{movie.year}</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>{formatDuration(movie.duration)}</span>
                      </div>
                      <Badge variant="outline" className="border-gray-400 text-gray-300 text-sm">
                        {movie.certification}
                      </Badge>
                      <div className="flex space-x-2">
                        {movie.genre.slice(0, 3).map((g) => (
                          <Badge key={g} variant="outline" className="border-gray-500 text-gray-300">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Ratings */}
                    <div className="flex items-center space-x-8 mb-8">
                      <div className="flex items-center space-x-2">
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        <span className="text-white text-xl font-medium">TMDb: {movie.ratings.tmdb}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        <span className="text-white text-xl font-medium">IMDb: {movie.ratings.imdb}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white text-xl font-medium">RT: {movie.ratings.rottenTomatoes}%</span>
                      </div>
                      {movie.ratings.metacritic && (
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-xl font-medium">MC: {movie.ratings.metacritic}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl">{movie.synopsis}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 mb-8">
                    <Button
                      className="bg-white text-black hover:bg-gray-200 px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                      onClick={() => movie.trailerUrl && window.open(movie.trailerUrl, "_blank")}
                    >
                      <Play className="w-6 h-6 mr-3" />
                      Watch Trailer
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-lg"
                      onClick={handleAddToWatchlist}
                    >
                      {movie.isInWatchlist ? (
                        <>
                          <Heart className="w-6 h-6 mr-3 fill-current text-red-500" />
                          In Watchlist
                        </>
                      ) : (
                        <>
                          <Plus className="w-6 h-6 mr-3" />
                          Add to Watchlist
                        </>
                      )}
                    </Button>

                    {/* Rating Stars */}
                    <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-6 py-4">
                      <span className="text-white text-lg mr-3">Rate:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateMovie(star)}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          <Star className={`w-6 h-6 ${star <= userRating ? "text-yellow-400 fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>

                    {/* Share Dropdown */}
                    <div className="relative group">
                      <Button
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-4 text-lg font-semibold rounded-lg"
                      >
                        <Share2 className="w-6 h-6 mr-3" />
                        Share
                      </Button>
                      <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="p-2 space-y-1 min-w-[150px]">
                          <button
                            onClick={() => handleShare("whatsapp")}
                            className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded text-sm"
                          >
                            WhatsApp
                          </button>
                          <button
                            onClick={() => handleShare("twitter")}
                            className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded text-sm"
                          >
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare("email")}
                            className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded text-sm"
                          >
                            Email
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Streaming Platforms Bar */}
            <div className="px-12 py-8 bg-gray-900 border-b border-gray-800">
              <h3 className="text-white font-semibold mb-6 text-xl">Available On:</h3>
              <div className="flex flex-wrap gap-6">
                {movie.streamingPlatforms.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 px-6 py-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group"
                  >
                    <img
                      src={platform.icon || "/placeholder-logo.png"}
                      alt={platform.name}
                      className="w-10 h-10 rounded"
                    />
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-lg">{platform.name}</span>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-300 capitalize">{platform.type}</span>
                        {platform.price && <span className="text-green-400 font-medium">{platform.price}</span>}
                        {platform.quality && (
                          <Badge variant="outline" className="border-blue-400 text-blue-400 text-xs">
                            {platform.quality}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-800 bg-gray-900">
              <div className="flex space-x-12 px-12">
                {[
                  { id: "overview", label: "Overview", icon: Globe },
                  { id: "reviews", label: "Reviews & Ratings", icon: Star },
                  { id: "similar", label: "Similar Movies", icon: ThumbsUp },
                  { id: "feedback", label: "Feedback", icon: MessageSquare },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-3 py-6 px-3 border-b-2 font-medium text-lg transition-colors ${
                      activeTab === tab.id
                        ? "border-teal-500 text-teal-400"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-12 bg-gray-900">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-12">
                    {/* Cast */}
                    <div>
                      <h3 className="text-3xl font-semibold text-white mb-8">Cast & Crew</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {movie.cast.slice(0, 6).map((actor) => (
                          <div key={actor.id} className="text-center group cursor-pointer">
                            <img
                              src={actor.image || "/placeholder-user.jpg"}
                              alt={actor.name}
                              className="w-32 h-32 rounded-full object-cover mb-4 mx-auto group-hover:scale-105 transition-transform"
                            />
                            <p className="text-white font-medium text-lg">{actor.name}</p>
                            <p className="text-gray-400">{actor.character}</p>
                            {actor.popularity && (
                              <div className="mt-2">
                                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                  {actor.popularity}% popular
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keywords */}
                    {movie.keywords.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-6">Keywords</h3>
                        <div className="flex flex-wrap gap-3">
                          {movie.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-gray-600 text-gray-300 text-sm px-3 py-1"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Details */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-6">Movie Details</h3>
                      <div className="space-y-4 text-base">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Director:</span>
                          <span className="text-white font-medium">{movie.director}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Writers:</span>
                          <span className="text-white text-right">{movie.writers.join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Release Date:</span>
                          <span className="text-white">{new Date(movie.releaseDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Runtime:</span>
                          <span className="text-white">{formatDuration(movie.duration)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Country:</span>
                          <span className="text-white text-right">{movie.country.join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Language:</span>
                          <span className="text-white text-right">{movie.language.join(", ")}</span>
                        </div>
                        {movie.budget && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Budget:</span>
                            <span className="text-white">{formatCurrency(movie.budget)}</span>
                          </div>
                        )}
                        {movie.boxOffice && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Box Office:</span>
                            <span className="text-white">{formatCurrency(movie.boxOffice)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Watch Progress */}
                    {movie.watchProgress && movie.watchProgress > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Your Progress</h3>
                        <div className="bg-gray-700 rounded-full h-3 mb-3">
                          <div
                            className="bg-teal-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${movie.watchProgress}%` }}
                          />
                        </div>
                        <p className="text-gray-400">{movie.watchProgress}% watched</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-semibold text-white">Reviews & Ratings</h3>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{movie.ratings.userAverage}</div>
                        <div className="text-gray-400">User Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{movie.ratings.rottenTomatoes}%</div>
                        <div className="text-gray-400">Critics</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-8">
                    {movie.reviews.map((review) => (
                      <Card key={review.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              {review.avatar && (
                                <img
                                  src={review.avatar || "/placeholder.svg"}
                                  alt={review.author}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <h4 className="text-white font-medium text-lg">{review.author}</h4>
                                <div className="flex items-center space-x-3 text-gray-400">
                                  <Badge
                                    variant="outline"
                                    className={`text-sm ${
                                      review.source === "imdb"
                                        ? "border-yellow-500 text-yellow-400"
                                        : review.source === "rotten_tomatoes"
                                          ? "border-red-500 text-red-400"
                                          : "border-blue-500 text-blue-400"
                                    }`}
                                  >
                                    {review.source.replace("_", " ").toUpperCase()}
                                  </Badge>
                                  <span>{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                              <span className="text-white font-medium text-lg">{review.rating}/10</span>
                            </div>
                          </div>
                          <p className="text-gray-300 leading-relaxed mb-6 text-lg">{review.content}</p>
                          {review.helpful && (
                            <div className="flex items-center space-x-6 text-gray-400">
                              <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                                <ThumbsUp className="w-5 h-5" />
                                <span>{review.helpful} helpful</span>
                              </button>
                              <button className="flex items-center space-x-2 hover:text-red-400 transition-colors">
                                <ThumbsDown className="w-5 h-5" />
                                <span>Not helpful</span>
                              </button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "similar" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-semibold text-white">Similar Movies</h3>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSimilarMoviesPage(Math.max(0, similarMoviesPage - 1))}
                        disabled={similarMoviesPage === 0}
                        className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-gray-400">
                        {similarMoviesPage + 1} of {totalSimilarPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSimilarMoviesPage(Math.min(totalSimilarPages - 1, similarMoviesPage + 1))}
                        disabled={similarMoviesPage >= totalSimilarPages - 1}
                        className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {paginatedSimilarMovies.map((similarMovie) => (
                      <Card
                        key={similarMovie.id}
                        className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-all duration-300 group overflow-hidden"
                        onClick={() => handleSimilarMovieClick(similarMovie)}
                        onMouseEnter={() => handleSimilarMovieHover(similarMovie.id)}
                        onMouseLeave={handleSimilarMovieLeave}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            {/* Static Poster */}
                            <img
                              src={similarMovie.poster || "/placeholder.svg"}
                              alt={similarMovie.title}
                              className={`w-full h-64 object-cover transition-all duration-500 ${
                                hoveredSimilarMovie === similarMovie.id
                                  ? "opacity-0 scale-110"
                                  : "opacity-100 scale-100"
                              }`}
                            />

                            {/* Preview Video on Hover */}
                            {hoveredSimilarMovie === similarMovie.id && (
                              <div className="absolute inset-0">
                                <video
                                  className="w-full h-full object-cover scale-110"
                                  muted
                                  loop
                                  playsInline
                                  autoPlay
                                  poster={similarMovie.poster}
                                >
                                  <source src={similarMovie.previewUrl} type="video/mp4" />
                                </video>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              </div>
                            )}

                            {similarMovie.similarity && (
                              <Badge className="absolute top-3 right-3 bg-teal-600 text-white text-xs">
                                {similarMovie.similarity}% match
                              </Badge>
                            )}

                            {/* Hover Info Overlay */}
                            {hoveredSimilarMovie === similarMovie.id && (
                              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                                <h4 className="text-white font-medium text-base mb-1 line-clamp-2 group-hover:text-teal-400 transition-colors">
                                  {similarMovie.title}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <p className="text-gray-300 text-sm">{similarMovie.year}</p>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-300">{similarMovie.rating}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Movie Info (when not hovered) */}
                          {hoveredSimilarMovie !== similarMovie.id && (
                            <div className="p-4">
                              <h4 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-teal-400 transition-colors">
                                {similarMovie.title}
                              </h4>
                              <div className="flex items-center justify-between">
                                <p className="text-gray-400 text-xs">{similarMovie.year}</p>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-400">{similarMovie.rating}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {similarMovie.genre.slice(0, 2).map((g) => (
                                  <Badge key={g} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                    {g}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "feedback" && (
                <div className="space-y-8 max-w-3xl">
                  <div>
                    <h3 className="text-3xl font-semibold text-white mb-4">Help Us Improve</h3>
                    <p className="text-gray-400 text-lg">
                      Your feedback helps us improve our search results and recommendations. Let us know if this was the
                      movie you were looking for!
                    </p>
                  </div>

                  {searchType && (
                    <div className="bg-gray-800 p-6 rounded-lg">
                      <h4 className="text-white font-medium mb-4 text-lg">Search Information</h4>
                      <div className="space-y-2">
                        <p className="text-gray-300">
                          <strong>Search Method:</strong> {searchType}
                        </p>
                        {confidenceScore && (
                          <p className="text-gray-300">
                            <strong>AI Confidence:</strong> {confidenceScore}%
                          </p>
                        )}
                        <p className="text-gray-300">
                          <strong>Result:</strong> {movie.title} ({movie.year})
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="feedback" className="text-white text-lg">
                        Your Feedback *
                      </Label>
                      <Textarea
                        id="feedback"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Was this the movie you were looking for? How accurate was our search? Any suggestions for improvement?"
                        className="mt-3 bg-gray-800 border-gray-600 text-white min-h-[150px] text-base"
                        rows={6}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white text-lg">
                        Email (optional)
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        placeholder="your@email.com (for follow-up questions)"
                        className="mt-3 bg-gray-800 border-gray-600 text-white text-base"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitFeedback}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg"
                      disabled={!feedbackText.trim() || isSubmittingFeedback}
                    >
                      {isSubmittingFeedback ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-5 h-5 mr-3" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    <h4 className="text-white font-medium mb-4 text-lg">Quick Actions</h4>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
                        onClick={() => setFeedbackText("Perfect match! This is exactly what I was looking for.")}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Perfect Match
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
                        onClick={() => setFeedbackText("Close, but not quite the movie I was searching for.")}
                      >
                        Close Match
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-400 hover:bg-red-500/10 bg-transparent"
                        onClick={() => setFeedbackText("This is not the movie I was looking for at all.")}
                      >
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Wrong Movie
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-white text-xl">Movie not found</p>
              <p className="text-gray-400 mt-2">Please try searching again or contact support.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
