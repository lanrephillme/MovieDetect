"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Volume2, VolumeX, Star, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MovieDetailModal } from "./movie-detail-modal"

interface Movie {
  id: number
  title: string
  poster: string
  backdrop?: string
  year: number
  genre: string | string[]
  rating: number
  duration?: number | string
  synopsis?: string
  description?: string
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
    newMovies: { title: "New Movies", movies: [], loading: true, error: null },
    recommendations: { title: "AI Recommended", movies: [], loading: true, error: null },
    comingSoon: { title: "Coming Soon", movies: [], loading: true, error: null },
    watchlist: { title: "My Watchlist", movies: [], loading: true, error: null },
    mostWatched: { title: "Most Watched", movies: [], loading: true, error: null },
  })

  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [mutedMovies, setMutedMovies] = useState<Set<number>>(new Set())
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)
  const [previewVideos, setPreviewVideos] = useState<Record<number, HTMLVideoElement>>({})

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const generateMockMovies = (count: number, startId = 1): Movie[] => {
      const mockMovies = [
        {
          id: startId,
          title: "Blade Runner 2049",
          poster: "/blade-runner-2049-poster.png",
          backdrop: "/blade-runner-2049-cityscape.png",
          year: 2017,
          genre: ["Sci-Fi", "Thriller"],
          rating: 8.2,
          synopsis:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
          previewUrl: "/previews/blade-runner-preview.mp4",
        },
        {
          id: startId + 1,
          title: "The Matrix",
          poster: "/matrix-movie-poster.png",
          backdrop: "/matrix-digital-rain.png",
          year: 1999,
          genre: ["Action", "Sci-Fi"],
          rating: 8.7,
          synopsis: "A computer programmer is led to fight an underground war against powerful computers.",
          previewUrl: "/previews/matrix-preview.mp4",
        },
        {
          id: startId + 2,
          title: "Interstellar",
          poster: "/interstellar-inspired-poster.png",
          backdrop: "/interstellar-space.png",
          year: 2014,
          genre: ["Sci-Fi", "Drama"],
          rating: 8.6,
          synopsis: "A team of explorers travel through a wormhole in space.",
          previewUrl: "/previews/interstellar-preview.mp4",
        },
        {
          id: startId + 3,
          title: "Inception",
          poster: "/inception-movie-poster.png",
          year: 2010,
          genre: ["Action", "Sci-Fi"],
          rating: 8.8,
          synopsis: "A thief who steals corporate secrets through dream-sharing technology.",
          previewUrl: "/previews/inception-preview.mp4",
        },
        {
          id: startId + 4,
          title: "The Dark Knight",
          poster: "/dark-knight-poster.png",
          year: 2008,
          genre: ["Action", "Crime"],
          rating: 9.0,
          synopsis: "Batman must accept one of the greatest psychological tests.",
          previewUrl: "/previews/dark-knight-preview.mp4",
        },
        {
          id: startId + 5,
          title: "Dune: Part Two",
          poster: "/dune-part-two-poster.png",
          year: 2024,
          genre: ["Sci-Fi", "Adventure"],
          rating: 8.5,
          synopsis: "Paul Atreides unites with Chani and the Fremen.",
          previewUrl: "/previews/dune-preview.mp4",
        },
        {
          id: startId + 6,
          title: "Everything Everywhere All at Once",
          poster: "/eeaao-poster.png",
          year: 2022,
          genre: ["Sci-Fi", "Comedy"],
          rating: 7.8,
          synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure.",
          previewUrl: "/previews/eeaao-preview.mp4",
        },
        {
          id: startId + 7,
          title: "Oppenheimer",
          poster: "/images/posters/oppenheimer-poster.png",
          year: 2023,
          genre: ["Biography", "Drama"],
          rating: 8.3,
          synopsis: "The story of American scientist J. Robert Oppenheimer.",
          previewUrl: "/previews/oppenheimer-preview.mp4",
        },
        {
          id: startId + 8,
          title: "Avatar: The Way of Water",
          poster: "/way-of-water-inspired-poster.png",
          year: 2022,
          genre: ["Sci-Fi", "Adventure"],
          rating: 7.6,
          synopsis: "Jake Sully lives with his newfound family formed on Pandora.",
          previewUrl: "/previews/avatar-preview.mp4",
        },
        {
          id: startId + 9,
          title: "Spider-Man: Across the Spider-Verse",
          poster: "/spider-man-across-spider-verse-inspired-poster.png",
          year: 2023,
          genre: ["Animation", "Action"],
          rating: 8.7,
          synopsis: "Miles Morales catapults across the Multiverse.",
          previewUrl: "/previews/spiderverse-preview.mp4",
        },
      ]

      return mockMovies.slice(0, count)
    }

    // Load all carousels with 10 movies each
    const carouselKeys = Object.keys(carousels)
    carouselKeys.forEach((key, index) => {
      setTimeout(() => {
        const movies = generateMockMovies(10, index * 100 + 1).map((movie) => ({
          ...movie,
          aiConfidence: key === "recommendations" ? Math.floor(Math.random() * 40) + 60 : undefined,
        }))

        setCarousels((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            movies,
            loading: false,
          },
        }))
      }, index * 200) // Stagger loading for smooth effect
    })
  }, [])

  const handleMovieHover = (movieId: number) => {
    // Stop any currently playing preview
    Object.values(previewVideos).forEach((video) => {
      if (video && !video.paused) {
        video.pause()
        video.currentTime = 0
      }
    })

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMovie(movieId)

      // Start preview video after 1s delay
      previewTimeoutRef.current = setTimeout(() => {
        const video = previewVideos[movieId]
        if (video) {
          video.currentTime = 0
          video.play().catch((error) => {
            console.log("Video preview failed:", error)
          })
        }
      }, 1000)
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
      if (video) {
        video.pause()
        video.currentTime = 0
      }
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

      video.onerror = () => {
        console.log(`Video failed to load for movie ${movie.id}`)
      }

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
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 h-[450px] bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data.movies.length === 0 ? (
        <div className="text-gray-400 p-4 mx-6">
          <p>No movies found in {data.title.toLowerCase()}.</p>
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
              createPreviewVideo(movie)
              const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre || "Unknown"]

              return (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-80 cursor-pointer group/movie relative"
                  onMouseEnter={() => handleMovieHover(movie.id)}
                  onMouseLeave={handleMovieLeave}
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <div
                    className={`relative overflow-hidden rounded-lg transition-all duration-500 ease-out ${
                      hoveredMovie === movie.id ? "scale-110 z-20 shadow-2xl" : "scale-100"
                    }`}
                  >
                    {/* Static Poster */}
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className={`w-full h-[450px] object-cover transition-opacity duration-500 ${
                        hoveredMovie === movie.id ? "opacity-0" : "opacity-100"
                      }`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
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
                          onError={(e) => {
                            console.log("Video element error")
                            e.currentTarget.style.display = "none"
                          }}
                        >
                          <source src={movie.previewUrl} type="video/mp4" />
                        </video>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                    )}

                    {/* Hover Controls - Apple TV+ Style */}
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

                    {/* Movie Info Overlay - Apple TV+ Style */}
                    {hoveredMovie === movie.id && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                        <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-gray-300 text-sm">{movie.year}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm font-medium">{movie.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {genres.slice(0, 2).map((g) => (
                            <Badge key={g} variant="outline" className="border-gray-400 text-gray-300 text-xs">
                              {g}
                            </Badge>
                          ))}
                        </div>
                        {movie.synopsis && <p className="text-gray-300 text-sm line-clamp-2 mb-3">{movie.synopsis}</p>}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            className="bg-white text-black hover:bg-gray-200 text-xs px-4"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMovieClick(movie.id)
                            }}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Play
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm text-xs px-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMovieClick(movie.id)
                            }}
                          >
                            <Info className="w-3 h-3 mr-1" />
                            Info
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* AI Confidence Badge */}
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
                          {movie.aiConfidence}% AI Match
                        </Badge>
                      </div>
                    )}

                    {/* Rating Badge (when not hovered) */}
                    {hoveredMovie !== movie.id && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-black/70 text-white text-xs">
                          <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                          {movie.rating.toFixed(1)}
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
                        {genres.length > 0 && <p className="text-gray-500 text-xs">{genres.slice(0, 2).join(", ")}</p>}
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
      <div className="bg-transparent pt-0 pb-12">
        <div className="space-y-8">{Object.entries(carousels).map(([key, data]) => renderCarousel(key, data))}</div>
      </div>

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
