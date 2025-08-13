"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Volume2, VolumeX, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MovieDetailModal } from "./movie-detail-modal"

interface Movie {
  id: number
  title: string
  poster: string
  backdrop?: string
  year: number
  genre: string[]
  rating: number
  duration?: number
  synopsis?: string
  aiConfidence?: number
}

interface CarouselData {
  title: string
  movies: Movie[]
  loading: boolean
  error: string | null
}

export function MovieCarousels() {
  const [carousels, setCarousels] = useState<Record<string, CarouselData>>({
    trending: { title: "Trending Now", movies: [], loading: true, error: null },
    popular: { title: "Popular Movies", movies: [], loading: true, error: null },
    newReleases: { title: "New Releases", movies: [], loading: true, error: null },
    topRated: { title: "Top Rated", movies: [], loading: true, error: null },
    recommendations: { title: "AI Recommendations", movies: [], loading: true, error: null },
    watchlist: { title: "Your Watchlist", movies: [], loading: true, error: null },
  })

  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [mutedMovies, setMutedMovies] = useState<Set<number>>(new Set())
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)

  useEffect(() => {
    const fetchCarouselData = async (endpoint: string, key: string) => {
      try {
        const response = await fetch(`/api/movies/${endpoint}`)
        const data = await response.json()

        if (data.success) {
          setCarousels((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              movies: data.movies,
              loading: false,
            },
          }))
        } else {
          throw new Error(data.error || "Failed to fetch movies")
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error)
        setCarousels((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load movies",
          },
        }))
      }
    }

    // Fetch all carousel data
    fetchCarouselData("trending", "trending")
    fetchCarouselData("popular", "popular")
    fetchCarouselData("new-releases", "newReleases")
    fetchCarouselData("top-rated", "topRated")

    // Fetch recommendations and watchlist
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCarousels((prev) => ({
            ...prev,
            recommendations: {
              ...prev.recommendations,
              movies: data.movies,
              loading: false,
            },
          }))
        }
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error)
        setCarousels((prev) => ({
          ...prev,
          recommendations: {
            ...prev.recommendations,
            loading: false,
            error: "Failed to load recommendations",
          },
        }))
      })

    fetch("/api/watchlist/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCarousels((prev) => ({
            ...prev,
            watchlist: {
              ...prev.watchlist,
              movies: data.movies,
              loading: false,
            },
          }))
        }
      })
      .catch((error) => {
        console.error("Error fetching watchlist:", error)
        setCarousels((prev) => ({
          ...prev,
          watchlist: {
            ...prev.watchlist,
            loading: false,
            error: "Failed to load watchlist",
          },
        }))
      })
  }, [])

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId)
    setShowMovieModal(true)
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
        console.log("Added to watchlist:", movieId)
        // Optionally refresh watchlist carousel
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error)
    }
  }

  const toggleMute = (movieId: number, event: React.MouseEvent) => {
    event.stopPropagation()
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

  const scrollCarousel = (carouselKey: string, direction: "left" | "right") => {
    const carousel = document.getElementById(`carousel-${carouselKey}`)
    if (carousel) {
      const scrollAmount = 300
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const renderCarousel = (key: string, data: CarouselData) => (
    <div key={key} className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">{data.title}</h2>

      {data.loading ? (
        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data.error ? (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">
          <p>
            Error loading {data.title.toLowerCase()}: {data.error}
          </p>
        </div>
      ) : (
        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scrollCarousel(key, "left")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div
            id={`carousel-${key}`}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {data.movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-48 cursor-pointer group/movie"
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="relative overflow-hidden rounded-lg transition-transform group-hover/movie:scale-105">
                  <img
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/movie:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                        <Play className="w-4 h-4 mr-1" />
                        Play
                      </Button>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                          onClick={(e) => handleAddToWatchlist(movie.id, e)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                          onClick={(e) => toggleMute(movie.id, e)}
                        >
                          {mutedMovies.has(movie.id) ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* AI Confidence Badge for Recommendations */}
                  {key === "recommendations" && movie.aiConfidence && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        className={`text-xs ${
                          movie.aiConfidence >= 80
                            ? "bg-green-500"
                            : movie.aiConfidence >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        } text-white`}
                      >
                        {movie.aiConfidence}%
                      </Badge>
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-black/70 text-white text-xs">
                      <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                      {movie.rating}
                    </Badge>
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="text-white font-medium text-sm line-clamp-2">{movie.title}</h3>
                  <p className="text-gray-400 text-xs">{movie.year}</p>
                  {movie.genre && <p className="text-gray-500 text-xs">{movie.genre.slice(0, 2).join(", ")}</p>}
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scrollCarousel(key, "right")}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <div className="space-y-8">{Object.entries(carousels).map(([key, data]) => renderCarousel(key, data))}</div>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        isOpen={showMovieModal}
        onClose={() => {
          setShowMovieModal(false)
          setSelectedMovieId(null)
        }}
        movieId={selectedMovieId}
      />
    </>
  )
}
