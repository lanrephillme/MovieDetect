"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Plus, Volume2, VolumeX, Star, Clock } from "lucide-react"
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
  duration?: string
  synopsis?: string
  description?: string
  aiConfidence?: number
  trailerUrl?: string
  previewUrl?: string
  isInWatchlist?: boolean
}

interface CarouselData {
  title: string
  movies: Movie[]
  loading: boolean
  error: string | null
}

function MovieCarousel({
  title,
  movies,
  onMovieClick,
}: { title: string; movies: Movie[]; onMovieClick?: (movie: Movie) => void }) {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState<number | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleMouseEnter = (movieId: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    setHoveredMovie(movieId)

    hoverTimeoutRef.current = setTimeout(() => {
      const video = videoRefs.current[movieId]
      if (video) {
        video.currentTime = 0
        video
          .play()
          .then(() => {
            setIsVideoPlaying(movieId)
          })
          .catch((error) => {
            console.log("Video preview failed:", error)
          })
      }
    }, 1000)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    if (isVideoPlaying !== null) {
      const video = videoRefs.current[isVideoPlaying]
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    }

    setHoveredMovie(null)
    setIsVideoPlaying(null)
  }

  const toggleMute = (movieId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    const video = videoRefs.current[movieId]
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const addToWatchlist = (movie: Movie, event: React.MouseEvent) => {
    event.stopPropagation()
    console.log("Adding to watchlist:", movie.title)
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="relative flex-shrink-0 w-80 group cursor-pointer"
            onMouseEnter={() => handleMouseEnter(movie.id)}
            onMouseLeave={handleMouseLeave}
            onClick={() => onMovieClick?.(movie)}
          >
            <div
              className={`relative bg-gray-900 rounded-lg overflow-hidden transition-all duration-300 ${
                hoveredMovie === movie.id ? "scale-105 shadow-2xl z-10" : "scale-100"
              }`}
            >
              <div className="relative aspect-video">
                {isVideoPlaying === movie.id ? (
                  <video
                    ref={(el) => (videoRefs.current[movie.id] = el)}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    loop
                    playsInline
                    poster={movie.backdrop}
                    onError={() => {
                      console.log("Movie preview failed, showing poster")
                      setIsVideoPlaying(null)
                    }}
                  >
                    <source src={movie.trailerUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={movie.backdrop || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = movie.poster
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {hoveredMovie === movie.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <Button
                        size="icon"
                        className="bg-white/90 text-black hover:bg-white rounded-full w-12 h-12"
                        onClick={(e) => {
                          e.stopPropagation()
                          onMovieClick?.(movie)
                        }}
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm rounded-full w-12 h-12"
                        onClick={(e) => addToWatchlist(movie, e)}
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                      {isVideoPlaying === movie.id && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm rounded-full w-12 h-12"
                          onClick={(e) => toggleMute(movie.id, e)}
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{movie.title}</h3>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-gray-400 text-sm">{movie.year}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{movie.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{movie.duration}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {Array.isArray(movie.genre)
                    ? movie.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                          {g}
                        </Badge>
                      ))
                    : null}
                </div>

                {hoveredMovie === movie.id && (
                  <div className="transition-all duration-300">
                    <p className="text-gray-300 text-sm line-clamp-3 mb-3">{movie.synopsis}</p>
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

export function MovieCarousels() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const similarMovies: Movie[] = [
    {
      id: 1,
      title: "Blade Runner 2049",
      poster: "/blade-runner-2049-poster.png",
      backdrop: "/blade-runner-2049-cityscape.png",
      year: 2017,
      rating: 8.2,
      genre: ["Sci-Fi", "Thriller"],
      synopsis:
        "A young blade runner discovers a secret that leads him to track down former blade runner Rick Deckard.",
      duration: "2h 44m",
      trailerUrl: "/placeholder-trailer.mp4",
    },
    {
      id: 2,
      title: "The Matrix",
      poster: "/matrix-movie-poster.png",
      backdrop: "/matrix-digital-rain.png",
      year: 1999,
      rating: 8.7,
      genre: ["Sci-Fi", "Action"],
      synopsis: "A computer programmer discovers reality is a simulation and joins a rebellion against the machines.",
      duration: "2h 16m",
      trailerUrl: "/placeholder-trailer.mp4",
    },
    {
      id: 3,
      title: "Interstellar",
      poster: "/interstellar-inspired-poster.png",
      backdrop: "/interstellar-space.png",
      year: 2014,
      rating: 8.6,
      genre: ["Sci-Fi", "Drama"],
      synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      duration: "2h 49m",
      trailerUrl: "/placeholder-trailer.mp4",
    },
    {
      id: 4,
      title: "Ex Machina",
      poster: "/ex-machina-poster.png",
      backdrop: "/ex-machina-poster.png",
      year: 2014,
      rating: 7.7,
      genre: ["Sci-Fi", "Thriller"],
      synopsis:
        "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence.",
      duration: "1h 48m",
      trailerUrl: "/placeholder-trailer.mp4",
    },
  ]

  const aiRecommended: Movie[] = [
    {
      id: 5,
      title: "Inception",
      poster: "/inception-movie-poster.png",
      backdrop: "/inception-movie-poster.png",
      year: 2010,
      rating: 8.8,
      genre: ["Sci-Fi", "Action"],
      synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task.",
      duration: "2h 28m",
      trailerUrl: "/placeholder-trailer.mp4",
    },
    {
      id: 6,
      title: "Dune: Part Two",
      poster: "/dune-part-two-poster.png",
      backdrop: "/dune-part-two-poster.png",
      year: 2024,
      rating: 8.9,
      genre: ["Sci-Fi", "Adventure"],
      synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.",
      duration: "2h 46m",
      trailerUrl: "/placeholder-trailer.mp4",
    },
    {
      id: 7,
      title: "Everything Everywhere All at Once",
      poster: "/eeaao-poster.png",
      backdrop: "/eeaao-poster.png",
      year: 2022,
      rating: 8.1,
      genre: ["Sci-Fi", "Comedy"],
      synopsis: "A Chinese-American woman gets swept up in an insane adventure in which she alone can save existence.",
      duration: "2h 19m",
      trailerUrl: "/placeholder-trailer.mp4",
    },
  ]

  const watchlistMovies: Movie[] = [
    {
      id: 8,
      title: "The Batman",
      poster: "/batman-2022-poster.png",
      backdrop: "/batman-2022-poster.png",
      year: 2022,
      rating: 7.8,
      genre: ["Action", "Crime"],
      synopsis:
        "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
      duration: "2h 56m",
      trailerUrl: "/placeholder-trailer.mp4",
      isInWatchlist: true,
    },
    {
      id: 9,
      title: "Oppenheimer",
      poster: "/images/posters/oppenheimer-poster.png",
      backdrop: "/images/posters/oppenheimer-poster.png",
      year: 2023,
      rating: 8.4,
      genre: ["Biography", "Drama"],
      synopsis:
        "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      duration: "3h 0m",
      trailerUrl: "/placeholder-trailer.mp4",
      isInWatchlist: true,
    },
  ]

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-6 lg:px-8">
        <MovieCarousel title="Similar Movies" movies={similarMovies} onMovieClick={handleMovieClick} />
        <MovieCarousel title="AI Recommended" movies={aiRecommended} onMovieClick={handleMovieClick} />
        <MovieCarousel title="My Watchlist" movies={watchlistMovies} onMovieClick={handleMovieClick} />
      </div>

      {selectedMovie && (
        <div>
          <MovieDetailModal
            movieId={selectedMovie.id}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedMovie(null)
            }}
          />
        </div>
      )}
    </section>
  )
}
