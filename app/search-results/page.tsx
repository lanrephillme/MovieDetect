"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Star, Grid, List, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MovieDetailModal } from "@/components/movie-detail-modal"
import Link from "next/link"

interface SearchResult {
  id: number
  title: string
  year: number
  rating: number
  poster: string
  genre: string[]
  synopsis: string
  confidence?: number
  matchReason?: string
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [filterGenre, setFilterGenre] = useState("all")
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "text"

  useEffect(() => {
    if (query) {
      performSearch(query, type)
    }
  }, [query, type])

  const performSearch = async (searchQuery: string, searchType: string) => {
    try {
      setLoading(true)

      // TODO: Replace with actual API call based on search type
      let endpoint = "/api/search/text"
      const payload: any = { query: searchQuery }

      switch (searchType) {
        case "voice":
          endpoint = "/api/search/voice"
          break
        case "image":
          endpoint = "/api/search/image"
          break
        case "audio":
          endpoint = "/api/search/audio"
          break
        case "face":
          endpoint = "/api/search/face"
          break
        default:
          endpoint = "/api/search/text"
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Search error:", error)
      // Fallback mock data for demo
      setResults([
        {
          id: 1,
          title: "Blade Runner 2049",
          year: 2017,
          rating: 8.0,
          poster: "/blade-runner-2049-poster.png",
          genre: ["Sci-Fi", "Thriller"],
          synopsis:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
          confidence: 95,
          matchReason: "Scene description matches the rooftop confrontation sequence",
        },
        {
          id: 2,
          title: "The Matrix",
          year: 1999,
          rating: 8.7,
          poster: "/matrix-movie-poster.png",
          genre: ["Action", "Sci-Fi"],
          synopsis: "A computer programmer is led to fight an underground war against powerful computers.",
          confidence: 87,
          matchReason: "Visual elements match the digital rain sequence",
        },
        {
          id: 3,
          title: "Interstellar",
          year: 2014,
          rating: 8.6,
          poster: "/interstellar-inspired-poster.png",
          genre: ["Drama", "Sci-Fi"],
          synopsis:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          confidence: 82,
          matchReason: "Audio signature matches Hans Zimmer's score",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId)
    setIsModalOpen(true)
  }

  const filteredAndSortedResults = results
    .filter(
      (movie) => filterGenre === "all" || movie.genre.some((g) => g.toLowerCase().includes(filterGenre.toLowerCase())),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "year":
          return b.year - a.year
        case "title":
          return a.title.localeCompare(b.title)
        case "confidence":
          return (b.confidence || 0) - (a.confidence || 0)
        default:
          return (b.confidence || 0) - (a.confidence || 0)
      }
    })

  const genres = Array.from(new Set(results.flatMap((movie) => movie.genre)))

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
                <h1 className="text-3xl md:text-4xl font-bold text-white">Search Results</h1>
                <p className="text-gray-400 mt-2">
                  Found {filteredAndSortedResults.length} results for "{query}"
                </p>
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
                    value={query}
                    placeholder="Refine your search..."
                    className="pl-10 bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                    readOnly
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filterGenre}
                  onChange={(e) => setFilterGenre(e.target.value)}
                  className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-teal-400 focus:ring-teal-400/20"
                >
                  <option value="all">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-teal-400 focus:ring-teal-400/20"
                >
                  <option value="relevance">Relevance</option>
                  <option value="confidence">AI Confidence</option>
                  <option value="rating">Rating</option>
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-gray-800 rounded-lg animate-pulse">
                    <div className="h-64 bg-gray-700 rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-700 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedResults.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white">
                    Back to Search
                  </Button>
                </Link>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedResults.map((movie) => (
                  <Card
                    key={movie.id}
                    className="bg-black/40 backdrop-blur-md border-gray-800 group hover:border-teal-500/50 transition-all duration-300 cursor-pointer"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-full h-64 object-cover rounded-t-lg"
                        />
                        {movie.confidence && (
                          <Badge className="absolute top-2 right-2 bg-teal-500/80 text-white">
                            {movie.confidence}% match
                          </Badge>
                        )}
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
                        {movie.matchReason && <p className="text-xs text-teal-400 line-clamp-2">{movie.matchReason}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedResults.map((movie) => (
                  <Card
                    key={movie.id}
                    className="bg-black/40 backdrop-blur-md border-gray-800 hover:border-teal-500/50 transition-all duration-300 cursor-pointer"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        <img
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          className="w-24 h-36 object-cover rounded-lg flex-shrink-0"
                        />

                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-white">{movie.title}</h3>
                              <p className="text-gray-400">{movie.year}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white">{movie.rating}</span>
                              </div>
                              {movie.confidence && (
                                <Badge className="bg-teal-500/20 text-teal-400">{movie.confidence}% match</Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {movie.genre.map((g) => (
                              <Badge key={g} variant="outline" className="border-gray-600 text-gray-400">
                                {g}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-gray-300 line-clamp-2">{movie.synopsis}</p>

                          {movie.matchReason && (
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-sm text-teal-400 font-medium">Why this matches:</p>
                              <p className="text-sm text-gray-300">{movie.matchReason}</p>
                            </div>
                          )}
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

      <MovieDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} movieId={selectedMovieId} />
    </div>
  )
}
