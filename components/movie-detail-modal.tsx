"use client"

import { useState, useEffect } from "react"
import { X, Star, Play, Plus, Share2, Volume2, VolumeX, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface MovieDetailModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number | null
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
    userAverage: number
  }
  streamingPlatforms: {
    name: string
    icon: string
    link: string
  }[]
  cast: {
    name: string
    character: string
    image: string
  }[]
  similarMovies: {
    id: number
    title: string
    poster: string
    rating: number
  }[]
}

export function MovieDetailModal({ isOpen, onClose, movieId }: MovieDetailModalProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails(movieId)
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async (id: number) => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const response = await fetch(`/api/movies/${id}`)
      const data = await response.json()
      setMovie(data.movie)
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
          userAverage: 8.2,
        },
        streamingPlatforms: [
          { name: "Netflix", icon: "/netflix-icon.png", link: "https://netflix.com" },
          { name: "Prime Video", icon: "/prime-icon.png", link: "https://primevideo.com" },
          { name: "Hulu", icon: "/hulu-icon.png", link: "https://hulu.com" },
        ],
        cast: [
          { name: "Ryan Gosling", character: "K", image: "/cast-1.jpg" },
          { name: "Harrison Ford", character: "Rick Deckard", image: "/cast-2.jpg" },
          { name: "Ana de Armas", character: "Joi", image: "/cast-3.jpg" },
        ],
        similarMovies: [
          { id: 2, title: "The Matrix", poster: "/matrix-movie-poster.png", rating: 8.7 },
          { id: 3, title: "Interstellar", poster: "/interstellar-inspired-poster.png", rating: 8.6 },
          { id: 4, title: "Ex Machina", poster: "/ex-machina-poster.png", rating: 7.7 },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!movie) return

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId: movie.id }),
      })

      const result = await response.json()
      console.log("Added to watchlist:", result)
    } catch (error) {
      console.error("Error adding to watchlist:", error)
    }
  }

  const handleShare = async (platform: "social" | "whatsapp" | "email") => {
    if (!movie) return

    const shareData = {
      title: movie.title,
      text: `Check out ${movie.title} on MovieDetect!`,
      url: `${window.location.origin}/movie/${movie.id}`,
    }

    try {
      switch (platform) {
        case "social":
          if (navigator.share) {
            await navigator.share(shareData)
          } else {
            // Fallback to copying to clipboard
            await navigator.clipboard.writeText(shareData.url)
            alert("Link copied to clipboard!")
          }
          break
        case "whatsapp":
          window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`)
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
    // TODO: Open new movie detail modal or update current one
    console.log("Opening similar movie:", similarMovie.title)
    fetchMovieDetails(similarMovie.id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl bg-gray-900 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
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
                  <video className="w-full h-full object-cover" autoPlay loop muted={isMuted} playsInline>
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
                          <Plus className="w-5 h-5 mr-2" />
                          My List
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-500 text-white hover:bg-white/10 bg-transparent"
                          onClick={() => handleShare("social")}
                        >
                          <Share2 className="w-5 h-5 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-8">
                {/* Ratings and Synopsis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Synopsis</h3>
                      <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
                    </div>

                    {/* Cast */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Cast</h3>
                      <div className="flex space-x-4 overflow-x-auto">
                        {movie.cast.map((actor, index) => (
                          <div key={index} className="flex-shrink-0 text-center">
                            <img
                              src={actor.image || "/placeholder-user.jpg"}
                              alt={actor.name}
                              className="w-20 h-20 rounded-full object-cover mb-2"
                            />
                            <p className="text-sm text-white font-medium">{actor.name}</p>
                            <p className="text-xs text-gray-400">{actor.character}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Ratings */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Ratings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">TMDb</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white">{movie.ratings.tmdb}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">IMDb</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white">{movie.ratings.imdb}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">User Average</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white">{movie.ratings.userAverage}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Streaming Platforms */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Watch On</h3>
                      <div className="space-y-2">
                        {movie.streamingPlatforms.map((platform, index) => (
                          <a
                            key={index}
                            href={platform.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <img
                              src={platform.icon || "/placeholder-logo.png"}
                              alt={platform.name}
                              className="w-8 h-8 rounded"
                            />
                            <span className="text-white">{platform.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Share Options */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Share</h3>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                          onClick={() => handleShare("whatsapp")}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                          onClick={() => handleShare("email")}
                        >
                          Email
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Similar Movies */}
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">More Like This</h3>
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
