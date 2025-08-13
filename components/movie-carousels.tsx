"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: number
  title: string
  poster: string
  rating: number
  year: number
  genre: string[]
  trailer: string
  description: string
  aiConfidence?: number
  matchReason?: string
  addedDate?: string
  watched?: boolean
}

interface CarouselData {
  title: string
  endpoint: string
  movies: Movie[]
  loading: boolean
  error: string | null
}

export function MovieCarousels() {
  const [carousels, setCarousels] = useState<CarouselData[]>([
    { title: "Trending Movies", endpoint: "/api/movies/trending", movies: [], loading: true, error: null },
    { title: "Popular This Week", endpoint: "/api/movies/popular", movies: [], loading: true, error: null },
    { title: "New Releases", endpoint: "/api/movies/new-releases", movies: [], loading: true, error: null },
    { title: "AI (MD) Recommended", endpoint: "/api/recommendations", movies: [], loading: true, error: null },
    { title: "Top Rated", endpoint: "/api/movies/top-rated", movies: [], loading: true, error: null },
    { title: "Your Watchlist", endpoint: "/api/watchlist/user", movies: [], loading: true, error: null },
  ])

  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [playingTrailer, setPlayingTrailer] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [watchlistItems, setWatchlistItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Fetch data for all carousels
    carousels.forEach((carousel, index) => {
      fetchCarouselData(carousel.endpoint, index)
    })
  }, [])

  const fetchCarouselData = async (endpoint: string, carouselIndex: number) => {
    try {
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      if (data.success) {
        setCarousels((prev) =>
          prev.map((carousel, index) =>
            index === carouselIndex ? { ...carousel, movies: data.data, loading: false, error: null } : carousel,
          ),
        )

        // Update watchlist items if this is the watchlist carousel
        if (endpoint === "/api/watchlist/user") {
          setWatchlistItems(new Set(data.data.map((movie: Movie) => movie.id)))
        }
      } else {
        throw new Error(data.error || "Failed to fetch data")
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      setCarousels((prev) =>
        prev.map((carousel, index) =>
          index === carouselIndex
            ? { ...carousel, loading: false, error: error instanceof Error ? error.message : "Unknown error" }
            : carousel,
        ),
      )
    }
  }

  const scrollCarousel = (carouselIndex: number, direction: "left" | "right") => {
    const carousel = document.getElementById(`carousel-${carouselIndex}`)
    if (carousel) {
      const scrollAmount = 320 // Width of movie card + gap
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleMovieHover = (movieId: number | null) => {
    setHoveredMovie(movieId)
    if (movieId) {
      // Simulate trailer autoplay after 1 second
      setTimeout(() => {
        if (hoveredMovie === movieId) {
          setPlayingTrailer(movieId)
        }
      }, 1000)
    } else {
      setPlayingTrailer(null)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const togglePlayPause = () => {
    if (playingTrailer) {
      setPlayingTrailer(null)
    } else if (hoveredMovie) {
      setPlayingTrailer(hoveredMovie)
    }
  }

  const toggleWatchlist = async (movie: Movie) => {
    try {
      const isInWatchlist = watchlistItems.has(movie.id)
      const endpoint = isInWatchlist ? "/api/watchlist/remove" : "/api/watchlist/add"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId: movie.id, movie }),
      })

      if (response.ok) {
        setWatchlistItems((prev) => {
          const newSet = new Set(prev)
          if (isInWatchlist) {
            newSet.delete(movie.id)
          } else {
            newSet.add(movie.id)
          }
          return newSet
        })
      }
    } catch (error) {
      console.error("Error updating watchlist:", error)
    }
  }

  const MovieCard = ({ movie, carouselTitle }: { movie: Movie; carouselTitle: string }) => {
    const isHovered = hoveredMovie === movie.id
    const isPlaying = playingTrailer === movie.id
    const isInWatchlist = watchlistItems.has(movie.id)

    return (
      <div
        className="relative flex-shrink-0 w-72 group cursor-pointer"
        onMouseEnter={() => handleMovieHover(movie.id)}
        onMouseLeave={() => handleMovieHover(null)}
      >
        <div
          className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
            isHovered ? "scale-105 shadow-2xl" : "scale-100"
          }`}
        >
          {/* Movie Poster/Trailer */}
          <div className="relative aspect-[2/3] bg-gray-800">
            {isPlaying ? (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="text-white text-center">
                  <Play className="w-16 h-16 mx-auto mb-2 opacity-60" />
                  <p className="text-sm opacity-60">Trailer Playing...</p>
                </div>
              </div>
            ) : (
              <img
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=432&width=288&query=${encodeURIComponent(movie.title + " movie poster")}`
                }}
              />
            )}

            {/* Hover Overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className={`border-0 ${
                      isInWatchlist
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                    onClick={() => toggleWatchlist(movie)}
                  >
                    {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}

            {/* AI Confidence Badge (for recommendations) */}
            {movie.aiConfidence && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-teal-600 text-white text-xs">
                  {movie.aiConfidence}% Match
                </Badge>
              </div>
            )}

            {/* Rating Badge */}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                ⭐ {movie.rating}
              </Badge>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-3 bg-gray-900">
            <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{movie.title}</h3>
            <p className="text-gray-400 text-xs mb-2">
              {movie.year} • {movie.genre.join(", ")}
            </p>

            {/* AI Match Reason (for recommendations) */}
            {movie.matchReason && <p className="text-teal-400 text-xs mb-2 italic">{movie.matchReason}</p>}

            {/* Watched Status (for watchlist) */}
            {carouselTitle === "Your Watchlist" && movie.watched !== undefined && (
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${movie.watched ? "bg-green-500" : "bg-yellow-500"}`} />
                <span className="text-xs text-gray-400">{movie.watched ? "Watched" : "Not Watched"}</span>
              </div>
            )}

            <p className="text-gray-300 text-xs line-clamp-2">{movie.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        {carousels.map((carousel, carouselIndex) => (
          <div key={carousel.title} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{carousel.title}</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  onClick={() => scrollCarousel(carouselIndex, "left")}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  onClick={() => scrollCarousel(carouselIndex, "right")}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {carousel.loading ? (
              <div className="flex space-x-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-72">
                    <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-800 rounded animate-pulse" />
                      <div className="h-3 bg-gray-800 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : carousel.error ? (
              <div className="text-red-400 text-center py-8">
                <p>
                  Error loading {carousel.title.toLowerCase()}: {carousel.error}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 border-red-400 text-red-400 hover:bg-red-400/10 bg-transparent"
                  onClick={() => fetchCarouselData(carousel.endpoint, carouselIndex)}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div
                id={`carousel-${carouselIndex}`}
                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {carousel.movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} carouselTitle={carousel.title} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
