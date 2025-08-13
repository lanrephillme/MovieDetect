"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Volume2, VolumeX, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Movie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  release_date: string
  vote_average: number
  genre_ids: number[]
  trailer_url?: string
  ai_confidence?: number
  recommendation_reason?: string
  added_date?: string
  watched?: boolean
}

interface CarouselData {
  success: boolean
  movies: Movie[]
  message: string
  total_count?: number
  watched_count?: number
  unwatched_count?: number
  algorithm_version?: string
  personalization_score?: number
}

export function MovieCarousels() {
  const [carousels, setCarousels] = useState<{ [key: string]: Movie[] }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [mutedMovies, setMutedMovies] = useState<{ [key: number]: boolean }>({})

  const carouselCategories = [
    { key: "trending", title: "Trending Movies", endpoint: "/api/movies/trending" },
    { key: "popular", title: "Popular This Week", endpoint: "/api/movies/popular" },
    { key: "new-releases", title: "New Releases", endpoint: "/api/movies/new-releases" },
    { key: "ai-recommended", title: "AI (MD) Recommended", endpoint: "/api/recommendations" },
    { key: "top-rated", title: "Top Rated", endpoint: "/api/movies/top-rated" },
    { key: "watchlist", title: "Watchlist", endpoint: "/api/watchlist/user" },
  ]

  useEffect(() => {
    fetchAllCategories()
  }, [])

  const fetchAllCategories = async () => {
    setLoading(true)
    setError(null)

    try {
      const promises = carouselCategories.map(async (category) => {
        try {
          const response = await fetch(category.endpoint)

          // Check if response is ok
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          // Check content type
          const contentType = response.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON")
          }

          const data: CarouselData = await response.json()

          if (!data.success || !Array.isArray(data.movies)) {
            throw new Error(data.message || "Invalid response format")
          }

          return { key: category.key, movies: data.movies }
        } catch (error) {
          console.error(`Error fetching ${category.title}:`, error)
          return { key: category.key, movies: [] }
        }
      })

      const results = await Promise.all(promises)
      const carouselData: { [key: string]: Movie[] } = {}

      results.forEach(({ key, movies }) => {
        carouselData[key] = movies
      })

      setCarousels(carouselData)
    } catch (error) {
      console.error("Error fetching carousel data:", error)
      setError("Failed to load movie data")
    } finally {
      setLoading(false)
    }
  }

  const scrollCarousel = (category: string, direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${category}`)
    if (container) {
      const scrollAmount = 320 // Width of one movie card plus gap
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleAddToWatchlist = async (movie: Movie) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId: movie.id }),
      })

      if (response.ok) {
        console.log(`Added "${movie.title}" to watchlist`)
        // TODO: Show success toast/notification
      } else {
        console.error("Failed to add to watchlist")
        // TODO: Show error toast/notification
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error)
    }
  }

  const toggleMute = (movieId: number) => {
    setMutedMovies((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }))
  }

  if (loading) {
    return (
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6">
          {carouselCategories.map((category) => (
            <div key={category.key} className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">{category.title}</h2>
              <div className="flex space-x-4 overflow-hidden">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button onClick={fetchAllCategories} className="bg-teal-600 hover:bg-teal-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        {carouselCategories.map((category) => {
          const movies = carousels[category.key] || []

          if (movies.length === 0) {
            return (
              <div key={category.key} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">{category.title}</h2>
                <p className="text-gray-400">No movies available</p>
              </div>
            )
          }

          return (
            <div key={category.key} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollCarousel(category.key, "left")}
                    className="bg-black/50 border-gray-600 text-white hover:bg-gray-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollCarousel(category.key, "right")}
                    className="bg-black/50 border-gray-600 text-white hover:bg-gray-800"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div
                id={`carousel-${category.key}`}
                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {movies.map((movie) => (
                  <Card
                    key={movie.id}
                    className="flex-shrink-0 w-48 bg-gray-900 border-gray-700 hover:border-teal-500 transition-all duration-300 cursor-pointer group"
                    onMouseEnter={() => setHoveredMovie(movie.id)}
                    onMouseLeave={() => setHoveredMovie(null)}
                  >
                    <CardContent className="p-0 relative">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={movie.poster_path || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Trailer Preview Overlay */}
                        {hoveredMovie === movie.id && movie.trailer_url && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <div className="relative w-full h-full">
                              {/* Simulated video preview */}
                              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <div className="text-center">
                                  <Play className="w-12 h-12 text-white mb-2 mx-auto" />
                                  <p className="text-white text-sm">Trailer Preview</p>
                                </div>
                              </div>

                              {/* Video Controls */}
                              <div className="absolute bottom-2 right-2 flex space-x-2">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="w-8 h-8 bg-black/50 hover:bg-black/70"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleMute(movie.id)
                                  }}
                                >
                                  {mutedMovies[movie.id] ? (
                                    <VolumeX className="w-4 h-4" />
                                  ) : (
                                    <Volume2 className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  className="w-8 h-8 bg-black/50 hover:bg-black/70"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Pause className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Hover Actions */}
                        {hoveredMovie === movie.id && (
                          <div className="absolute top-2 right-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8 bg-black/50 hover:bg-black/70"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToWatchlist(movie)
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {/* AI Confidence Badge (for AI recommendations) */}
                        {category.key === "ai-recommended" && movie.ai_confidence && (
                          <div className="absolute top-2 left-2">
                            <div className="bg-teal-600 text-white text-xs px-2 py-1 rounded">
                              {Math.round(movie.ai_confidence * 100)}% match
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{new Date(movie.release_date).getFullYear()}</span>
                          <div className="flex items-center space-x-1">
                            <span>⭐</span>
                            <span>{movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* AI Recommendation Reason */}
                        {category.key === "ai-recommended" && movie.recommendation_reason && (
                          <p className="text-xs text-teal-400 mt-2 line-clamp-2">{movie.recommendation_reason}</p>
                        )}

                        {/* Watchlist Status */}
                        {category.key === "watchlist" && movie.watched !== undefined && (
                          <div className="mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                movie.watched ? "bg-green-600 text-white" : "bg-yellow-600 text-white"
                              }`}
                            >
                              {movie.watched ? "Watched" : "To Watch"}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
