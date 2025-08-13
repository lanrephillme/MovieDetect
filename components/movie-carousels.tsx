"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Pause, Plus, VolumeX, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  poster: string
  backdrop?: string
  trailer?: string
  genre?: string[]
}

interface MovieCategory {
  title: string
  endpoint: string
  movies: Movie[]
}

export function MovieCarousels() {
  const [categories, setCategories] = useState<MovieCategory[]>([])
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [playingMovies, setPlayingMovies] = useState<Set<number>>(new Set())
  const [mutedMovies, setMutedMovies] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  // Initialize categories with API endpoints
  const categoryConfig = [
    { title: "Trending Movies", endpoint: "/api/movies/trending" },
    { title: "Popular This Week", endpoint: "/api/movies/popular" },
    { title: "New Releases", endpoint: "/api/movies/new-releases" },
    { title: "AI (MD) Recommended", endpoint: "/api/recommendations" },
    { title: "Top Rated", endpoint: "/api/movies/top-rated" },
    { title: "Watchlist", endpoint: "/api/watchlist/user" },
  ]

  useEffect(() => {
    fetchAllCategories()
  }, [])

  const fetchAllCategories = async () => {
    try {
      setLoading(true)
      const categoryPromises = categoryConfig.map(async (config) => {
        try {
          const response = await fetch(config.endpoint)

          // Check if response is ok and content-type is JSON
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const contentType = response.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Response is not JSON")
          }

          const data = await response.json()
          return {
            title: config.title,
            endpoint: config.endpoint,
            movies: data.movies || [],
          }
        } catch (error) {
          console.error(`Error fetching ${config.title}:`, error)
          // Return empty movies array for failed requests
          return {
            title: config.title,
            endpoint: config.endpoint,
            movies: [],
          }
        }
      })

      const results = await Promise.all(categoryPromises)
      setCategories(results)
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Set empty categories on complete failure
      setCategories(
        categoryConfig.map((config) => ({
          title: config.title,
          endpoint: config.endpoint,
          movies: [],
        })),
      )
    } finally {
      setLoading(false)
    }
  }

  const scrollCarousel = (direction: "left" | "right", categoryIndex: number) => {
    const carousel = document.getElementById(`carousel-${categoryIndex}`)
    if (carousel) {
      const scrollAmount = 400
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const togglePlay = (movieId: number) => {
    setPlayingMovies((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(movieId)) {
        newSet.delete(movieId)
      } else {
        newSet.add(movieId)
        // Auto-mute when starting to play
        setMutedMovies((prev) => new Set([...prev, movieId]))
      }
      return newSet
    })
  }

  const toggleMute = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setMutedMovies((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(movieId)) {
        newSet.delete(movieId)
      } else {
        newSet.add(movieId)
      }
      return newSet
    })
  }

  const handleMovieClick = (movie: Movie) => {
    // TODO: Open Movie Detail Modal
    console.log("Opening movie detail modal for:", movie.title)
    // This will trigger the Movie Detail Modal component
  }

  if (loading) {
    return (
      <div className="py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto space-y-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 bg-gray-800 rounded w-64 animate-pulse" />
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((j) => (
                  <div key={j} className="flex-shrink-0 w-64 h-96 bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6 bg-black">
      <div className="max-w-7xl mx-auto space-y-12">
        {categories.map((category, categoryIndex) => (
          <div key={category.title} className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">{category.title}</h2>

            <div className="relative group">
              {/* Left Arrow */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
                onClick={() => scrollCarousel("left", categoryIndex)}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              {/* Right Arrow */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
                onClick={() => scrollCarousel("right", categoryIndex)}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Movies Carousel */}
              <div
                id={`carousel-${categoryIndex}`}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {category.movies.length > 0 ? (
                  category.movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex-shrink-0 w-64 group/movie cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredMovie(movie.id)
                        // Auto-play trailer on hover after 1 second
                        setTimeout(() => {
                          if (hoveredMovie === movie.id) {
                            setPlayingMovies((prev) => new Set([...prev, movie.id]))
                            setMutedMovies((prev) => new Set([...prev, movie.id]))
                          }
                        }, 1000)
                      }}
                      onMouseLeave={() => {
                        setHoveredMovie(null)
                        // Stop playing when mouse leaves
                        setPlayingMovies((prev) => {
                          const newSet = new Set(prev)
                          newSet.delete(movie.id)
                          return newSet
                        })
                      }}
                      onClick={() => handleMovieClick(movie)}
                    >
                      <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover/movie:scale-105 group-hover/movie:z-20">
                        {/* Video/Image Display */}
                        {playingMovies.has(movie.id) && movie.trailer ? (
                          <video
                            className="w-full h-96 object-cover"
                            autoPlay
                            loop
                            muted={mutedMovies.has(movie.id)}
                            playsInline
                          >
                            <source src={movie.trailer} type="video/mp4" />
                            <img
                              src={movie.poster || "/placeholder.svg"}
                              alt={movie.title}
                              className="w-full h-96 object-cover"
                            />
                          </video>
                        ) : (
                          <img
                            src={movie.poster || "/placeholder.svg"}
                            alt={movie.title}
                            className="w-full h-96 object-cover"
                          />
                        )}

                        <div className="absolute top-2 left-2 w-5 h-5 bg-teal-600 rounded-sm flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">MD</span>
                        </div>

                        {hoveredMovie === movie.id && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300">
                            {/* Trailer Controls */}
                            {playingMovies.has(movie.id) && (
                              <div className="absolute top-4 right-4 flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-500 text-white hover:border-teal-500 hover:text-teal-400 h-8 px-2 bg-black/70 backdrop-blur-sm"
                                  onClick={(e) => toggleMute(movie.id, e)}
                                >
                                  {mutedMovies.has(movie.id) ? (
                                    <VolumeX className="w-3 h-3" />
                                  ) : (
                                    <Volume2 className="w-3 h-3" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-500 text-white hover:border-red-500 hover:text-red-400 h-8 px-2 bg-black/70 backdrop-blur-sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    togglePlay(movie.id)
                                  }}
                                >
                                  <Pause className="w-3 h-3" />
                                </Button>
                              </div>
                            )}

                            <div className="absolute top-8 left-2 text-xs text-white/80 bg-teal-600 px-2 py-1 rounded">
                              {playingMovies.has(movie.id) ? "PLAYING" : "PREVIEW"}
                            </div>

                            <div className="relative z-10 space-y-3">
                              <h3 className="font-bold text-white text-lg">{movie.title}</h3>
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-300 font-medium">{movie.year}</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-400 font-medium">{movie.rating}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-500 text-white hover:border-white hover:text-white hover:shadow-lg hover:shadow-white/20 h-8 px-3 bg-black/70 backdrop-blur-sm transition-all duration-200 text-xs font-medium"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // TODO: Add to watchlist API call
                                    console.log("Adding to watchlist:", movie.title)
                                  }}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  My List
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-shrink-0 w-64 h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400 text-center">{loading ? "Loading..." : "No movies available"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
