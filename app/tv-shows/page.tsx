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
import { Search, Star, Play, Plus, Calendar } from "lucide-react"
import Image from "next/image"

interface TVShow {
  id: number
  title: string
  year: number
  rating: number
  genre: string[]
  poster: string
  synopsis: string
  status: "Ongoing" | "Completed" | "Upcoming"
  seasons: number
}

const genres = ["All", "Drama", "Comedy", "Action", "Sci-Fi", "Horror", "Romance", "Thriller", "Documentary"]
const statuses = ["All", "Ongoing", "Completed", "Upcoming"]

const mockTVShows: TVShow[] = [
  {
    id: 1,
    title: "House of the Dragon",
    year: 2022,
    rating: 8.5,
    genre: ["Drama", "Fantasy"],
    poster: "/placeholder.svg",
    synopsis: "The Targaryen civil war begins. House of the Dragon tells the story of an internal succession war.",
    status: "Ongoing",
    seasons: 2,
  },
  {
    id: 2,
    title: "The Bear",
    year: 2022,
    rating: 8.7,
    genre: ["Comedy", "Drama"],
    poster: "/placeholder.svg",
    synopsis: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
    status: "Ongoing",
    seasons: 3,
  },
  {
    id: 3,
    title: "Wednesday",
    year: 2022,
    rating: 8.1,
    genre: ["Comedy", "Horror"],
    poster: "/placeholder.svg",
    synopsis: "Wednesday Addams' years as a student at Nevermore Academy.",
    status: "Ongoing",
    seasons: 1,
  },
  {
    id: 4,
    title: "Stranger Things",
    year: 2016,
    rating: 8.7,
    genre: ["Sci-Fi", "Horror"],
    poster: "/placeholder.svg",
    synopsis: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
    status: "Completed",
    seasons: 4,
  },
  {
    id: 5,
    title: "The Last of Us",
    year: 2023,
    rating: 8.8,
    genre: ["Drama", "Horror"],
    poster: "/placeholder.svg",
    synopsis: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl.",
    status: "Ongoing",
    seasons: 1,
  },
  {
    id: 6,
    title: "Avatar: The Last Airbender",
    year: 2024,
    rating: 7.8,
    genre: ["Action", "Adventure"],
    poster: "/placeholder.svg",
    synopsis: "A young Airbender named Aang and his friends must save the world from the Fire Nation.",
    status: "Upcoming",
    seasons: 1,
  },
]

export default function TVShowsPage() {
  const [shows, setShows] = useState<TVShow[]>(mockTVShows)
  const [filteredShows, setFilteredShows] = useState<TVShow[]>(mockTVShows)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    let filtered = shows

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (show) =>
          show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          show.synopsis.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by genre
    if (selectedGenre !== "All") {
      filtered = filtered.filter((show) => show.genre.includes(selectedGenre))
    }

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter((show) => show.status === selectedStatus)
    }

    // Sort shows
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

    setFilteredShows(filtered)
  }, [shows, searchQuery, selectedGenre, selectedStatus, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-green-600"
      case "Completed":
        return "bg-blue-600"
      case "Upcoming":
        return "bg-orange-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0E17]">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">TV Shows</h1>
          <p className="text-[#B3B3B3] mb-8">Explore popular TV series, trending shows, and binge-worthy content.</p>
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
                placeholder="Search TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1F2937] border-[#1F2937] text-white placeholder-[#B3B3B3] focus:border-[#00E6E6]"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <h3 className="text-white mb-2">Genres</h3>
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
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-white mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className={
                      selectedStatus === status
                        ? "bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
                        : "border-[#1F2937] text-[#B3B3B3] hover:bg-[#1F2937] hover:text-white"
                    }
                  >
                    {status}
                  </Button>
                ))}
              </div>
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

          {/* TV Shows Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredShows.map((show) => (
              <Card
                key={show.id}
                className="bg-[#1F2937] border-[#1F2937] hover:border-[#00E6E6] transition-all duration-300 group movie-card"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={show.poster || "/placeholder.svg"}
                      alt={show.title}
                      width={300}
                      height={450}
                      className="w-full h-auto rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />

                    {/* Status Badge */}
                    <div
                      className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(show.status)}`}
                    >
                      {show.status}
                    </div>

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
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{show.title}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#B3B3B3] text-sm">{show.year}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{show.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3 h-3 text-[#B3B3B3]" />
                      <span className="text-[#B3B3B3] text-xs">
                        {show.seasons} Season{show.seasons > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {show.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="outline" className="text-xs border-[#00E6E6] text-[#00E6E6]">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-[#B3B3B3] text-xs line-clamp-2">{show.synopsis}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredShows.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-white mb-4">No TV shows found</h3>
              <p className="text-[#B3B3B3] mb-6">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedGenre("All")
                  setSelectedStatus("All")
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
