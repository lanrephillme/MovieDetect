"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Plus, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: number
  title: string
  poster: string
  rating: number
  year: number
  genre: string[]
  trailer?: string
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
      console.log(`Fetching data from: ${endpoint}`)
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()
      console.log(`Data received from ${endpoint}:`, data)

      if (data.success && data.data) {
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
            isHovered ? "scale-105 shadow-2xl z-10" : "scale-100"
          }`}
        >
          {/* Movie Poster/Trailer */}
          <div className="relative aspect-[2/3] bg-gray-800">
            {isPlaying ? (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <p className="text-sm opacity-75">Trailer Preview</p>
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
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Top Controls */}
                <div className="flex justify-between items-start">
                  {movie.aiConfidence && (
                    <Badge variant="secondary" className="bg-teal-600 text-white text-xs">
                      {movie.aiConfidence}% Match
                    </Badge>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 p-0"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-0 h-8 w-8 p-0"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-lg line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-300 font-medium">{movie.year}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-400 font-medium">{movie.rating}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`border-gray-500 text-white hover:border-white hover:text-white h-8 px-3 bg-black/70 backdrop-blur-sm transition-all duration-200 text-xs font-medium ${
                        isInWatchlist ? "bg-green-600 border-green-600" : ""
                      }`}
                      onClick={() => toggleWatchlist(movie)}
                    >
                      {isInWatchlist ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                      {isInWatchlist ? "Added" : "My List"}
                    </Button>
                  </div>
                  {movie.matchReason && <p className="text-teal-400 text-xs italic">{movie.matchReason}</p>}
                </div>
              </div>
            )}

            {/* Rating Badge */}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                ⭐ {movie.rating}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {carousels.map((carousel, carouselIndex) => (
          <div key={carousel.title} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{carousel.title}</h2>
            </div>

            <div className="relative group">
              {/* Left Arrow */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
                onClick={() => scrollCarousel(carouselIndex, "left")}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              {/* Right Arrow */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
                onClick={() => scrollCarousel(carouselIndex, "right")}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {carousel.loading ? (
                <div className="flex space-x-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-72">
                      <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse mb-3" />
                    </div>
                  ))}
                </div>
              ) : carousel.error ? (
                <div className="text-red-400 text-center py-8">
                  <p className="mb-2">Error loading {carousel.title.toLowerCase()}</p>
                  <p className="text-sm text-gray-400 mb-4">{carousel.error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-400 text-red-400 hover:bg-red-400/10 bg-transparent"
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
                  {carousel.movies.length > 0 ? (
                    carousel.movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} carouselTitle={carousel.title} />
                    ))
                  ) : (
                    <div className="flex-shrink-0 w-72 h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400 text-center">No movies available</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
