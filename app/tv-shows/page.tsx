"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, List, Star, Calendar, Tv, Users } from "lucide-react"
import Image from "next/image"

const mockTVShows = [
  {
    id: 1,
    title: "The Last of Us",
    year: 2023,
    rating: 8.7,
    seasons: 1,
    episodes: 9,
    status: "Ongoing",
    genre: ["Drama", "Horror", "Sci-Fi"],
    poster: "/placeholder.svg?height=400&width=300&text=The+Last+of+Us",
    description:
      "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
  },
  {
    id: 2,
    title: "House of the Dragon",
    year: 2022,
    rating: 8.5,
    seasons: 2,
    episodes: 18,
    status: "Ongoing",
    genre: ["Action", "Adventure", "Drama"],
    poster: "/placeholder.svg?height=400&width=300&text=House+of+the+Dragon",
    description:
      "An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.",
  },
  {
    id: 3,
    title: "Wednesday",
    year: 2022,
    rating: 8.1,
    seasons: 1,
    episodes: 8,
    status: "Ongoing",
    genre: ["Comedy", "Crime", "Family"],
    poster: "/placeholder.svg?height=400&width=300&text=Wednesday",
    description:
      "Follows Wednesday Addams' years as a student at Nevermore Academy, where she attempts to master her emerging psychic ability.",
  },
  {
    id: 4,
    title: "Stranger Things",
    year: 2016,
    rating: 8.7,
    seasons: 4,
    episodes: 42,
    status: "Ended",
    genre: ["Drama", "Fantasy", "Horror"],
    poster: "/placeholder.svg?height=400&width=300&text=Stranger+Things",
    description:
      "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces.",
  },
  {
    id: 5,
    title: "The Bear",
    year: 2022,
    rating: 8.7,
    seasons: 3,
    episodes: 28,
    status: "Ongoing",
    genre: ["Comedy", "Drama"],
    poster: "/placeholder.svg?height=400&width=300&text=The+Bear",
    description: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
  },
  {
    id: 6,
    title: "Abbott Elementary",
    year: 2021,
    rating: 8.2,
    seasons: 3,
    episodes: 44,
    status: "Ongoing",
    genre: ["Comedy"],
    poster: "/placeholder.svg?height=400&width=300&text=Abbott+Elementary",
    description:
      "A mockumentary sitcom about a group of dedicated, passionate teachers and a tone-deaf principal in a Philadelphia public school.",
  },
]

const genres = ["All", "Action", "Adventure", "Comedy", "Crime", "Drama", "Family", "Fantasy", "Horror", "Sci-Fi"]
const statusOptions = ["All", "Ongoing", "Ended", "Upcoming"]
const sortOptions = ["Popular", "Rating", "Release Date", "Title A-Z", "Title Z-A"]

export default function TVShowsPage() {
  const [shows, setShows] = useState(mockTVShows)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [sortBy, setSortBy] = useState("Popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    filterAndSortShows()
  }, [searchTerm, selectedGenre, selectedStatus, sortBy])

  const filterAndSortShows = () => {
    setIsLoading(true)

    setTimeout(() => {
      const filtered = mockTVShows.filter((show) => {
        const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesGenre = selectedGenre === "All" || show.genre.includes(selectedGenre)
        const matchesStatus = selectedStatus === "All" || show.status === selectedStatus
        return matchesSearch && matchesGenre && matchesStatus
      })

      // Sort shows
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
          break
      }

      setShows(filtered)
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
            Discover <span className="gradient-text">TV Shows</span>
          </h1>
          <p className="text-[#B3B3B3] text-lg max-w-2xl">
            Explore the best TV series from around the world. From gripping dramas to hilarious comedies, find your next
            binge-worthy show.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
            <Input
              placeholder="Search TV shows..."
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

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#1F2937] border border-[#1F2937] text-white rounded-md px-3 py-2 focus:border-[#00E6E6] focus:outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

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
          <p className="text-[#B3B3B3]">{isLoading ? "Loading..." : `${shows.length} TV shows found`}</p>
        </div>

        {/* TV Shows Grid/List */}
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
            {shows.map((show) => (
              <Card key={show.id} className="movie-card bg-[#1F2937] border-[#1F2937] overflow-hidden cursor-pointer">
                <div className="relative aspect-[2/3]">
                  <Image src={show.poster || "/placeholder.svg"} alt={show.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-[#00E6E6] text-[#0B0E17] font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      {show.rating}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`font-semibold ${
                        show.status === "Ongoing"
                          ? "bg-green-500"
                          : show.status === "Ended"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      } text-white`}
                    >
                      {show.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{show.title}</h3>
                  <div className="flex items-center gap-2 text-[#B3B3B3] text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{show.year}</span>
                    <Tv className="w-4 h-4 ml-2" />
                    <span>{show.seasons}S</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {show.genre.slice(0, 2).map((g) => (
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
            {shows.map((show) => (
              <Card
                key={show.id}
                className="bg-[#1F2937] border-[#1F2937] overflow-hidden cursor-pointer hover:border-[#00E6E6] transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-24 h-36 flex-shrink-0">
                      <Image
                        src={show.poster || "/placeholder.svg"}
                        alt={show.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white">{show.title}</h3>
                        <div className="flex gap-2">
                          <Badge
                            className={`font-semibold ${
                              show.status === "Ongoing"
                                ? "bg-green-500"
                                : show.status === "Ended"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                            } text-white`}
                          >
                            {show.status}
                          </Badge>
                          <Badge className="bg-[#00E6E6] text-[#0B0E17] font-semibold">
                            <Star className="w-3 h-3 mr-1" />
                            {show.rating}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[#B3B3B3] text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{show.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tv className="w-4 h-4" />
                          <span>{show.seasons} Seasons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{show.episodes} Episodes</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {show.genre.map((g) => (
                          <Badge key={g} variant="outline" className="border-[#00E6E6] text-[#00E6E6]">
                            {g}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-[#B3B3B3] line-clamp-2">{show.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && shows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-white mb-2">No TV shows found</h3>
            <p className="text-[#B3B3B3] mb-4">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedGenre("All")
                setSelectedStatus("All")
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
