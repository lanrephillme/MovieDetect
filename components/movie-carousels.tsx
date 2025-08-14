"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Star, Clock, Calendar, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MovieDetailModal } from "./movie-detail-modal"

interface Movie {
  id: number
  title: string
  poster: string
  backdrop?: string
  rating: number
  year: number
  genre: string[]
  synopsis?: string
  duration?: number
  trailer?: string
  isInWatchlist?: boolean
}

interface CarouselData {
  title: string
  movies: Movie[]
}

export function MovieCarousels() {
  const [carousels, setCarousels] = useState<CarouselData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set())

  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Mock data with real movie posters from your public folder
  const mockCarousels: CarouselData[] = [
    {
      title: "Trending Now",
      movies: [
        {
          id: 1,
          title: "Blade Runner 2049",
          poster: "/blade-runner-2049-poster.png",
          backdrop: "/blade-runner-2049-cityscape.png",
          rating: 8.2,
          year: 2017,
          genre: ["Sci-Fi", "Thriller", "Drama"],
          synopsis:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
          duration: 164,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 2,
          title: "The Matrix",
          poster: "/matrix-movie-poster.png",
          backdrop: "/matrix-digital-rain.png",
          rating: 8.7,
          year: 1999,
          genre: ["Action", "Sci-Fi"],
          synopsis: "A computer programmer is led to fight an underground war against powerful computers.",
          duration: 136,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 3,
          title: "Interstellar",
          poster: "/interstellar-inspired-poster.png",
          backdrop: "/interstellar-space.png",
          rating: 8.6,
          year: 2014,
          genre: ["Sci-Fi", "Drama", "Adventure"],
          synopsis:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          duration: 169,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 4,
          title: "Inception",
          poster: "/inception-movie-poster.png",
          rating: 8.8,
          year: 2010,
          genre: ["Action", "Sci-Fi", "Thriller"],
          synopsis: "A thief who steals corporate secrets through dream-sharing technology.",
          duration: 148,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 5,
          title: "The Dark Knight",
          poster: "/dark-knight-poster.png",
          rating: 9.0,
          year: 2008,
          genre: ["Action", "Crime", "Drama"],
          synopsis: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
          duration: 152,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 6,
          title: "Dune: Part Two",
          poster: "/dune-part-two-poster.png",
          rating: 8.5,
          year: 2024,
          genre: ["Sci-Fi", "Adventure", "Drama"],
          synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.",
          duration: 166,
          trailer: "/placeholder-trailer.mp4",
        },
      ],
    },
    {
      title: "Popular Movies",
      movies: [
        {
          id: 7,
          title: "Everything Everywhere All at Once",
          poster: "/eeaao-poster.png",
          rating: 7.8,
          year: 2022,
          genre: ["Action", "Adventure", "Comedy"],
          synopsis: "A middle-aged Chinese immigrant is swept up in an insane adventure.",
          duration: 139,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 8,
          title: "Spider-Man: Across the Spider-Verse",
          poster: "/spider-man-across-spider-verse-inspired-poster.png",
          rating: 8.7,
          year: 2023,
          genre: ["Animation", "Action", "Adventure"],
          synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.",
          duration: 140,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 9,
          title: "John Wick: Chapter 4",
          poster: "/john-wick-chapter-4-inspired-poster.png",
          rating: 7.7,
          year: 2023,
          genre: ["Action", "Crime", "Thriller"],
          synopsis: "John Wick uncovers a path to defeating The High Table.",
          duration: 169,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 10,
          title: "Avatar: The Way of Water",
          poster: "/way-of-water-inspired-poster.png",
          rating: 7.6,
          year: 2022,
          genre: ["Action", "Adventure", "Family"],
          synopsis: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
          duration: 192,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 11,
          title: "Black Panther: Wakanda Forever",
          poster: "/wakanda-forever-poster.png",
          rating: 6.7,
          year: 2022,
          genre: ["Action", "Adventure", "Drama"],
          synopsis: "The people of Wakanda fight to protect their home from intervening world powers.",
          duration: 161,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 12,
          title: "The Batman",
          poster: "/batman-2022-poster.png",
          rating: 7.8,
          year: 2022,
          genre: ["Action", "Crime", "Drama"],
          synopsis:
            "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
          duration: 176,
          trailer: "/placeholder-trailer.mp4",
        },
      ],
    },
    {
      title: "New Releases",
      movies: [
        {
          id: 13,
          title: "Guardians of the Galaxy Vol. 3",
          poster: "/guardians-galaxy-vol-3-poster.png",
          rating: 7.9,
          year: 2023,
          genre: ["Action", "Adventure", "Comedy"],
          synopsis: "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe.",
          duration: 150,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 14,
          title: "Fast X",
          poster: "/fast-x-action-racing-poster.png",
          rating: 5.8,
          year: 2023,
          genre: ["Action", "Adventure", "Crime"],
          synopsis: "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.",
          duration: 141,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 15,
          title: "The Super Mario Bros. Movie",
          poster: "/super-mario-movie-poster.png",
          rating: 7.0,
          year: 2023,
          genre: ["Animation", "Adventure", "Comedy"],
          synopsis: "A plumber named Mario travels through an underground labyrinth with his brother Luigi.",
          duration: 92,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 16,
          title: "Ant-Man and the Wasp: Quantumania",
          poster: "/ant-man-quantumania-inspired-poster.png",
          rating: 6.1,
          year: 2023,
          genre: ["Action", "Adventure", "Comedy"],
          synopsis: "Scott Lang and Hope Van Dyne are dragged into the Quantum Realm.",
          duration: 124,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 17,
          title: "Shazam! Fury of the Gods",
          poster: "/shazam-fury-gods-poster.png",
          rating: 5.9,
          year: 2023,
          genre: ["Action", "Adventure", "Comedy"],
          synopsis:
            "The film continues the story of teenage Billy Batson who transforms into the adult superhero Shazam.",
          duration: 130,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 18,
          title: "Cocaine Bear",
          poster: "/cocaine-bear-comedy-poster.png",
          rating: 5.9,
          year: 2023,
          genre: ["Comedy", "Crime", "Thriller"],
          synopsis: "An oddball group of cops, criminals, tourists and teens converge on a Georgia forest.",
          duration: 95,
          trailer: "/placeholder-trailer.mp4",
        },
      ],
    },
    {
      title: "Top Rated",
      movies: [
        {
          id: 19,
          title: "Goodfellas",
          poster: "/goodfellas-poster.png",
          rating: 8.7,
          year: 1990,
          genre: ["Biography", "Crime", "Drama"],
          synopsis: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen.",
          duration: 146,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 20,
          title: "Pulp Fiction",
          poster: "/pulp-fiction-poster.png",
          rating: 8.9,
          year: 1994,
          genre: ["Crime", "Drama"],
          synopsis:
            "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.",
          duration: 154,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 21,
          title: "The Menu",
          poster: "/the-menu-2022-poster.png",
          rating: 7.2,
          year: 2022,
          genre: ["Comedy", "Horror", "Thriller"],
          synopsis: "A young couple travels to a remote island to eat at an exclusive restaurant.",
          duration: 107,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 22,
          title: "Glass Onion: A Knives Out Mystery",
          poster: "/glass-onion-poster.png",
          rating: 7.2,
          year: 2022,
          genre: ["Comedy", "Crime", "Drama"],
          synopsis:
            "Detective Benoit Blanc travels to Greece to peel back the layers of a mystery involving a new cast of suspects.",
          duration: 139,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 23,
          title: "Ex Machina",
          poster: "/ex-machina-poster.png",
          rating: 7.7,
          year: 2014,
          genre: ["Drama", "Sci-Fi", "Thriller"],
          synopsis:
            "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence.",
          duration: 108,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 24,
          title: "Her",
          poster: "/her-ai-romance-movie-poster.png",
          rating: 8.0,
          year: 2013,
          genre: ["Drama", "Romance", "Sci-Fi"],
          synopsis:
            "A sensitive writer develops an unlikely relationship with an operating system designed to meet his every need.",
          duration: 126,
          trailer: "/placeholder-trailer.mp4",
        },
      ],
    },
    {
      title: "AI Recommendations",
      movies: [
        {
          id: 25,
          title: "Oppenheimer",
          poster: "/images/posters/oppenheimer-poster.png",
          rating: 8.3,
          year: 2023,
          genre: ["Biography", "Drama", "History"],
          synopsis:
            "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
          duration: 180,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 26,
          title: "Classic Film",
          poster: "/classic-film-poster.png",
          rating: 8.1,
          year: 1975,
          genre: ["Drama", "Thriller"],
          synopsis: "A timeless classic that has influenced generations of filmmakers.",
          duration: 120,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 27,
          title: "Sci-Fi Adventure",
          poster: "/dinosaur-sci-fi-poster.png",
          rating: 7.5,
          year: 2023,
          genre: ["Adventure", "Sci-Fi"],
          synopsis: "An epic journey through time and space with cutting-edge visual effects.",
          duration: 135,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 28,
          title: "Action Thriller",
          poster: "/generic-fighter-jet-poster.png",
          rating: 7.8,
          year: 2023,
          genre: ["Action", "Thriller"],
          synopsis: "High-octane action sequences and heart-pounding thrills.",
          duration: 142,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 29,
          title: "Crime Drama",
          poster: "/generic-gangster-movie-poster.png",
          rating: 8.2,
          year: 2022,
          genre: ["Crime", "Drama"],
          synopsis: "A gripping tale of loyalty, betrayal, and the price of power.",
          duration: 158,
          trailer: "/placeholder-trailer.mp4",
        },
        {
          id: 30,
          title: "Mystery Thriller",
          poster: "/placeholder.svg",
          rating: 7.6,
          year: 2023,
          genre: ["Mystery", "Thriller"],
          synopsis: "A mind-bending mystery that will keep you guessing until the very end.",
          duration: 128,
          trailer: "/placeholder-trailer.mp4",
        },
      ],
    },
    {
      title: "Your Watchlist",
      movies: [
        {
          id: 31,
          title: "Blade Runner 2049",
          poster: "/blade-runner-2049-poster.png",
          rating: 8.2,
          year: 2017,
          genre: ["Sci-Fi", "Thriller", "Drama"],
          synopsis: "A young blade runner's discovery leads him to track down Rick Deckard.",
          duration: 164,
          trailer: "/placeholder-trailer.mp4",
          isInWatchlist: true,
        },
        {
          id: 32,
          title: "The Matrix",
          poster: "/matrix-movie-poster.png",
          rating: 8.7,
          year: 1999,
          genre: ["Action", "Sci-Fi"],
          synopsis: "A computer programmer fights an underground war against powerful computers.",
          duration: 136,
          trailer: "/placeholder-trailer.mp4",
          isInWatchlist: true,
        },
        {
          id: 33,
          title: "Interstellar",
          poster: "/interstellar-inspired-poster.png",
          rating: 8.6,
          year: 2014,
          genre: ["Sci-Fi", "Drama", "Adventure"],
          synopsis: "Explorers travel through a wormhole to ensure humanity's survival.",
          duration: 169,
          trailer: "/placeholder-trailer.mp4",
          isInWatchlist: true,
        },
        {
          id: 34,
          title: "Inception",
          poster: "/inception-movie-poster.png",
          rating: 8.8,
          year: 2010,
          genre: ["Action", "Sci-Fi", "Thriller"],
          synopsis: "A thief steals corporate secrets through dream-sharing technology.",
          duration: 148,
          trailer: "/placeholder-trailer.mp4",
          isInWatchlist: true,
        },
        {
          id: 35,
          title: "The Dark Knight",
          poster: "/dark-knight-poster.png",
          rating: 9.0,
          year: 2008,
          genre: ["Action", "Crime", "Drama"],
          synopsis: "Batman faces the Joker in this epic crime saga.",
          duration: 152,
          trailer: "/placeholder-trailer.mp4",
          isInWatchlist: true,
        },
        {
          id: 36,
          title: "Dune: Part Two",
          poster: "/dune-part-two-poster.png",
          rating: 8.5,
          year: 2024,
          genre: ["Sci-Fi", "Adventure", "Drama"],
          synopsis: "Paul Atreides continues his journey on the desert planet Arrakis.",
          duration: 166,
          trailer: "/placeholder-trailer.mp4",
          isInWatchlist: true,
        },
      ],
    },
  ]

  const fetchCarouselData = async (endpoint: string, title: string): Promise<CarouselData> => {
    try {
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle different response formats
      let movies: Movie[] = []

      if (data.success && data.movie) {
        // Single movie object format
        const movie = data.movie
        movies = [
          {
            id: movie.id || Math.random(),
            title: movie.title || "Unknown Title",
            poster: movie.poster || "/placeholder.svg",
            backdrop: movie.backdrop,
            rating: movie.ratings?.userAverage || movie.rating || 0,
            year: movie.year || new Date().getFullYear(),
            genre: Array.isArray(movie.genre) ? movie.genre : movie.genres || [],
            synopsis: movie.synopsis || movie.overview,
            duration: movie.duration,
            trailer: movie.trailer,
            isInWatchlist: movie.isInWatchlist || false,
          },
        ]
      } else if (data.success && Array.isArray(data.data)) {
        // Array format
        movies = data.data.map((movie: any) => ({
          id: movie.id || Math.random(),
          title: movie.title || "Unknown Title",
          poster: movie.poster || "/placeholder.svg",
          backdrop: movie.backdrop,
          rating: movie.ratings?.userAverage || movie.rating || 0,
          year: movie.year || new Date().getFullYear(),
          genre: Array.isArray(movie.genre) ? movie.genre : movie.genres || [],
          synopsis: movie.synopsis || movie.overview,
          duration: movie.duration,
          trailer: movie.trailer,
          isInWatchlist: movie.isInWatchlist || false,
        }))
      } else if (Array.isArray(data.results)) {
        // TMDB format
        movies = data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title || movie.name,
          poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.svg",
          backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined,
          rating: movie.vote_average || 0,
          year: new Date(movie.release_date || movie.first_air_date || "").getFullYear() || new Date().getFullYear(),
          genre: movie.genre_ids?.map((id: number) => getGenreName(id)) || [],
          synopsis: movie.overview,
          duration: movie.runtime,
          trailer: "/placeholder-trailer.mp4",
          isInWatchlist: false,
        }))
      }

      return {
        title,
        movies: movies.length > 0 ? movies : mockCarousels.find((c) => c.title === title)?.movies || [],
      }
    } catch (error) {
      console.error(`Error fetching ${title}:`, error)
      // Return mock data as fallback
      return mockCarousels.find((c) => c.title === title) || { title, movies: [] }
    }
  }

  const getGenreName = (id: number): string => {
    const genreMap: { [key: number]: string } = {
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
      878: "Sci-Fi",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    }
    return genreMap[id] || "Unknown"
  }

  useEffect(() => {
    const loadCarousels = async () => {
      setLoading(true)
      setError(null)

      try {
        const carouselPromises = [
          fetchCarouselData("/api/movies/trending", "Trending Now"),
          fetchCarouselData("/api/movies/popular", "Popular Movies"),
          fetchCarouselData("/api/movies/new-releases", "New Releases"),
          fetchCarouselData("/api/movies/top-rated", "Top Rated"),
          fetchCarouselData("/api/recommendations", "AI Recommendations"),
          fetchCarouselData("/api/watchlist/user", "Your Watchlist"),
        ]

        const results = await Promise.all(carouselPromises)
        setCarousels(results)
      } catch (err) {
        console.error("Error loading carousels:", err)
        setError("Failed to load movie data")
        // Use mock data as fallback
        setCarousels(mockCarousels)
      } finally {
        setLoading(false)
      }
    }

    loadCarousels()
  }, [])

  const scroll = (direction: "left" | "right", carouselTitle: string) => {
    const container = scrollRefs.current[carouselTitle]
    if (container) {
      const scrollAmount = container.clientWidth * 0.8
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const toggleWatchlist = (movieId: number) => {
    setWatchlist((prev) => {
      const newWatchlist = new Set(prev)
      if (newWatchlist.has(movieId)) {
        newWatchlist.delete(movieId)
      } else {
        newWatchlist.add(movieId)
      }
      return newWatchlist
    })
  }

  if (loading) {
    return (
      <div className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="space-y-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-6">
                <div className="h-8 bg-gray-800 rounded w-48 animate-pulse" />
                <div className="flex space-x-4 overflow-hidden">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div key={j} className="flex-shrink-0 w-48 h-72 bg-gray-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 bg-black">
        <div className="container mx-auto px-6 text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="space-y-12">
            {carousels.map((carousel) => (
              <div key={carousel.title} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{carousel.title}</h2>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-400 hover:text-white hover:border-white bg-transparent"
                      onClick={() => scroll("left", carousel.title)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-400 hover:text-white hover:border-white bg-transparent"
                      onClick={() => scroll("right", carousel.title)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div
                  ref={(el) => (scrollRefs.current[carousel.title] = el)}
                  className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {carousel.movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex-shrink-0 group cursor-pointer"
                      onMouseEnter={() => setHoveredMovie(movie.id)}
                      onMouseLeave={() => setHoveredMovie(null)}
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <div className="relative w-48 h-72 rounded-lg overflow-hidden bg-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />

                        {/* Hover Overlay */}
                        <div
                          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
                            hoveredMovie === movie.id ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <div className="absolute inset-0 p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white text-sm font-semibold">{movie.rating.toFixed(1)}</span>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-white/50 text-white hover:bg-white/20 p-2 bg-transparent"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleWatchlist(movie.id)
                                }}
                              >
                                {watchlist.has(movie.id) || movie.isInWatchlist ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-white font-semibold text-sm line-clamp-2">{movie.title}</h3>
                              <div className="flex items-center space-x-2 text-xs text-gray-300">
                                <Calendar className="w-3 h-3" />
                                <span>{movie.year}</span>
                                {movie.duration && (
                                  <>
                                    <span>•</span>
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                    </span>
                                  </>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {movie.genre.slice(0, 2).map((g) => (
                                  <Badge
                                    key={g}
                                    variant="secondary"
                                    className="text-xs px-2 py-0.5 bg-white/20 text-white"
                                  >
                                    {g}
                                  </Badge>
                                ))}
                              </div>
                              <Button
                                size="sm"
                                className="w-full bg-white text-black hover:bg-gray-200 mt-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedMovie(movie)
                                }}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Watch Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal movie={selectedMovie} isOpen={!!selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  )
}
