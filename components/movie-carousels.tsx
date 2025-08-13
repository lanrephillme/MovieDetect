"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Volume2, VolumeX, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

interface MovieCardProps {
  movie: Movie
  onAddToWatchlist: (movieId: number) => void
}

function MovieCard({ movie, onAddToWatchlist }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsPlaying(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPlaying(false)
    setIsMuted(true)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(!isPlaying)
  }

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToWatchlist(movie.id)
  }

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
        <img
          src={movie.poster_path || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.3 : 1 }}
        />

        {/* Trailer Preview Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/50">
            {/* Mock video preview - in real implementation, this would be an actual video */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </div>
                <p className="text-sm opacity-75">Trailer Preview</p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-none"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-none"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>

            {/* Add to Watchlist Button */}
            <div className="absolute top-4 right-4">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-none"
                onClick={handleAddToWatchlist}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{movie.title}</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {movie.vote_average.toFixed(1)}
            </Badge>
            <span className="text-gray-300 text-xs">{new Date(movie.release_date).getFullYear()}</span>
          </div>
          {movie.ai_confidence && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs text-teal-400 border-teal-400">
                AI Match: {Math.round(movie.ai_confidence * 100)}%
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CarouselProps {
  title: string
  movies: Movie[]
  onAddToWatchlist: (movieId: number) => void
}

function Carousel({ title, movies, onAddToWatchlist }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320 // Width of movie card + gap
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount)
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="relative group">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-72">
              <MovieCard movie={movie} onAddToWatchlist={onAddToWatchlist} />
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}

export function MovieCarousels() {
  const [movieData, setMovieData] = useState<{
    trending: Movie[]
    popular: Movie[]
    newReleases: Movie[]
    aiRecommended: Movie[]
    topRated: Movie[]
    watchlist: Movie[]
  }>({
    trending: [],
    popular: [],
    newReleases: [],
    aiRecommended: [],
    topRated: [],
    watchlist: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const endpoints = [
        { key: "trending", url: "/api/movies/trending" },
        { key: "popular", url: "/api/movies/popular" },
        { key: "newReleases", url: "/api/movies/new-releases" },
        { key: "aiRecommended", url: "/api/recommendations" },
        { key: "topRated", url: "/api/movies/top-rated" },
        { key: "watchlist", url: "/api/watchlist/user" },
      ]

      const results = await Promise.allSettled(
        endpoints.map(async ({ key, url }) => {
          try {
            const response = await fetch(url)

            // Check if response is ok
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Check content type
            const contentType = response.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
              throw new Error("Response is not JSON")
            }

            const data = await response.json()

            if (!data.success) {
              throw new Error(data.message || "API request failed")
            }

            return { key, movies: data.movies || [] }
          } catch (error) {
            console.error(`Error fetching ${key}:`, error)
            throw error
          }
        }),
      )

      const newMovieData = { ...movieData }

      results.forEach((result, index) => {
        const { key } = endpoints[index]
        if (result.status === "fulfilled") {
          newMovieData[key as keyof typeof movieData] = result.value.movies
        } else {
          console.error(`Failed to fetch ${key}:`, result.reason)
          // Keep existing data or empty array
          newMovieData[key as keyof typeof movieData] = movieData[key as keyof typeof movieData] || []
        }
      })

      setMovieData(newMovieData)
    } catch (error) {
      console.error("Error fetching movie categories:", error)
      setError("Failed to load movies. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCategories()
  }, [])

  const handleAddToWatchlist = async (movieId: number) => {
    try {
      // TODO: Replace with actual API call to add movie to watchlist
      const response = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // TODO: Add Authorization header with JWT token
          // 'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ movieId }),
      })

      const data = await response.json()

      if (data.success) {
        console.log(`Movie ${movieId} added to watchlist`)
        // TODO: Show success toast notification
        // TODO: Update local state to reflect the change
      } else {
        console.error("Failed to add to watchlist:", data.message)
        // TODO: Show error toast notification
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error)
      // TODO: Show error toast notification
    }
  }

  if (loading) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="mb-12">
              <div className="h-8 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
              <div className="flex space-x-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex-shrink-0 w-72">
                    <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
                  </div>
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
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <Button onClick={fetchAllCategories} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <Carousel title="Trending Movies" movies={movieData.trending} onAddToWatchlist={handleAddToWatchlist} />
        <Carousel title="Popular This Week" movies={movieData.popular} onAddToWatchlist={handleAddToWatchlist} />
        <Carousel title="New Releases" movies={movieData.newReleases} onAddToWatchlist={handleAddToWatchlist} />
        <Carousel
          title="AI (MD) Recommended"
          movies={movieData.aiRecommended}
          onAddToWatchlist={handleAddToWatchlist}
        />
        <Carousel title="Top Rated" movies={movieData.topRated} onAddToWatchlist={handleAddToWatchlist} />
        <Carousel title="Watchlist" movies={movieData.watchlist} onAddToWatchlist={handleAddToWatchlist} />
      </div>
    </div>
  )
}
