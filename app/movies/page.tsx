"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, List, Star, Calendar, Clock } from "lucide-react"
import Image from "next/image"

const mockMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.8,
    duration: "166 min",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    poster: "/dune-part-two-poster.png",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    rating: 8.4,
    duration: "180 min",
    genre: ["Biography", "Drama", "History"],
    poster: "/images/posters/oppenheimer-poster.png",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    rating: 8.7,
    duration: "140 min",
    genre: ["Animation", "Action", "Adventure"],
    poster: "/spider-man-across-spider-verse-inspired-poster.png",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.",
  },
  {
    id: 4,
    title: "John Wick: Chapter 4",
    year: 2023,
    rating: 7.8,
    duration: "169 min",
    genre: ["Action", "Crime", "Thriller"],
    poster: "/john-wick-chapter-4-inspired-poster.png",
    description: "John Wick uncovers a path to defeating The High Table.",
  },
  {
    id: 5,
    title: "The Batman",
    year: 2022,
    rating: 7.8,
    duration: "176 min",
    genre: ["Action", "Crime", "Drama"],
    poster: "/batman-2022-poster.png",
    description:
      "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
  },
  {
    id: 6,
    title: "Everything Everywhere All at Once",
    year: 2022,
    rating: 7.8,
    duration: "139 min",
    genre: ["Action", "Adventure", "Comedy"],
    poster: "/eeaao-poster.png",
    description:
      "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence.",
  },
]

const genres = [
  "All",
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "History",
  "Sci-Fi",
  "Thriller",
]
const sortOptions = ["Popular", "Rating", "Release Date", "Title A-Z", "Title Z-A"]

export default function MoviesPage() {
  const [movies, setMovies] = useState(mockMovies)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [sortBy, setSortBy] = useState("Popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    filterAndSortMovies()
  }, [searchTerm, selectedGenre, sortBy])

  const filterAndSortMovies = () => {
    setIsLoading(true)

    setTimeout(() => {
      const filtered = mockMovies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesGenre = selectedGenre === "All" || movie.genre.includes(selectedGenre)
        return matchesSearch && matchesGenre
      })

      // Sort movies
      switch (sortBy) {
        case "Rating":
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case "Release Date":
          filtered.sort((a, b) => b.year - a.year)
          break
        case "Title A-Z":
          filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "Title Z-A":
          filtered.sort((a, b) => b.title.localeCompare(a.title))
          break
        default:
          // Keep original order for Popular
          break
      }

      setMovies(filtered)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#0B0E17]">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover <span className="gradient-text">Movies</span>
          </h1>
          <p className="text-[#B3B3B3] text-lg max-w-2xl">
            Explore our vast collection of movies from every genre and era. Find your next favorite film with our
            advanced filtering and search capabilities.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
            <Input
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1F2937] border-[#1F2937] text-white placeholder:text-[#B3B3B3] focus:border-[#00E6E6]"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
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
                        : "border-[#1F2937] text-[#B3B3B3] hover:border-[#00E6E6] hover:text-[#00E6E6]"
                    }
                  >
                    {genre}
                  </Button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1F2937] border border-[#1F2937] text-white rounded-md px-3 py-2 focus:border-[#00E6E6] focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-[#00E6E6] text-[#0B0E17]" : "border-[#1F2937] text-[#B3B3B3]"}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-[#00E6E6] text-[#0B0E17]" : "border-[#1F2937] text-[#B3B3B3]"}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[#B3B3B3]">{isLoading ? "Loading..." : `${movies.length} movies found`}</p>
        </div>

        {/* Movies Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="loading">
                <div className="bg-[#1F2937] rounded-lg aspect-[2/3] mb-4"></div>
                <div className="bg-[#1F2937] h-4 rounded mb-2"></div>
                <div className="bg-[#1F2937] h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Card key={movie.id} className="movie-card bg-[#1F2937] border-[#1F2937] overflow-hidden cursor-pointer">
                <div className="relative aspect-[2/3]">
                  <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#00E6E6] text-[#0B0E17] font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      {movie.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-[#B3B3B3] text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.year}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.slice(0, 2).map((g) => (
                      <Badge key={g} variant="outline" className="text-xs border-[#00E6E6] text-[#00E6E6]">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {movies.map((movie) => (
              <Card
                key={movie.id}
                className="bg-[#1F2937] border-[#1F2937] overflow-hidden cursor-pointer hover:border-[#00E6E6] transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-24 h-36 flex-shrink-0">
                      <Image
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white">{movie.title}</h3>
                        <Badge className="bg-[#00E6E6] text-[#0B0E17] font-semibold">
                          <Star className="w-3 h-3 mr-1" />
                          {movie.rating}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[#B3B3B3] text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{movie.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{movie.duration}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {movie.genre.map((g) => (
                          <Badge key={g} variant="outline" className="border-[#00E6E6] text-[#00E6E6]">
                            {g}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-[#B3B3B3] line-clamp-2">{movie.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-[#B3B3B3] mb-4">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedGenre("All")
                setSortBy("Popular")
              }}
              className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
