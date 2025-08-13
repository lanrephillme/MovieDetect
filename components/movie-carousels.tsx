"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Star, Volume2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MovieDetailModal } from "@/components/movie-detail-modal"

interface Movie {
  id: number
  title: string
  poster: string
  backdrop?: string
  rating: number
  year: number
  genre: string[]
  description: string
  trailer?: string
  confidence?: number
  matchReason?: string
  watchProgress?: number
  isInWatchlist?: boolean
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
    { title: "Trending Now", endpoint: "/api/movies/trending", movies: [], loading: true, error: null },
    { title: "Popular This Week", endpoint: "/api/movies/popular", movies: [], loading: true, error: null },
    { title: "New Releases", endpoint: "/api/movies/new-releases", movies: [], loading: true, error: null },
    { title: "AI Recommendations", endpoint: "/api/recommendations", movies: [], loading: true, error: null },
    { title: "Top Rated", endpoint: "/api/movies/top-rated", movies: [], loading: true, error: null },
    { title: "Your Watchlist", endpoint: "/api/watchlist/user", movies: [], loading: true, error: null },
  ])

  const [hoveredMovie, setHoveredMovie] = useState<{ carouselIndex: number; movieId: number } | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([])
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Fetch data for all carousels
    carousels.forEach((carousel, index) => {
      fetchCarouselData(carousel.endpoint, index)
    })
  }, [])

  const fetchCarouselData = async (endpoint: string, carouselIndex: number) => {
    try {
      console.log(`[CAROUSEL] Fetching data from ${endpoint}`)

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error(`[CAROUSEL] Non-JSON response from ${endpoint}:`, text.substring(0, 200))
        throw new Error("Invalid response format - expected JSON")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "API request failed")
      }

      console.log(`[CAROUSEL] Successfully loaded ${data.data?.length || 0} movies from ${endpoint}`)

      setCarousels((prev) =>
        prev.map((carousel, index) =>
          index === carouselIndex ? { ...carousel, movies: data.data || [], loading: false, error: null } : carousel,
        ),
      )
    } catch (error) {
      console.error(`[CAROUSEL] Error fetching ${endpoint}:`, error)

      setCarousels((prev) =>
        prev.map((carousel, index) =>
          index === carouselIndex
            ? {
                ...carousel,
                movies: [],
                loading: false,
                error: error instanceof Error ? error.message : "Failed to load movies",
              }
            : carousel,
        ),
      )
    }
  }

  const scroll = (carouselIndex: number, direction: "left" | "right") => {
    const container = scrollRefs.current[carouselIndex]
    if (container) {
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleMovieHover = (carouselIndex: number, movieId: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMovie({ carouselIndex, movieId })
    }, 500) // Delay hover effect
  }

  const handleMovieLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setHoveredMovie(null)
  }

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId)
    setIsDetailModalOpen(true)
  }

  const handleAddToWatchlist = async (movieId: number, event: React.MouseEvent) => {
    event.stopPropagation()

    try {
      const response = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      })

      const result = await response.json()
      if (result.success) {
        // Update movie in all carousels
        setCarousels((prev) =>
          prev.map((carousel) => ({
            ...carousel,
            movies: carousel.movies.map((movie) =>
              movie.id === movieId ? { ...movie, isInWatchlist: !movie.isInWatchlist } : movie,
            ),
          })),
        )
      }
    } catch (error) {
      console.error("Error updating watchlist:", error)
    }
  }

  const isMovieHovered = (carouselIndex: number, movieId: number) => {
    return hoveredMovie?.carouselIndex === carouselIndex && hoveredMovie?.movieId === movieId
  }

  return (
    <>
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {carousels.map((carousel, carouselIndex) => (
            <div key={carousel.title} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{carousel.title}</h2>
                {carousel.title === "AI Recommendations" && (
                  <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">Powered by AI</Badge>
                )}
              </div>

              {carousel.loading ? (
                <div className="flex space-x-4 overflow-hidden">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex-shrink-0 w-64 h-36 bg-gray-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : carousel.error ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <p className="text-red-400 mb-2">Failed to load {carousel.title.toLowerCase()}</p>
                  <p className="text-gray-400 text-sm mb-4">{carousel.error}</p>
                  <Button
                    onClick={() => fetchCarouselData(carousel.endpoint, carouselIndex)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400"
                  >
                    Try Again
                  </Button>
                </div>
              ) : carousel.movies.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No movies found in {carousel.title.toLowerCase()}</p>
                </div>
              ) : (
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => scroll(carouselIndex, "left")}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>

                  <div
                    ref={(el) => (scrollRefs.current[carouselIndex] = el)}
                    className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {carousel.movies.map((movie) => (
                      <div
                        key={movie.id}
                        className="flex-shrink-0 w-64 group/movie cursor-pointer"
                        onMouseEnter={() => handleMovieHover(carouselIndex, movie.id)}
                        onMouseLeave={handleMovieLeave}
                        onClick={() => handleMovieClick(movie.id)}
                      >
                        <div
                          className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                            isMovieHovered(carouselIndex, movie.id) ? "scale-105 shadow-2xl z-20" : "hover:scale-102"
                          }`}
                        >
                          <img
                            src={movie.poster || "/placeholder.svg"}
                            alt={movie.title}
                            className="w-full h-36 object-cover"
                          />

                          {/* Hover Overlay */}
                          {isMovieHovered(carouselIndex, movie.id) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{movie.title}</h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-gray-300 text-xs">{movie.year}</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-white text-xs">{movie.rating}</span>
                                  </div>
                                  {movie.confidence && (
                                    <Badge
                                      className={`text-xs ${
                                        movie.confidence >= 80
                                          ? "bg-green-500"
                                          : movie.confidence >= 60
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                      }`}
                                    >
                                      {movie.confidence}%
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" className="bg-white text-black hover:bg-gray-200 h-7 px-3">
                                    <Play className="w-3 h-3 mr-1" />
                                    Play
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-500 text-white hover:bg-white/10 h-7 px-2 bg-transparent"
                                    onClick={(e) => handleAddToWatchlist(movie.id, e)}
                                  >
                                    {movie.isInWatchlist ? (
                                      <Heart className="w-3 h-3 fill-current text-red-500" />
                                    ) : (
                                      <Plus className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>

                              {/* Video Controls (if trailer available) */}
                              {movie.trailer && (
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 bg-black/50">
                                    <Volume2 className="w-3 h-3 text-white" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Progress Bar for Watchlist */}
                          {movie.watchProgress && movie.watchProgress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                              <div
                                className="h-full bg-teal-500 transition-all duration-300"
                                style={{ width: `${movie.watchProgress}%` }}
                              />
                            </div>
                          )}

                          {/* Confidence Badge for AI Recommendations */}
                          {movie.confidence && !isMovieHovered(carouselIndex, movie.id) && (
                            <Badge
                              className={`absolute top-2 right-2 text-xs ${
                                movie.confidence >= 80
                                  ? "bg-green-500"
                                  : movie.confidence >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            >
                              {movie.confidence}%
                            </Badge>
                          )}
                        </div>

                        {/* Movie Info Below */}
                        <div className="mt-2 px-1">
                          <h3 className="text-white font-medium text-sm line-clamp-1">{movie.title}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-400 text-xs">{movie.year}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-gray-300 text-xs">{movie.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => scroll(carouselIndex, "right")}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <MovieDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        movieId={selectedMovieId}
      />
    </>
  )
}
