"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star, Play, Pause, Plus, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

const movieCategories = [
  {
    title: "Trending Now",
    movies: [
      { id: 1, title: "Dune: Part Two", year: 2024, rating: 8.8, poster: "/dune-part-two-poster.png" },
      { id: 2, title: "Oppenheimer", year: 2023, rating: 8.4, poster: "/images/posters/oppenheimer-poster.png" },
      {
        id: 3,
        title: "Spider-Man: Across the Spider-Verse",
        year: 2023,
        rating: 8.7,
        poster: "/spider-man-across-spider-verse-inspired-poster.png",
      },
      { id: 4, title: "The Batman", year: 2022, rating: 7.8, poster: "/batman-2022-poster.png" },
      { id: 5, title: "Top Gun: Maverick", year: 2022, rating: 8.3, poster: "/generic-fighter-jet-poster.png" },
      {
        id: 6,
        title: "Avatar: The Way of Water",
        year: 2022,
        rating: 7.6,
        poster: "/way-of-water-inspired-poster.png",
      },
      {
        id: 7,
        title: "Black Panther: Wakanda Forever",
        year: 2022,
        rating: 6.7,
        poster: "/wakanda-forever-poster.png",
      },
      { id: 8, title: "Everything Everywhere All at Once", year: 2022, rating: 7.8, poster: "/eeaao-poster.png" },
      { id: 9, title: "The Menu", year: 2022, rating: 7.2, poster: "/the-menu-2022-poster.png" },
      { id: 10, title: "Glass Onion", year: 2022, rating: 7.1, poster: "/glass-onion-poster.png" },
    ],
  },
  {
    title: "Popular on MovieDetect",
    movies: [
      { id: 11, title: "Blade Runner 2049", year: 2017, rating: 8.0, poster: "/blade-runner-2049-poster.png" },
      { id: 12, title: "Interstellar", year: 2014, rating: 8.6, poster: "/interstellar-inspired-poster.png" },
      { id: 13, title: "The Matrix", year: 1999, rating: 8.7, poster: "/matrix-movie-poster.png" },
      { id: 14, title: "Inception", year: 2010, rating: 8.8, poster: "/inception-movie-poster.png" },
      { id: 15, title: "Ex Machina", year: 2014, rating: 7.7, poster: "/ex-machina-poster.png" },
      { id: 16, title: "The Dark Knight", year: 2008, rating: 9.0, poster: "/dark-knight-poster.png" },
      { id: 17, title: "Pulp Fiction", year: 1994, rating: 8.9, poster: "/pulp-fiction-poster.png" },
      { id: 18, title: "The Godfather", year: 1972, rating: 9.2, poster: "/classic-film-poster.png" },
      { id: 19, title: "Goodfellas", year: 1990, rating: 8.7, poster: "/goodfellas-poster.png" },
      { id: 20, title: "Scarface", year: 1983, rating: 8.3, poster: "/generic-gangster-movie-poster.png" },
    ],
  },
  {
    title: "Because You Watched Sci-Fi",
    movies: [
      {
        id: 21,
        title: "John Wick: Chapter 4",
        year: 2023,
        rating: 7.7,
        poster: "/john-wick-chapter-4-inspired-poster.png",
      },
      { id: 22, title: "Scream VI", year: 2023, rating: 6.5, poster: "/placeholder-p3urc.png" },
      { id: 23, title: "Cocaine Bear", year: 2023, rating: 5.9, poster: "/cocaine-bear-comedy-poster.png" },
      {
        id: 24,
        title: "Ant-Man and the Wasp: Quantumania",
        year: 2023,
        rating: 6.1,
        poster: "/ant-man-quantumania-inspired-poster.png",
      },
      { id: 25, title: "Creed III", year: 2023, rating: 6.8, poster: "/placeholder-pvmy6.png" },
      { id: 26, title: "65", year: 2023, rating: 5.4, poster: "/dinosaur-sci-fi-poster.png" },
      { id: 27, title: "Shazam! Fury of the Gods", year: 2023, rating: 5.9, poster: "/shazam-fury-gods-poster.png" },
      {
        id: 28,
        title: "The Super Mario Bros. Movie",
        year: 2023,
        rating: 7.0,
        poster: "/super-mario-movie-poster.png",
      },
      { id: 29, title: "Fast X", year: 2023, rating: 5.8, poster: "/fast-x-action-racing-poster.png" },
      {
        id: 30,
        title: "Guardians of the Galaxy Vol. 3",
        year: 2023,
        rating: 7.9,
        poster: "/guardians-galaxy-vol-3-poster.png",
      },
    ],
  },
  {
    title: "AI Movies You Might Like",
    movies: [
      { id: 31, title: "Her", year: 2013, rating: 8.0, poster: "/her-ai-romance-movie-poster.png" },
      {
        id: 32,
        title: "2001: A Space Odyssey",
        year: 1968,
        rating: 8.3,
        poster: "/placeholder.svg?height=432&width=288",
      },
      { id: 33, title: "Minority Report", year: 2002, rating: 7.6, poster: "/placeholder.svg?height=432&width=288" },
      { id: 34, title: "Ghost in the Shell", year: 1995, rating: 8.0, poster: "/placeholder.svg?height=432&width=288" },
      {
        id: 35,
        title: "A.I. Artificial Intelligence",
        year: 2001,
        rating: 7.2,
        poster: "/placeholder.svg?height=432&width=288",
      },
      { id: 36, title: "The Terminator", year: 1984, rating: 8.0, poster: "/placeholder.svg?height=432&width=288" },
      { id: 37, title: "I, Robot", year: 2004, rating: 7.1, poster: "/placeholder.svg?height=432&width=288" },
      { id: 38, title: "Transcendence", year: 2014, rating: 6.2, poster: "/placeholder.svg?height=432&width=288" },
      { id: 39, title: "Chappie", year: 2015, rating: 6.8, poster: "/placeholder.svg?height=432&width=288" },
      { id: 40, title: "The Machine", year: 2013, rating: 6.0, poster: "/placeholder.svg?height=432&width=288" },
    ],
  },
  {
    title: "Continue Watching",
    movies: [
      { id: 41, title: "Casablanca", year: 1942, rating: 8.5, poster: "/placeholder.svg?height=432&width=288" },
      {
        id: 42,
        title: "The Shawshank Redemption",
        year: 1994,
        rating: 9.3,
        poster: "/placeholder.svg?height=432&width=288",
      },
      { id: 43, title: "Forrest Gump", year: 1994, rating: 8.8, poster: "/placeholder.svg?height=432&width=288" },
      { id: 44, title: "The Lion King", year: 1994, rating: 8.5, poster: "/placeholder.svg?height=432&width=288" },
      { id: 45, title: "Titanic", year: 1997, rating: 7.8, poster: "/placeholder.svg?height=432&width=288" },
      { id: 46, title: "Jurassic Park", year: 1993, rating: 8.1, poster: "/placeholder.svg?height=432&width=288" },
      {
        id: 47,
        title: "Star Wars: A New Hope",
        year: 1977,
        rating: 8.6,
        poster: "/placeholder.svg?height=432&width=288",
      },
      { id: 48, title: "Back to the Future", year: 1985, rating: 8.5, poster: "/placeholder.svg?height=432&width=288" },
      {
        id: 49,
        title: "Raiders of the Lost Ark",
        year: 1981,
        rating: 8.5,
        poster: "/placeholder.svg?height=432&width=288",
      },
      {
        id: 50,
        title: "E.T. the Extra-Terrestrial",
        year: 1982,
        rating: 7.8,
        poster: "/placeholder.svg?height=432&width=288",
      },
    ],
  },
]

