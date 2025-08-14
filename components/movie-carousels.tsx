"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
  trailerUrl?: string
  previewUrl?: string
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
  const [previewVideos, setPreviewVideos] = useState<Record<number, HTMLVideoElement>>({})

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchCarouselData = async (endpoint: string, key: string) => {
      try {
        const response = await fetch(`/api/movies/${endpoint}`)
        const data = await response.json()

        if (data.success) {
          // Add mock preview URLs for demo
          const moviesWithPreviews = data.data.map((movie: Movie) => ({
            ...movie,
            previewUrl: `/previews/preview-${movie.id}.mp4`, // Mock preview URLs
            trailerUrl: `https://www.youtube.com/watch?v=trailer-${movie.id}`,
          }))

          setCarousels((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              movies: moviesWithPreviews,
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
              movies: data.movies.map((movie: Movie) => ({
                ...movie,
                previewUrl: `/previews/preview-${movie.id}.mp4`,
                trailerUrl: `https://www.youtube.com/watch?v=trailer-${movie.id}`,
              })),
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
              movies: data.movies.map((movie: Movie) => ({
                ...movie,
                previewUrl: `/previews/preview-${movie.id}.mp4`,
                trailerUrl: `https://www.youtube.com/watch?v=trailer-${movie.id}`,
              })),
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

  const handleMovieHover = (movieId: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMovie(movieId)

      // Start preview video after 1.5s delay
      previewTimeoutRef.current = setTimeout(() => {
        const video = previewVideos[movieId]
        if (video) {
          video.currentTime = 0
          video.play().catch(console.error)
        }
      }, 1500)
    }, 200)
  }

  const handleMovieLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
    }

    // Stop all preview videos
    Object.values(previewVideos).forEach((video) => {
      video.pause()
      video.currentTime = 0
    })

    setHoveredMovie(null)
  }

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

    const video = previewVideos[movieId]
    if (video) {
      video.muted = !video.muted
    }
  }

  const scrollCarousel = (carouselKey: string, direction: "left" | "right") => {
    const carousel = document.getElementById(`carousel-${carouselKey}`)
    if (carousel) {
      const scrollAmount = 400
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const createPreviewVideo = (movie: Movie) => {
    if (!previewVideos[movie.id]) {
      const video = document.createElement("video")
      video.src = movie.previewUrl || ""
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.preload = "metadata"

      setPreviewVideos((prev) => ({
        ...prev,
        [movie.id]: video,
      }))
    }
  }

  const renderCarousel = (key: string, data: CarouselData) => (
    <div key={key} className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-8 px-6">{data.title}</h2>

      {data.loading ? (
        <div className="flex space-x-6 px-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 h-96 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data.error ? (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg mx-6">
          <p>
            Error loading {data.title.toLowerCase()}: {data.error}
          </p>
        </div>
      ) : (
        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
            onClick={() => scrollCarousel(key, "left")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div
            id={`carousel-${key}`}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {data.movies.map((movie) => {
              // Create preview video element
              createPreviewVideo(movie)

              return (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-72 cursor-pointer group/movie relative"
                  onMouseEnter={() => handleMovieHover(movie.id)}
                  onMouseLeave={handleMovieLeave}
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div
                    className={`relative overflow-hidden rounded-lg transition-all duration-500 ease-out ${
                      hoveredMovie === movie.id ? "scale-110 z-20" : "scale-100"
                    }`}
                  >
                    {/* Static Poster */}
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className={`w-full h-96 object-cover transition-opacity duration-500 ${
                        hoveredMovie === movie.id ? "opacity-0" : "opacity-100"
                      }`}
                    />

                    {/* Preview Video */}
                    {hoveredMovie === movie.id && (
                      <div className="absolute inset-0">
                        <video
                          ref={(el) => {
                            if (el && !previewVideos[movie.id]) {
                              setPreviewVideos((prev) => ({
                                ...prev,
                                [movie.id]: el,
                              }))
                            }
                          }}
                          className="w-full h-full object-cover"
                          muted={!mutedMovies.has(movie.id)}
                          loop
                          playsInline
                          poster={movie.backdrop || movie.poster}
                        >
                          <source src={movie.previewUrl} type="video/mp4" />
                        </video>

                        {/* Video Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                    )}

                    {/* Hover Controls */}
                    {hoveredMovie === movie.id && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/movie:opacity-100 transition-all duration-300">
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            className="bg-white text-black hover:bg-gray-200 rounded-full w-12 h-12 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMovieClick(movie.id)
                            }}
                          >
                            <Play className="w-5 h-5 ml-0.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm rounded-full w-12 h-12 p-0"
                            onClick={(e) => handleAddToWatchlist(movie.id, e)}
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm rounded-full w-12 h-12 p-0"
                            onClick={(e) => toggleMute(movie.id, e)}
                          >
                            {mutedMovies.has(movie.id) ? (
                              <VolumeX className="w-5 h-5" />
                            ) : (
                              <Volume2 className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Movie Info Overlay */}
                    {hoveredMovie === movie.id && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-gray-300 text-sm">{movie.year}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm font-medium">{movie.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {movie.genre.slice(0, 2).map((g) => (
                            <Badge key={g} variant="outline" className="border-gray-400 text-gray-300 text-xs">
                              {g}
                            </Badge>
                          ))}
                        </div>
                        {movie.synopsis && <p className="text-gray-300 text-sm line-clamp-2">{movie.synopsis}</p>}
                      </div>
                    )}

                    {/* AI Confidence Badge for Recommendations */}
                    {key === "recommendations" && movie.aiConfidence && (
                      <div className="absolute top-3 right-3">
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

                    {/* Rating Badge (when not hovered) */}
                    {hoveredMovie !== movie.id && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-black/70 text-white text-xs">
                          <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                          {movie.rating}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Movie Title (when not hovered) */}
                  {hoveredMovie !== movie.id && (
                    <div className="mt-3">
                      <h3 className="text-white font-medium text-base line-clamp-2">{movie.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-400 text-sm">{movie.year}</p>
                        {movie.genre && <p className="text-gray-500 text-xs">{movie.genre.slice(0, 2).join(", ")}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
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
      <div className="space-y-8 py-12">{Object.entries(carousels).map(([key, data]) => renderCarousel(key, data))}</div>

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
