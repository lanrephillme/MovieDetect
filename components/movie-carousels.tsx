"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Volume2, VolumeX, Star, Clock, Calendar } from "lucide-react"
import { MoviePreviewModal } from "./movie-preview-modal"

interface Movie {
  id: number
  title: string
  poster: string
  backdrop?: string
  year: number
  rating: number
  genre: string
  duration: string
  description: string
  trailer?: string
  confidence?: number
  platforms?: string[]
}

interface CarouselProps {
  title: string
  movies: Movie[]
  onMovieClick: (movie: Movie) => void
}

function MovieCarousel({ title, movies, onMovieClick }: CarouselProps) {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 px-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            className="min-w-[280px] bg-gray-900 border-gray-800 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gray-800"
            onMouseEnter={() => setHoveredMovie(movie.id)}
            onMouseLeave={() => setHoveredMovie(null)}
            onClick={() => onMovieClick(movie)}
          >
            <CardContent className="p-0 relative">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-[400px] object-cover transition-transform duration-300"
                />

                {hoveredMovie === movie.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                        <Play className="w-4 h-4 mr-1" />
                        Play
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Watchlist
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsMuted(!isMuted)
                        }}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {movie.confidence && (
                  <Badge className="absolute top-2 right-2 bg-teal-600 text-white">{movie.confidence}% Match</Badge>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-1">{movie.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-white font-medium">{movie.rating}</span>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {movie.genre}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{movie.description}</p>

                {movie.platforms && (
                  <div className="flex gap-1 flex-wrap">
                    {movie.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function MovieCarousels() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [carouselData, setCarouselData] = useState<{ [key: string]: Movie[] }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const endpoints = [
          { key: "trending", url: "/api/movies/trending" },
          { key: "popular", url: "/api/movies/popular" },
          { key: "newReleases", url: "/api/movies/new-releases" },
          { key: "topRated", url: "/api/movies/top-rated" },
          { key: "recommendations", url: "/api/recommendations" },
          { key: "watchlist", url: "/api/watchlist/user" },
        ]

        const results = await Promise.all(
          endpoints.map(async ({ key, url }) => {
            try {
              const response = await fetch(url)
              if (!response.ok) throw new Error(`Failed to fetch ${key}`)
              const data = await response.json()
              return { key, data: data.movies || [] }
            } catch (error) {
              console.error(`Error fetching ${key}:`, error)
              return { key, data: [] }
            }
          }),
        )

        const newCarouselData: { [key: string]: Movie[] } = {}
        results.forEach(({ key, data }) => {
          newCarouselData[key] = data
        })

        setCarouselData(newCarouselData)
      } catch (error) {
        console.error("Error fetching carousel data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCarouselData()
  }, [])

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  if (loading) {
    return (
      <div className="py-16 bg-black">
        <div className="container mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="mb-8">
              <div className="h-8 bg-gray-800 rounded w-48 mb-4 mx-4 animate-pulse"></div>
              <div className="flex gap-4 overflow-x-auto pb-4 px-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="min-w-[280px] h-[500px] bg-gray-800 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 bg-black">
      <div className="container mx-auto">
        <MovieCarousel title="🔥 Trending Now" movies={carouselData.trending || []} onMovieClick={handleMovieClick} />
        <MovieCarousel title="🌟 Popular Movies" movies={carouselData.popular || []} onMovieClick={handleMovieClick} />
        <MovieCarousel
          title="🆕 New Releases"
          movies={carouselData.newReleases || []}
          onMovieClick={handleMovieClick}
        />
        <MovieCarousel title="⭐ Top Rated" movies={carouselData.topRated || []} onMovieClick={handleMovieClick} />
        <MovieCarousel
          title="🤖 AI Recommendations"
          movies={carouselData.recommendations || []}
          onMovieClick={handleMovieClick}
        />
        <MovieCarousel title="📋 My Watchlist" movies={carouselData.watchlist || []} onMovieClick={handleMovieClick} />
      </div>

      {selectedMovie && (
        <MoviePreviewModal movie={selectedMovie} isOpen={!!selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  )
}