export function MovieCarousels() {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)
  const [playingMovies, setPlayingMovies] = useState<Set<number>>(new Set())

  const scrollCarousel = (direction: "left" | "right", categoryIndex: number) => {
    const carousel = document.getElementById(`carousel-${categoryIndex}`)
    if (carousel) {
      const scrollAmount = 400
      carousel.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const togglePlay = (movieId: number) => {
    setPlayingMovies((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(movieId)) {
        newSet.delete(movieId)
      } else {
        newSet.add(movieId)
      }
      return newSet
    })
  }

  return (
    <div className="py-16 px-6 bg-black">
      <div className="max-w-7xl mx-auto space-y-12">
        {movieCategories.map((category, categoryIndex) => (
          <div key={category.title} className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">{category.title}</h2>

            <div className="relative group">
              {/* Left Arrow */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
                onClick={() => scrollCarousel("left", categoryIndex)}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              {/* Right Arrow */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full"
                onClick={() => scrollCarousel("right", categoryIndex)}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>

              {/* Movies Carousel */}
              <div
                id={`carousel-${categoryIndex}`}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {category.movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex-shrink-0 w-64 group/movie cursor-pointer"
                    onMouseEnter={() => setHoveredMovie(movie.id)}
                    onMouseLeave={() => setHoveredMovie(null)}
                  >
                    <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover/movie:scale-105 group-hover/movie:z-20">
                      <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-full h-96 object-cover"
                      />

                      <div className="absolute top-2 left-2 w-5 h-5 bg-teal-600 rounded-sm flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">MD</span>
                      </div>

                      {hoveredMovie === movie.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            size="icon"
                            className="w-16 h-16 rounded-full bg-black/70 hover:bg-black/90 text-white shadow-2xl transition-all duration-200 hover:scale-110 opacity-0 group-hover/movie:opacity-100"
                            onClick={() => togglePlay(movie.id)}
                          >
                            {playingMovies.has(movie.id) ? (
                              <Pause className="w-8 h-8" />
                            ) : (
                              <Play className="w-8 h-8 ml-1" />
                            )}
                          </Button>
                        </div>
                      )}

                      {hoveredMovie === movie.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300">
                          {/* Simulated trailer preview overlay */}
                          <div className="absolute top-4 right-4">
                            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                          </div>
                          <div className="absolute top-8 left-2 text-xs text-white/80 bg-teal-600 px-2 py-1 rounded">
                            PREVIEW
                          </div>

                          <div className="relative z-10 space-y-3">
                            <h3 className="font-bold text-white text-lg">{movie.title}</h3>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-300 font-medium">{movie.year}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-white/60" />
                                <span className="text-xs text-gray-400 font-medium">{movie.rating}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-500 text-white hover:border-teal-500 hover:text-teal-400 hover:shadow-lg hover:shadow-teal-500/20 h-8 px-3 bg-black/70 backdrop-blur-sm transition-all duration-200 text-xs font-medium"
                              >
                                <VolumeX className="w-3 h-3 mr-1" />
                                Mute
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-500 text-white hover:border-white hover:text-white hover:shadow-lg hover:shadow-white/20 h-8 px-3 bg-black/70 backdrop-blur-sm transition-all duration-200 text-xs font-medium"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                My List
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
