"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Play, Plus, Star, Clock } from "lucide-react"
import Image from "next/image"
import { MovieDetailModal } from "@/components/movie-detail-modal"

interface Movie {
  id: number
  title: string
  year: number
  poster: string
  backdrop: string
  rating: number
  genre: string[]
  synopsis: string
  duration: string
  director: string
  cast: string[]
  trailer: string
  isInWatchlist?: boolean
}

interface Carousel {
  id: string
  title: string
  movies: Movie[]
}

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    poster: "/dune-part-two-poster.png",
    backdrop: "/dune-part-two-poster.png",
    rating: 8.9,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    duration: "166 min",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    poster: "/images/posters/oppenheimer-poster.png",
    backdrop: "/images/posters/oppenheimer-poster.png",
    rating: 8.7,
    genre: ["Drama", "Biography", "History"],
    synopsis:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    duration: "180 min",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    poster: "/spider-man-across-spider-verse-inspired-poster.png",
    backdrop: "/spider-man-across-spider-verse-inspired-poster.png",
    rating: 8.8,
    genre: ["Animation", "Action", "Adventure"],
    synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.",
    duration: "140 min",
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Brian Tyree Henry"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 4,
    title: "John Wick: Chapter 4",
    year: 2023,
    poster: "/john-wick-chapter-4-inspired-poster.png",
    backdrop: "/john-wick-chapter-4-inspired-poster.png",
    rating: 8.2,
    genre: ["Action", "Thriller", "Crime"],
    synopsis: "John Wick uncovers a path to defeating The High Table.",
    duration: "169 min",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 5,
    title: "Everything Everywhere All at Once",
    year: 2022,
    poster: "/eeaao-poster.png",
    backdrop: "/eeaao-poster.png",
    rating: 8.9,
    genre: ["Sci-Fi", "Comedy", "Drama"],
    synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure.",
    duration: "139 min",
    director: "Daniels",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: 6,
    title: "The Batman",
    year: 2022,
    poster: "/batman-2022-poster.png",
    backdrop: "/batman-2022-poster.png",
    rating: 7.8,
    genre: ["Action", "Crime", "Drama"],
    synopsis: "When a sadistic serial killer begins murdering key political figures in Gotham.",
    duration: "176 min",
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 7,
    title: "Guardians of the Galaxy Vol. 3",
    year: 2023,
    poster: "/guardians-galaxy-vol-3-poster.png",
    backdrop: "/guardians-galaxy-vol-3-poster.png",
    rating: 8.0,
    genre: ["Action", "Adventure", "Comedy"],
    synopsis: "Still reeling from the loss of Gamora, Peter Quill rallies his team.",
    duration: "150 min",
    director: "James Gunn",
    cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 8,
    title: "Ant-Man and the Wasp: Quantumania",
    year: 2023,
    poster: "/ant-man-quantumania-inspired-poster.png",
    backdrop: "/ant-man-quantumania-inspired-poster.png",
    rating: 6.2,
    genre: ["Action", "Adventure", "Comedy"],
    synopsis: "Scott Lang and Hope Van Dyne are dragged into the Quantum Realm.",
    duration: "124 min",
    director: "Peyton Reed",
    cast: ["Paul Rudd", "Evangeline Lilly", "Michael Douglas"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    id: 9,
    title: "Avatar: The Way of Water",
    year: 2022,
    poster: "/way-of-water-inspired-poster.png",
    backdrop: "/way-of-water-inspired-poster.png",
    rating: 7.6,
    genre: ["Action", "Adventure", "Drama"],
    synopsis: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
    duration: "192 min",
    director: "James Cameron",
    cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 10,
    title: "Black Panther: Wakanda Forever",
    year: 2022,
    poster: "/wakanda-forever-poster.png",
    backdrop: "/wakanda-forever-poster.png",
    rating: 6.7,
    genre: ["Action", "Adventure", "Drama"],
    synopsis: "The people of Wakanda fight to protect their home from intervening world powers.",
    duration: "161 min",
    director: "Ryan Coogler",
    cast: ["Letitia Wright", "Lupita Nyong'o", "Danai Gurira"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
]

export function MovieCarousels() {
  const [carousels, setCarousels] = useState<Carousel[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    // Simulate API calls for different carousel categories
    const loadCarousels = async () => {
      const carouselData: Carousel[] = [
        {
          id: "trending",
          title: "Trending Now",
          movies: mockMovies.slice(0, 10),
        },
        {
          id: "new-releases",
          title: "New Releases",
          movies: mockMovies.slice(2, 12),
        },
        {
          id: "ai-recommended",
          title: "AI Recommended for You",
          movies: mockMovies.slice(1, 11),
        },
        {
          id: "coming-soon",
          title: "Coming Soon",
          movies: mockMovies.slice(3, 13),
        },
        {
          id: "watchlist",
          title: "Your Watchlist",
          movies: mockMovies.slice(0, 8).map((movie) => ({ ...movie, isInWatchlist: true })),
        },
        {
          id: "most-watched",
          title: "Most Watched",
          movies: mockMovies.slice(4, 14),
        },
      ]
      setCarousels(carouselData)
    }

    loadCarousels()
  }, [])

  const scrollCarousel = (carouselId: string, direction: "left" | "right") => {
    const carousel = carouselRefs.current[carouselId]
    if (carousel) {
      const scrollAmount = 320 // Width of movie card + gap
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  const handleAddToWatchlist = (movieId: number) => {
    setCarousels((prev) =>
      prev.map((carousel) => ({
        ...carousel,
        movies: carousel.movies.map((movie) =>
          movie.id === movieId ? { ...movie, isInWatchlist: !movie.isInWatchlist } : movie,
        ),
      })),
    )
  }

  return (
    <div className="py-16 bg-[#0B0E17]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="space-y-12">
          {carousels.map((carousel) => (
            <div key={carousel.id} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{carousel.title}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollCarousel(carousel.id, "left")}
                    className="bg-[#1F2937] text-white hover:bg-[#00E6E6] hover:text-[#0B0E17] rounded-full w-10 h-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollCarousel(carousel.id, "right")}
                    className="bg-[#1F2937] text-white hover:bg-[#00E6E6] hover:text-[#0B0E17] rounded-full w-10 h-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div
                ref={(el) => (carouselRefs.current[carousel.id] = el)}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {carousel.movies.map((movie) => (
                  <Card
                    key={movie.id}
                    className="flex-shrink-0 w-72 bg-[#1F2937] border-[#1F2937] hover:border-[#00E6E6] transition-all duration-300 cursor-pointer movie-card group"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="relative">
                      <Image
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        width={288}
                        height={160}
                        className="w-full h-40 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                        <Button
                          size="sm"
                          className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMovieClick(movie)
                          }}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-white text-sm line-clamp-2 flex-1">{movie.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToWatchlist(movie.id)
                            }}
                            className={`ml-2 p-1 h-auto ${
                              movie.isInWatchlist ? "text-[#00E6E6]" : "text-[#B3B3B3] hover:text-[#00E6E6]"
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#B3B3B3]">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {movie.rating}
                          </span>
                          <span>{movie.year}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {movie.duration}
                          </span>
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          {movie.genre.slice(0, 2).map((g) => (
                            <Badge
                              key={g}
                              variant="secondary"
                              className="bg-[#00E6E6]/20 text-[#00E6E6] text-xs px-2 py-1"
                            >
                              {g}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-[#B3B3B3] text-xs line-clamp-2">{movie.synopsis}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movieId={selectedMovie.id}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMovie(null)
          }}
        />
      )}
    </div>
  )
}
