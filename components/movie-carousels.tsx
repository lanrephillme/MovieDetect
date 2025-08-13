"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Plus, Check, Star } from "lucide-react"

interface Movie {
  id: number
  title: string
  poster: string
  rating: number
  year: number
  genre: string
  trailer?: string
  description?: string
  confidence?: number
  matchReason?: string
  inWatchlist?: boolean
  watched?: boolean
}

interface CarouselData {
  title: string
  movies: Movie[]
}

export function MovieCarousels() {
  const [carousels, setCarousels] = useState<CarouselData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [playingTrailer, setPlayingTrailer] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        setLoading(true)
        const endpoints = [
          { url: "/api/movies/trending", title: "Trending Movies" },
          { url: "/api/movies/popular", title: "Popular This Week" },
          { url: "/api/movies/new-releases", title: "New Releases" },
          { url: "/api/recommendations", title: "AI (MD) Recommended For You" },
          { url: "/api/movies/top-rated", title: "Top Rated" },
          { url: "/api/watchlist/user", title: "Your Watchlist" },
        ]

        const carouselPromises = endpoints.map(async (endpoint) => {
          try {
            const response = await fetch(endpoint.url)
            if (!response.ok) {
              throw new Error(`Failed to fetch ${endpoint.title}`)
            }
            const data = await response.json()
            return {
              title: endpoint.title,
              movies: data.movies || [],
            }
          } catch (err) {
            console.error(`Error fetching ${endpoint.title}:`, err)
            return {
              title: endpoint.title,
              movies: [],
            }
          }
        })

        const results = await Promise.all(carouselPromises)
        setCarousels(results)
      } catch (err) {
        setError("Failed to load movie carousels")
        console.error("Error fetching carousels:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCarousels()
  }, [])

  const scrollCarousel = (direction: "left" | "right", carouselIndex: number) => {
    const carousel = document.getElementById(`carousel-${carouselIndex}`)
    if (carousel) {
      const scrollAmount = 320
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

  const togglePlayPause = (movieId: number) => {
    if (playingTrailer === movieId) {
      setPlayingTrailer(null)
    } else {
      setPlayingTrailer(movieId)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleWatchlist = async (movieId: number) => {
    // TODO: Implement actual watchlist API call
    console.log("Toggle watchlist for movie:", movieId)
  }

  if (loading) {
    return (
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-gray-800 rounded w-64 animate-pulse"></div>
                <div className="flex space-x-4 overflow-hidden">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-red-500 text-xl">{error}</div>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-500"
          >
            Retry
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-12">
          {carousels.map((carousel, carouselIndex) => (
            <div key={carouselIndex} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {carousel.title}
                  {carousel.title.includes("AI") && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">AI Powered</Badge>
                  )}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrollCarousel("left", carouselIndex)}
                    className="border-gray-600 text-gray-400 hover:text-white hover:border-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => scrollCarousel("right", carouselIndex)}
                    className="border-gray-600 text-gray-400 hover:text-white hover:border-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                id={`carousel-${carouselIndex}`}
                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {carousel.movies.map((movie) => (
                  <Card
                    key={movie.id}
                    className="flex-shrink-0 w-48 bg-gray-900 border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    onMouseEnter={() => handleMovieHover(movie.id)}
                    onMouseLeave={() => handleMovieHover(null)}
                  >
                    <CardContent className="p-0 relative">
                      <div className="relative">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-72 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Trailer overlay */}
                        {hoveredMovie === movie.id && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  togglePlayPause(movie.id)
                                }}
                                className="bg-white/20 hover:bg-white/30 text-white border-0"
                              >
                                {playingTrailer === movie.id ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleMute()
                                }}
                                className="bg-white/20 hover:bg-white/30 text-white border-0"
                              >
                                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Watchlist button */}
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWatchlist(movie.id)
                          }}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {movie.inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </Button>

                        {/* AI confidence badge */}
                        {movie.confidence && (
                          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {movie.confidence}% Match
                          </Badge>
                        )}

                        {/* Watched indicator */}
                        {movie.watched && (
                          <div className="absolute bottom-2 left-2 w-full bg-teal-500 h-1 rounded-full"></div>
                        )}
                      </div>

                      <div className="p-3 space-y-2">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight">{movie.title}</h3>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-gray-400">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{movie.rating}</span>
                          </div>
                          <span className="text-gray-400">{movie.year}</span>
                        </div>
                        <div className="text-xs text-gray-500">{movie.genre}</div>

                        {/* AI match reason */}
                        {movie.matchReason && (
                          <div className="text-xs text-purple-400 italic">"{movie.matchReason}"</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
