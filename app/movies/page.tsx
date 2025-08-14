"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCarousels } from "@/components/movie-carousels"
import { AIAssistant } from "@/components/ai-assistant"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Star, Play, Plus } from "lucide-react"
import Image from "next/image"

interface Movie {
  id: number
  title: string
  year: number
  rating: number
  genre: string[]
  poster: string
  synopsis: string
}

const genres = ["All", "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", "Animation"]

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.9,
    genre: ["Sci-Fi", "Adventure"],
    poster: "/dune-part-two-poster.png",
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    rating: 8.7,
    genre: ["Drama", "Biography"],
    poster: "/images/posters/oppenheimer-poster.png",
    synopsis:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    rating: 8.8,
    genre: ["Animation", "Action"],
    poster: "/spider-man-across-spider-verse-inspired-poster.png",
    synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.",
  },
  {
    id: 4,
    title: "John Wick: Chapter 4",
    year: 2023,
    rating: 8.2,
    genre: ["Action", "Thriller"],
    poster: "/john-wick-chapter-4-inspired-poster.png",
    synopsis: "John Wick uncovers a path to defeating The High Table.",
  },
  {
    id: 5,
    title: "The Batman",
    year: 2022,
    rating: 8.1,
    genre: ["Action", "Crime"],
    poster: "/batman-2022-poster.png",
    synopsis:
      "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
  },
  {
    id: 6,
    title: "Everything Everywhere All at Once",
    year: 2022,
    rating: 8.9,
    genre: ["Sci-Fi", "Comedy"],
    poster: "/eeaao-poster.png",
    synopsis:
      "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence.",
  },
]

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>(mockMovies)
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(mockMovies)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    let filtered = movies

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.synopsis.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by genre
    if (selectedGenre !== "All") {
      filtered = filtered.filter((movie) => movie.genre.includes(selectedGenre))
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "year":
          return b.year - a.year
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredMovies(filtered)
  }, [movies, searchQuery, selectedGenre, sortBy])

  return (
    <main className="min-h-screen bg-[#0B0E17]">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>
          <p className="text-[#B3B3B3] mb-8">Discover the latest movies, trending films, and timeless classics.</p>
        </div>
        <MovieCarousels />
      </div>

      <div className="pt-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1F2937] border-[#1F2937] text-white placeholder-[#B3B3B3] focus:border-[#00E6E6]"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className={
                    selectedGenre === genre
                      ? "bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
                      : "border-[#1F2937] text-[#B3B3B3] hover:bg-[#1F2937] hover:text-white"
                  }
                >
                  {genre}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <span className="text-[#B3B3B3]">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1F2937] text-white border border-[#1F2937] rounded px-3 py-1 focus:border-[#00E6E6] outline-none"
              >
                <option value="rating">Rating</option>
                <option value="year">Year</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <Card
                key={movie.id}
                className="bg-[#1F2937] border-[#1F2937] hover:border-[#00E6E6] transition-all duration-300 group movie-card"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      width={300}
                      height={450}
                      className="w-full h-auto rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#B3B3B3] text-sm">{movie.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{movie.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {movie.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="outline" className="text-xs border-[#00E6E6] text-[#00E6E6]">
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

          {/* No Results */}
          {filteredMovies.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-white mb-4">No movies found</h3>
              <p className="text-[#B3B3B3] mb-6">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedGenre("All")
                }}
                className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <AIAssistant />
      <Footer />
    </main>
  )
}
