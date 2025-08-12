"use client"

import { useState } from "react"
import { Search, Grid, List, Star, Play, Trash2, Eye, Calendar, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const watchlistMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.8,
    poster: "/dune-part-two-poster.png",
    genre: ["Sci-Fi", "Adventure"],
    runtime: 166,
    addedDate: "2024-01-15",
    watched: false,
    category: "Want to Watch",
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    rating: 8.4,
    poster: "/images/posters/oppenheimer-poster.png",
    genre: ["Biography", "Drama"],
    runtime: 180,
    addedDate: "2024-01-10",
    watched: true,
    category: "Watched",
  },
  {
    id: 3,
    title: "The Batman",
    year: 2022,
    rating: 7.8,
    poster: "/batman-2022-poster.png",
    genre: ["Action", "Crime"],
    runtime: 176,
    addedDate: "2024-01-08",
    watched: false,
    category: "Currently Watching",
  },
  {
    id: 4,
    title: "Blade Runner 2049",
    year: 2017,
    rating: 8.0,
    poster: "/blade-runner-2049-poster.png",
    genre: ["Sci-Fi", "Thriller"],
    runtime: 164,
    addedDate: "2024-01-05",
    watched: true,
    category: "Favorites",
  },
]

const categories = ["All", "Want to Watch", "Currently Watching", "Watched", "Favorites"]
const sortOptions = [
  "Recently Added",
  "Title A-Z",
  "Title Z-A",
  "Rating High-Low",
  "Rating Low-High",
  "Year New-Old",
  "Year Old-New",
]

export default function WatchlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("Recently Added")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [movies, setMovies] = useState(watchlistMovies)

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || movie.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const removeFromWatchlist = (movieId: number) => {
    setMovies(movies.filter((movie) => movie.id !== movieId))
  }

  const toggleWatched = (movieId: number) => {
    setMovies(
      movies.map((movie) =>
        movie.id === movieId
          ? { ...movie, watched: !movie.watched, category: movie.watched ? "Want to Watch" : "Watched" }
          : movie,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 via-black to-emerald-900/10" />

      <div className="relative">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 backdrop-blur-md bg-black/30">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              MovieDetect
            </span>
          </Link>

          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-teal-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </nav>

        {/* Header */}
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">My Watchlist</h1>
                <p className="text-gray-400 mt-2">{filteredMovies.length} movies in your collection</p>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                      : "border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                  }
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                      : "border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your watchlist..."
                    className="pl-10 bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                        : "border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-teal-400 focus:ring-teal-400/20"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option} className="bg-black">
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Movies Grid/List */}
        <div className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {filteredMovies.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Start building your watchlist by searching for movies"}
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white">
                    Discover Movies
                  </Button>
                </Link>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.map((movie) => (
                  <Card
                    key={movie.id}
                    className="bg-black/40 backdrop-blur-md border-gray-800 group hover:border-teal-500/50 transition-all duration-300"
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-64 object-cover rounded-t-lg"
                        />

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-white text-black hover:bg-gray-200"
                              onClick={() => console.log("Play movie")}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              {movie.watched ? "Watch Again" : "Watch Now"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-400 text-white hover:border-red-400 hover:text-red-400 bg-transparent"
                              onClick={() => removeFromWatchlist(movie.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Status badge */}
                        <Badge
                          className={`absolute top-2 right-2 ${
                            movie.watched ? "bg-green-500/80" : "bg-blue-500/80"
                          } text-white`}
                        >
                          {movie.watched ? "Watched" : "Unwatched"}
                        </Badge>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-white text-sm line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{movie.year}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{movie.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {movie.genre.slice(0, 2).map((g) => (
                            <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-400">
                              {g}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMovies.map((movie) => (
                  <Card
                    key={movie.id}
                    className="bg-black/40 backdrop-blur-md border-gray-800 hover:border-teal-500/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                              <p className="text-gray-400">{movie.year}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-white">{movie.rating}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {movie.genre.map((g) => (
                              <Badge key={g} variant="outline" className="border-gray-600 text-gray-400">
                                {g}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{movie.runtime} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Added {movie.addedDate}</span>
                            </div>
                            <Badge className={movie.watched ? "bg-green-500/80" : "bg-blue-500/80"}>
                              {movie.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                            onClick={() => console.log("Play movie")}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            {movie.watched ? "Watch Again" : "Watch Now"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                            onClick={() => toggleWatched(movie.id)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Mark as {movie.watched ? "Unwatched" : "Watched"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-transparent"
                            onClick={() => removeFromWatchlist(movie.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
