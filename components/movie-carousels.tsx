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
        console.log(`Fetching ${endpoint} for ${key}...`)
        const response = await fetch(`/api/movies/${endpoint}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log(`Response for ${key}:`, data)

        let movies: any[] = []

        // Handle different response formats
        if (data.success && data.data && Array.isArray(data.data)) {
          // Format: { success: true, data: [...] }
          movies = data.data
        } else if (data.success && data.movies && Array.isArray(data.movies)) {
          // Format: { success: true, movies: [...] }
          movies = data.movies
        } else if (data.success && data.movie && typeof data.movie === "object") {
          // Format: { success: true, movie: {...} } - Single movie object
          movies = [data.movie]
        } else if (Array.isArray(data)) {
          // Format: [...] - Direct array
          movies = data
        } else if (data.results && Array.isArray(data.results)) {
          // Format: { results: [...] } - TMDB style
          movies = data.results
        } else {
          console.error(`Invalid response format for ${key}:`, data)
          // Use fallback mock data instead of throwing error
          movies = generateMockMovies(6)
        }

        // Process movies and add mock preview URLs
        const moviesWithPreviews = movies.map((movie: any, index: number) => ({
          id: movie.id || index + 1,
          title: movie.title || movie.name || "Unknown Title",
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : movie.poster || "/placeholder.svg",
          backdrop: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : movie.backdrop || movie.poster || "/placeholder.svg",
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : movie.year || 2023,
          genre: movie.genre_ids
            ? movie.genre_ids.map((id: number) => getGenreName(id))
            : Array.isArray(movie.genre)
              ? movie.genre
              : [movie.genre || "Unknown"],
          rating: movie.vote_average || movie.ratings?.userAverage || movie.rating || 7.5,
          synopsis:
            movie.overview ||
            movie.synopsis ||
            movie.description ||
            `${movie.title || movie.name} is a great movie to watch.`,
          previewUrl: `/previews/preview-${movie.id || index + 1}.mp4`,
          trailerUrl: movie.trailer || `https://www.youtube.com/watch?v=trailer-${movie.id || index + 1}`,
          aiConfidence: key === "recommendations" ? Math.floor(Math.random() * 40) + 60 : undefined,
        }))

        setCarousels((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            movies: moviesWithPreviews,
            loading: false,
          },
        }))
      } catch (error) {
        console.error(`Error fetching ${key}:`, error)

        // Use fallback mock data instead of showing error
        const fallbackMovies = generateMockMovies(6).map((movie, index) => ({
          ...movie,
          id:
            index +
            (key === "trending"
              ? 1
              : key === "popular"
                ? 100
                : key === "newReleases"
                  ? 200
                  : key === "topRated"
                    ? 300
                    : 400),
        }))

        setCarousels((prev) => ({
          ...prev,
          [key]: {
            ...prev[key],
            movies: fallbackMovies,
            loading: false,
            error: null, // Don't show error, just use fallback data
          },
        }))
      }
    }

    // Helper function to map genre IDs to names (TMDB format)
    const getGenreName = (id: number): string => {
      const genreMap: Record<number, string> = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Science Fiction",
        10770: "TV Movie",
        53: "Thriller",
        10752: "War",
        37: "Western",
      }
      return genreMap[id] || "Unknown"
    }

    // Generate mock movies as fallback
    const generateMockMovies = (count: number): Movie[] => {
      const mockMovies = [
        {
          id: 1,
          title: "Blade Runner 2049",
          poster: "/blade-runner-2049-poster.png",
          backdrop: "/blade-runner-2049-cityscape.png",
          year: 2017,
          genre: ["Sci-Fi", "Thriller"],
          rating: 8.2,
          synopsis:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
        },
        {
          id: 2,
          title: "The Matrix",
          poster: "/matrix-movie-poster.png",
          backdrop: "/matrix-digital-rain.png",
          year: 1999,
          genre: ["Action", "Sci-Fi"],
          rating: 8.7,
          synopsis:
            "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
        },
        {
          id: 3,
          title: "Interstellar",
          poster: "/interstellar-inspired-poster.png",
          backdrop: "/interstellar-space.png",
          year: 2014,
          genre: ["Sci-Fi", "Drama"],
          rating: 8.6,
          synopsis:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        },
        {
          id: 4,
          title: "Inception",
          poster: "/inception-movie-poster.png",
          year: 2010,
          genre: ["Action", "Sci-Fi"],
          rating: 8.8,
          synopsis:
            "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        },
        {
          id: 5,
          title: "The Dark Knight",
          poster: "/dark-knight-poster.png",
          year: 2008,
          genre: ["Action", "Crime"],
          rating: 9.0,
          synopsis:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
        },
        {
          id: 6,
          title: "Dune: Part Two",
          poster: "/dune-part-two-poster.png",
          year: 2024,
          genre: ["Sci-Fi", "Adventure"],
          rating: 8.5,
          synopsis:
            "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        },
        {
          id: 7,
          title: "Everything Everywhere All at Once",
          poster: "/eeaao-poster.png",
          year: 2022,
          genre: ["Sci-Fi", "Comedy"],
          rating: 7.8,
          synopsis:
            "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence.",
        },
        {
          id: 8,
          title: "Oppenheimer",
          poster: "/images/posters/oppenheimer-poster.png",
          year: 2023,
          genre: ["Biography", "Drama"],
          rating: 8.3,
          synopsis:
            "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        },
        {
          id: 9,
          title: "Avatar: The Way of Water",
          poster: "/way-of-water-inspired-poster.png",
          year: 2022,
          genre: ["Sci-Fi", "Adventure"],
          rating: 7.6,
          synopsis: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
        },
        {
          id: 10,
          title: "Spider-Man: Across the Spider-Verse",
          poster: "/spider-man-across-spider-verse-inspired-poster.png",
          year: 2023,
          genre: ["Animation", "Action"],
          rating: 8.7,
          synopsis:
            "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        },
        {
          id: 11,
          title: "John Wick: Chapter 4",
          poster: "/john-wick-chapter-4-inspired-poster.png",
          year: 2023,
          genre: ["Action", "Thriller"],
          rating: 7.7,
          synopsis:
            "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.",
        },
        {
          id: 12,
          title: "Guardians of the Galaxy Vol. 3",
          poster: "/guardians-galaxy-vol-3-poster.png",
          year: 2023,
          genre: ["Action", "Adventure"],
          rating: 7.9,
          synopsis:
            "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and protect one of their own.",
        },
      ]

      return mockMovies.slice(0, count).map((movie, index) => ({
        ...movie,
        previewUrl: `/previews/preview-${movie.id}.mp4`,
        trailerUrl: `https://www.youtube.com/watch?v=trailer-${movie.id}`,
      }))
    }

    // Fetch all carousel data
    fetchCarouselData("trending", "trending")
    fetchCarouselData("popular", "popular")
    fetchCarouselData("new-releases", "newReleases")
    fetchCarouselData("top-rated", "topRated")

    // Fetch recommendations
    fetch("/api/recommendations")
      .then((res) => res.json())
      .then((data) => {
        console.log("Recommendations response:", data)

        let movies: any[] = []
        if (data.success && data.movies && Array.isArray(data.movies)) {
          movies = data.movies
        } else if (data.success && data.movie && typeof data.movie === "object") {
          movies = [data.movie]
        } else if (Array.isArray(data)) {
          movies = data
        } else {
          // Generate mock recommendations if API fails
          movies = generateMockMovies(6)
        }

        const moviesWithPreviews = movies.map((movie: any, index: number) => ({
          id: movie.id || index + 500,
          title: movie.title || movie.name || "Recommended Movie",
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : movie.poster || "/placeholder.svg",
          backdrop: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : movie.backdrop || movie.poster || "/placeholder.svg",
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : movie.year || 2023,
          genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre || "Drama"],
          rating: movie.vote_average || movie.ratings?.userAverage || movie.rating || 8.0,
          synopsis: movie.overview || movie.synopsis || "A highly recommended movie based on your preferences.",
          previewUrl: `/previews/preview-${movie.id || index + 500}.mp4`,
          trailerUrl: movie.trailer || `https://www.youtube.com/watch?v=trailer-${movie.id || index + 500}`,
          aiConfidence: Math.floor(Math.random() * 40) + 60,
        }))

        setCarousels((prev) => ({
          ...prev,
          recommendations: {
            ...prev.recommendations,
            movies: moviesWithPreviews,
            loading: false,
          },
        }))
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error)
        // Use mock data as fallback
        const mockMovies = generateMockMovies(6).map((movie, index) => ({
          ...movie,
          id: index + 500,
          aiConfidence: Math.floor(Math.random() * 40) + 60,
        }))

        setCarousels((prev) => ({
          ...prev,
          recommendations: {
            ...prev.recommendations,
            movies: mockMovies,
            loading: false,
          },
        }))
      })

    // Fetch watchlist
    fetch("/api/watchlist/user")
      .then((res) => res.json())
      .then((data) => {
        console.log("Watchlist response:", data)

        let movies: any[] = []
        if (data.success && data.movies && Array.isArray(data.movies)) {
          movies = data.movies
        } else if (data.success && data.movie && typeof data.movie === "object") {
          movies = [data.movie]
        } else if (Array.isArray(data)) {
          movies = data
        } else {
          movies = [] // Empty watchlist is okay
        }

        const moviesWithPreviews = movies.map((movie: any, index: number) => ({
          id: movie.id || index + 600,
          title: movie.title || movie.name || "Watchlist Movie",
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : movie.poster || "/placeholder.svg",
          backdrop: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : movie.backdrop || movie.poster || "/placeholder.svg",
          year: movie.release_date ? new Date(movie.release_date).getFullYear() : movie.year || 2023,
          genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre || "Drama"],
          rating: movie.vote_average || movie.ratings?.userAverage || movie.rating || 7.8,
          synopsis: movie.overview || movie.synopsis || "A movie from your watchlist.",
          previewUrl: `/previews/preview-${movie.id || index + 600}.mp4`,
          trailerUrl: movie.trailer || `https://www.youtube.com/watch?v=trailer-${movie.id || index + 600}`,
        }))

        setCarousels((prev) => ({
          ...prev,
          watchlist: {
            ...prev.watchlist,
            movies: moviesWithPreviews,
            loading: false,
          },
        }))
      })
      .catch((error) => {
        console.error("Error fetching watchlist:", error)
        setCarousels((prev) => ({
          ...prev,
          watchlist: {
            ...prev.watchlist,
            movies: [],
            loading: false,
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

      // Start preview video after 1.5s delay with error handling
      previewTimeoutRef.current = setTimeout(() => {
        const video = previewVideos[movieId]
        if (video) {
          video.currentTime = 0
          video.play().catch((error) => {
            console.log("Video playback failed, using static image:", error)
            // Video will fallback to poster image automatically
          })
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

      // Add error handling
      video.onerror = () => {
        console.log(`Video failed to load for movie ${movie.id}, using poster image`)
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
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 h-96 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data.error ? (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg mx-6">
          <p>
            Error loading {data.title.toLowerCase()}: {data.error}
          </p>
          <p className="text-sm text-gray-400 mt-2">Using fallback data...</p>
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
              // Create preview video element
              createPreviewVideo(movie)

              // Ensure genre is always an array
              const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre || "Unknown"]

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
                            console.log("Video element error, falling back to poster")
                            e.currentTarget.style.display = "none"
                          }}
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
                            <span className="text-white text-sm font-medium">{movie.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {genres.slice(0, 2).map((g) => (
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
