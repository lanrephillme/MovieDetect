"use client"

import { useState, useRef, useEffect } from "react"
import { X, Play, Plus, Check, Star, Volume2, VolumeX, Share, Heart, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface MovieDetailModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number | null
}

interface MovieDetails {
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
  streamingPlatforms: Array<{
    name: string
    icon: string
    link: string
    type: "subscription" | "rent" | "buy"
    price?: string
  }>
  cast: Array<{
    name: string
    character: string
    image: string
  }>
  reviews: Array<{
    source: string
    author: string
    content: string
    rating: number
    date: string
  }>
  similarMovies: Array<{
    id: number
    title: string
    poster: string
    rating: number
    year: number
  }>
  isInWatchlist: boolean
  userRating: number
  aiConfidence?: number
}

export function MovieDetailModal({ isOpen, onClose, movieId }: MovieDetailModalProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails(movieId)
    }
  }, [isOpen, movieId])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const fetchMovieDetails = async (id: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/movies/${id}`)
      const data = await response.json()

      if (data.success && data.movie) {
        setMovie(data.movie)
        setUserRating(data.movie.userRating || 0)
        setIsInWatchlist(data.movie.isInWatchlist || false)
      } else {
        // Fallback mock data
        const mockMovie = generateMockMovieDetails(id)
        setMovie(mockMovie)
        setUserRating(mockMovie.userRating || 0)
        setIsInWatchlist(mockMovie.isInWatchlist || false)
      }
    } catch (error) {
      console.error("Error fetching movie details:", error)
      const mockMovie = generateMockMovieDetails(id)
      setMovie(mockMovie)
      setUserRating(mockMovie.userRating || 0)
      setIsInWatchlist(mockMovie.isInWatchlist || false)
    } finally {
      setLoading(false)
    }
  }

  const generateMockMovieDetails = (id: number): MovieDetails => {
    const mockMovies = [
      {
        id: 1,
        title: "Blade Runner 2049",
        year: 2017,
        duration: 164,
        genre: ["Sci-Fi", "Thriller", "Drama"],
        synopsis:
          "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
        poster: "/blade-runner-2049-poster.png",
        backdrop: "/blade-runner-2049-cityscape.png",
        trailer: "/placeholder-trailer.mp4",
      },
      {
        id: 2,
        title: "The Matrix",
        year: 1999,
        duration: 136,
        genre: ["Action", "Sci-Fi"],
        synopsis:
          "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
        poster: "/matrix-movie-poster.png",
        backdrop: "/matrix-digital-rain.png",
        trailer: "/placeholder-trailer.mp4",
      },
      {
        id: 3,
        title: "Interstellar",
        year: 2014,
        duration: 169,
        genre: ["Sci-Fi", "Drama"],
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        poster: "/interstellar-inspired-poster.png",
        backdrop: "/interstellar-space.png",
        trailer: "/placeholder-trailer.mp4",
      },
    ]

    const baseMovie = mockMovies.find((m) => m.id === id) || mockMovies[0]

    return {
      ...baseMovie,
      ratings: {
        tmdb: 8.2,
        imdb: 8.0,
        rottenTomatoes: 88,
        userAverage: 8.2,
      },
      streamingPlatforms: [
        {
          name: "Netflix",
          icon: "/netflix-icon.png",
          link: "https://netflix.com",
          type: "subscription",
        },
        {
          name: "Prime Video",
          icon: "/prime-icon.png",
          link: "https://primevideo.com",
          type: "subscription",
        },
        {
          name: "Apple TV",
          icon: "/appletv-icon.png",
          link: "https://tv.apple.com",
          type: "rent",
          price: "$3.99",
        },
        {
          name: "Google Play",
          icon: "/googleplay-icon.png",
          link: "https://play.google.com",
          type: "buy",
          price: "$14.99",
        },
      ],
      cast: [
        {
          name: "Ryan Gosling",
          character: "K",
          image: "/cast-1.jpg",
        },
        {
          name: "Harrison Ford",
          character: "Rick Deckard",
          image: "/cast-2.jpg",
        },
        {
          name: "Ana de Armas",
          character: "Joi",
          image: "/cast-3.jpg",
        },
        {
          name: "Jared Leto",
          character: "Niander Wallace",
          image: "/cast-4.jpg",
        },
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
        {
          id: 2,
          title: "The Matrix",
          poster: "/matrix-movie-poster.png",
          rating: 8.7,
          year: 1999,
        },
        {
          id: 3,
          title: "Interstellar",
          poster: "/interstellar-inspired-poster.png",
          rating: 8.6,
          year: 2014,
        },
        {
          id: 4,
          title: "Ex Machina",
          poster: "/ex-machina-poster.png",
          rating: 7.7,
          year: 2014,
        },
        {
          id: 5,
          title: "Her",
          poster: "/her-ai-romance-movie-poster.png",
          rating: 8.0,
          year: 2013,
        },
        {
          id: 6,
          title: "Arrival",
          poster: "/placeholder.svg",
          rating: 7.9,
          year: 2016,
        },
        {
          id: 7,
          title: "Ghost in the Shell",
          poster: "/placeholder.svg",
          rating: 7.3,
          year: 2017,
        },
      ],
      isInWatchlist: false,
      userRating: 0,
      aiConfidence: Math.floor(Math.random() * 40) + 60,
    }
  }

  const handlePlayPause = () => {
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
          .catch((error) => {
            console.log("Modal video play failed:", error)
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

  const handleRating = async (rating: number) => {
    setUserRating(rating)
    try {
      await fetch(`/api/movies/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie?.id, rating }),
      })
    } catch (error) {
      console.error("Error rating movie:", error)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!movie) return
    try {
      const endpoint = isInWatchlist ? "/api/watchlist/remove" : "/api/watchlist/add"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      })

      const result = await response.json()
      if (result.success) {
        setIsInWatchlist(!isInWatchlist)
      }
    } catch (error) {
      console.error("Error updating watchlist:", error)
    }
  }

  const handleShare = (platform: string) => {
    if (!movie) return

    const url = `${window.location.origin}/movie/${movie.id}`
    const text = `Check out ${movie.title} (${movie.year}) - ${movie.synopsis.slice(0, 100)}...`

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank")
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        )
        break
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(movie.title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
          "_blank",
        )
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

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="h-full overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-xl">Loading movie details...</div>
          </div>
        ) : movie ? (
          <div className="relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 z-20 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Hero Section */}
            <div className="relative h-screen">
              {/* Background Video/Image */}
              <div className="absolute inset-0">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted={isMuted}
                  loop
                  playsInline
                  poster={movie.backdrop}
                  onLoadedData={() => {
                    // Auto-play after 2 seconds
                    setTimeout(() => {
                      if (videoRef.current) {
                        videoRef.current
                          .play()
                          .then(() => {
                            setIsVideoPlaying(true)
                          })
                          .catch((error) => {
                            console.log("Modal video autoplay failed:", error)
                            setIsVideoPlaying(false)
                          })
                      }
                    }, 2000)
                  }}
                  onError={(e) => {
                    console.log("Modal video failed to load, using fallback image")
                    setIsVideoPlaying(false)
                  }}
                >
                  <source src={movie.trailer} type="video/mp4" />
                </video>

                {/* Fallback background image */}
                {!isVideoPlaying && (
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-end">
                <div className="container mx-auto px-6 lg:px-8 pb-20">
                  <div className="max-w-3xl">
                    <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">{movie.title}</h1>

                    <div className="flex items-center space-x-6 mb-6">
                      <span className="text-gray-300 text-lg">{movie.year}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-300 text-lg">
                        {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                      </span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold text-lg">{movie.ratings.userAverage.toFixed(1)}</span>
                      </div>
                      {movie.aiConfidence && (
                        <>
                          <span className="text-gray-300">•</span>
                          <Badge className="bg-green-600 text-white">AI Match: {movie.aiConfidence}%</Badge>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {movie.genre.map((g) => (
                        <Badge key={g} variant="outline" className="border-gray-400 text-gray-300 text-sm">
                          {g}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-gray-200 text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl">{movie.synopsis}</p>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 mb-8">
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                        onClick={handlePlayPause}
                      >
                        <Play className="w-6 h-6 mr-2" />
                        {isVideoPlaying ? "Pause" : "Play"} Trailer
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                        onClick={handleAddToWatchlist}
                      >
                        {isInWatchlist ? <Check className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                        {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                        onClick={handleMuteToggle}
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </Button>

                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                        onClick={() => setIsLiked(!isLiked)}
                      >
                        <Heart className={`w-6 h-6 ${isLiked ? "fill-current text-red-500" : ""}`} />
                      </Button>
                    </div>

                    {/* Share Buttons */}
                    <div className="flex items-center space-x-4 mb-8">
                      <span className="text-white font-medium">Share:</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500/50 text-green-400 hover:bg-green-500/20 bg-transparent"
                        onClick={() => handleShare("whatsapp")}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 bg-transparent"
                        onClick={() => handleShare("twitter")}
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Twitter/X
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-500/50 text-gray-400 hover:bg-gray-500/20 bg-transparent"
                        onClick={() => handleShare("email")}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>

                    {/* User Rating */}
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-medium">Rate this movie:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => handleRating(star)}
                            className="transition-colors duration-200"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= (hoveredRating || userRating) ? "text-yellow-400 fill-current" : "text-gray-400"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {userRating > 0 && <span className="text-gray-300">Your rating: {userRating}/5</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-black">
              <div className="container mx-auto px-6 lg:px-8">
                {/* Tab Navigation */}
                <div className="flex space-x-8 border-b border-gray-800">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "reviews", label: "Reviews" },
                    { id: "similar", label: "Similar Movies" },
                    { id: "ai-insights", label: "AI Insights" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 text-lg font-medium transition-colors duration-200 border-b-2 ${
                        activeTab === tab.id
                          ? "text-white border-white"
                          : "text-gray-400 border-transparent hover:text-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="py-12">
                  {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      {/* Main Info */}
                      <div className="lg:col-span-2 space-y-8">
                        {/* Ratings */}
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-6">Ratings</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-gray-900 border-gray-800">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-400 mb-1">{movie.ratings.tmdb}</div>
                                <div className="text-gray-400 text-sm">TMDB</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-900 border-gray-800">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-400 mb-1">{movie.ratings.imdb}</div>
                                <div className="text-gray-400 text-sm">IMDb</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-900 border-gray-800">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-400 mb-1">
                                  {movie.ratings.rottenTomatoes}%
                                </div>
                                <div className="text-gray-400 text-sm">Rotten Tomatoes</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gray-900 border-gray-800">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-400 mb-1">
                                  {movie.ratings.userAverage.toFixed(1)}
                                </div>
                                <div className="text-gray-400 text-sm">User Average</div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Cast */}
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-6">Cast</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {movie.cast.map((actor, index) => (
                              <div key={index} className="text-center">
                                <img
                                  src={actor.image || "/placeholder.svg"}
                                  alt={actor.name}
                                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "/placeholder-user.jpg"
                                  }}
                                />
                                <div className="text-white font-medium text-sm">{actor.name}</div>
                                <div className="text-gray-400 text-xs">{actor.character}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Streaming Platforms */}
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-6">Watch Now</h3>
                        <div className="space-y-4">
                          {movie.streamingPlatforms.map((platform, index) => (
                            <Card
                              key={index}
                              className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
                              onClick={() => window.open(platform.link, "_blank")}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={platform.icon || "/placeholder.svg"}
                                      alt={platform.name}
                                      className="w-8 h-8 rounded"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg"
                                      }}
                                    />
                                    <div>
                                      <div className="text-white font-medium">{platform.name}</div>
                                      <div className="text-gray-400 text-sm capitalize">{platform.type}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    {platform.price && <div className="text-white font-medium">{platform.price}</div>}
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white mt-1">
                                      {platform.type === "subscription"
                                        ? "Watch"
                                        : platform.type === "rent"
                                          ? "Rent"
                                          : "Buy"}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-white mb-6">Reviews</h3>
                      {movie.reviews.map((review, index) => (
                        <Card key={index} className="bg-gray-900 border-gray-800">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="text-white font-medium">{review.author}</div>
                                <div className="text-gray-400 text-sm">{review.source}</div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white font-medium">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed mb-3">{review.content}</p>
                            <div className="text-gray-500 text-sm">{review.date}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {activeTab === "similar" && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">Similar Movies</h3>
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
                              fetchMovieDetails(similarMovie.id)
                              setActiveTab("overview")
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
                  )}

                  {activeTab === "ai-insights" && (
                    <div className="space-y-8">
                      <h3 className="text-2xl font-bold text-white mb-6">AI Insights</h3>

                      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800/50">
                        <CardContent className="p-6">
                          <h4 className="text-xl font-semibold text-white mb-4">Match Score</h4>
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="text-4xl font-bold text-green-400">{movie.aiConfidence || 92}%</div>
                            <div className="text-gray-300">Based on your viewing history and preferences</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Genre Match</span>
                              <span className="text-white">95%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Director Style</span>
                              <span className="text-white">88%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Mood & Tone</span>
                              <span className="text-white">94%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-6">
                          <h4 className="text-xl font-semibold text-white mb-4">Why You'll Love This</h4>
                          <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>You enjoyed similar sci-fi thrillers like "Ex Machina" and "Her"</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>The cinematography style matches your preference for visually stunning films</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Complex narrative structure similar to movies you've rated highly</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>Features themes of identity and consciousness that align with your interests</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-6">
                          <h4 className="text-xl font-semibold text-white mb-4">Best Time to Watch</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-gray-800 rounded-lg">
                              <div className="text-2xl mb-2">🌙</div>
                              <div className="text-white font-medium">Evening</div>
                              <div className="text-gray-400 text-sm">Perfect for a contemplative night</div>
                            </div>
                            <div className="text-center p-4 bg-gray-800 rounded-lg">
                              <div className="text-2xl mb-2">🍿</div>
                              <div className="text-white font-medium">Weekend</div>
                              <div className="text-gray-400 text-sm">When you have time to absorb</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-xl">Movie not found</div>
          </div>
        )}
      </div>
    </div>
  )
}
