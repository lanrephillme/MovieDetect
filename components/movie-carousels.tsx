"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Star, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoviePreviewModal } from "@/components/movie-preview-modal"

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
}

interface CarouselProps {
  title: string
  movies: Movie[]
  apiEndpoint: string
}

function MovieCarousel({ title, movies: initialMovies, apiEndpoint }: CarouselProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [playingTrailers, setPlayingTrailers] = useState<Set<number>>(new Set())
  const [mutedTrailers, setMutedTrailers] = useState<Set<number>>(new Set())

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (initialMovies.length === 0) {
      fetchMovies()
    }
  }, [apiEndpoint])

  const fetchMovies = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(apiEndpoint)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data) {
        setMovies(data.data)
      } else {
        throw new Error(data.error || "Failed to load movies")
      }
    } catch (error) {
      console.error(`Error fetching ${title}:`, error)
      setError(error instanceof Error ? error.message : "Failed to load movies")

      // Fallback to mock data for demo
      const mockMovies: Movie[] = [
        {
          id: Math.random(),
          title: "Blade Runner 2049",
          poster: "/blade-runner-2049-poster.png",
          backdrop: "/blade-runner-2049-cityscape.png",
          rating: 8.0,
          year: 2017,
          genre: ["Sci-Fi", "Thriller"],
          description: "A young blade runner's discovery leads him to track down former blade runner Rick Deckard.",
          confidence: 95,
        },
        {
          id: Math.random(),
          title: "The Matrix",
          poster: "/matrix-movie-poster.png",
          backdrop: "/matrix-digital-rain.png",
          rating: 8.7,
          year: 1999,
          genre: ["Action", "Sci-Fi"],
          description: "A computer programmer is led to fight an underground war against powerful computers.",
          confidence: 92,
        },
        {
          id: Math.random(),
          title: "Inception",
          poster: "/inception-movie-poster.png",
          rating: 8.8,
          year: 2010,
          genre: ["Sci-Fi", "Thriller"],
          description: "A thief who steals corporate secrets through dream-sharing technology.",
          confidence: 89,
        },
        {
          id: Math.random(),
          title: "Interstellar",
          poster: "/interstellar-inspired-poster.png",
          backdrop: "/interstellar-space.png",
          rating: 8.6,
          year: 2014,
          genre: ["Sci-Fi", "Drama"],
          description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
          confidence: 87,
        },
        {
          id: Math.random(),
          title: "The Dark Knight",
          poster: "/dark-knight-poster.png",
          rating: 9.0,
          year: 2008,
          genre: ["Action", "Crime"],
          description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
          confidence: 94,
        },
      ]
      setMovies(mockMovies)
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.8
    const newScrollLeft =
      direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    })

    // Update current index for navigation dots
    const itemWidth = 320 // Approximate width of each movie card
    const newIndex = Math.round(newScrollLeft / itemWidth)
    setCurrentIndex(Math.max(0, Math.min(newIndex, movies.length - 1)))
  }

  const handleMovieHover = (movieId: number, isHovering: boolean) => {
    if (isHovering) {
      setHoveredMovie(movieId)

      // Start trailer after 1 second of hovering
      hoverTimeoutRef.current = setTimeout(() => {
        setPlayingTrailers((prev) => new Set([...prev, movieId]))
        setMutedTrailers((prev) => new Set([...prev, movieId]))
      }, 1000)
    } else {
      setHoveredMovie(null)

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }

      // Stop trailer
      setPlayingTrailers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(movieId)
        return newSet
      })
      setMutedTrailers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(movieId)
        return newSet
      })
    }
  }

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId)
    setIsPreviewOpen(true)
  }

  const toggleMute = (movieId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setMutedTrailers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(movieId)) {
        newSet.delete(movieId)
      } else {
        newSet.add(movieId)
      }
      return newSet
    })
  }

  const addToWatchlist = async (movieId: number, event: React.MouseEvent) => {
    event.stopPropagation()

    try {
      // TODO: Replace with actual API call
      // await fetch("/api/watchlist/add", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ movieId })
      // })

      console.log("Added to watchlist:", movieId)
      // Show success feedback
    } catch (error) {
      console.error("Error adding to watchlist:", error)
    }
  }

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="flex space-x-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-72 h-96 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400 mb-4">Failed to load {title.toLowerCase()}</p>
          <Button
            onClick={fetchMovies}
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400/10 bg-transparent"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => scroll("left")}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => scroll("right")}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-72 group cursor-pointer"
              onMouseEnter={() => handleMovieHover(movie.id, true)}
              onMouseLeave={() => handleMovieHover(movie.id, false)}
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                {/* Movie Poster/Backdrop */}
                <div className="relative h-96">
                  <img
                    src={hoveredMovie === movie.id && movie.backdrop ? movie.backdrop : movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-all duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=384&width=288&query=${encodeURIComponent(movie.title)}`
                    }}
                  />

                  {/* Trailer Video Overlay */}
                  {playingTrailers.has(movie.id) && movie.trailer && (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted={mutedTrailers.has(movie.id)}
                      playsInline
                    >
                      <source src={movie.trailer} type="video/mp4" />
                    </video>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Hover Controls */}
                  {hoveredMovie === movie.id && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          className="bg-white/90 hover:bg-white text-black"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMovieClick(movie.id)
                          }}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
                          onClick={(e) => addToWatchlist(movie.id, e)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        {playingTrailers.has(movie.id) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
                            onClick={(e) => toggleMute(movie.id, e)}
                          >
                            {mutedTrailers.has(movie.id) ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Movie Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-lg group-hover:text-teal-400 transition-colors">
                          {movie.title}
                        </h3>
                        {movie.confidence && (
                          <Badge
                            className={`${
                              movie.confidence >= 80
                                ? "bg-green-500"
                                : movie.confidence >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            } text-white text-xs`}
                          >
                            {movie.confidence}%
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-sm text-gray-300">
                        <span>{movie.year}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{movie.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {movie.genre.slice(0, 2).map((g) => (
                          <Badge
                            key={g}
                            variant="outline"
                            className="text-xs border-gray-500 text-gray-300 bg-black/30 backdrop-blur-sm"
                          >
                            {g}
                          </Badge>
                        ))}
                      </div>

                      {/* Description - only show on hover */}
                      <div
                        className={`transition-all duration-300 ${
                          hoveredMovie === movie.id ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"
                        }`}
                      >
                        <p className="text-gray-300 text-sm line-clamp-3">{movie.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        {movies.length > 5 && (
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: Math.ceil(movies.length / 5) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / 5) === index ? "bg-teal-500" : "bg-gray-600 hover:bg-gray-500"
                }`}
                onClick={() => {
                  const targetIndex = index * 5
                  setCurrentIndex(targetIndex)
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: targetIndex * 320,
                      behavior: "smooth",
                    })
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Movie Preview Modal */}
      <MoviePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} movieId={selectedMovieId} />
    </>
  )
}

export function MovieCarousels() {
  return (
    <div className="space-y-8">
      <MovieCarousel title="Trending Now" movies={[]} apiEndpoint="/api/movies/trending" />

      <MovieCarousel title="Popular Movies" movies={[]} apiEndpoint="/api/movies/popular" />

      <MovieCarousel title="New Releases" movies={[]} apiEndpoint="/api/movies/new-releases" />

      <MovieCarousel title="Top Rated" movies={[]} apiEndpoint="/api/movies/top-rated" />

      <MovieCarousel title="AI Recommendations" movies={[]} apiEndpoint="/api/recommendations" />

      <MovieCarousel title="Your Watchlist" movies={[]} apiEndpoint="/api/watchlist/user" />
    </div>
  )
}
