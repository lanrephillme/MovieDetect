"use client"

import { useState, useEffect } from "react"
import { X, Play, Star, Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchResult {
  id: number
  title: string
  poster: string
  backdrop: string
  rating: number
  year: number
  genre: string[]
  description: string
  duration?: number
  cast?: string[]
  director?: string
  trailer?: string
  confidence?: number
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  searchType: "scene" | "actor" | "soundtrack" | "screenshot" | "video"
}

export function SearchModal({ isOpen, onClose, searchQuery, searchType }: SearchModalProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<SearchResult | null>(null)

  useEffect(() => {
    if (isOpen && searchQuery) {
      performSearch()
    }
  }, [isOpen, searchQuery, searchType])

  const performSearch = async () => {
    setLoading(true)
    try {
      // Mock search results based on search type
      const mockResults: SearchResult[] = [
        {
          id: 1,
          title: "Blade Runner 2049",
          poster: "/blade-runner-2049-poster.png",
          backdrop: "/blade-runner-2049-cityscape.png",
          rating: 8.0,
          year: 2017,
          genre: ["Sci-Fi", "Thriller"],
          description: "A young blade runner's discovery leads him to track down former blade runner Rick Deckard.",
          duration: 164,
          cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
          director: "Denis Villeneuve",
          confidence: 95,
        },
        {
          id: 2,
          title: "Interstellar",
          poster: "/interstellar-inspired-poster.png",
          backdrop: "/interstellar-space.png",
          rating: 8.6,
          year: 2014,
          genre: ["Sci-Fi", "Drama"],
          description: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
          duration: 169,
          cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
          director: "Christopher Nolan",
          confidence: 89,
        },
        {
          id: 3,
          title: "The Matrix",
          poster: "/matrix-movie-poster.png",
          backdrop: "/matrix-digital-rain.png",
          rating: 8.7,
          year: 1999,
          genre: ["Sci-Fi", "Action"],
          description: "A computer programmer discovers reality is a simulation and joins a rebellion.",
          duration: 136,
          cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
          director: "The Wachowskis",
          confidence: 87,
        },
      ]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setResults(mockResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "scene":
        return "Scene Description"
      case "actor":
        return "Actor/Actress"
      case "soundtrack":
        return "Audio/Soundtrack"
      case "screenshot":
        return "Image/Screenshot"
      case "video":
        return "Video Clip"
      default:
        return "Search"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-white">Search Results</h2>
              <p className="text-gray-400 text-sm">
                {getSearchTypeLabel()}: "{searchQuery}"
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-4 animate-pulse">
                    <div className="w-24 h-36 bg-gray-800 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-800 rounded w-1/3" />
                      <div className="h-4 bg-gray-800 rounded w-1/4" />
                      <div className="h-4 bg-gray-800 rounded w-full" />
                      <div className="h-4 bg-gray-800 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-24 h-36 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=144&width=96&query=${encodeURIComponent(movie.title)}`
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{movie.title}</h3>
                        {movie.confidence && (
                          <Badge variant="secondary" className="bg-teal-600 text-white">
                            {movie.confidence}% Match
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mb-2 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{movie.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{movie.year}</span>
                        </div>
                        {movie.duration && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{movie.duration}min</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {movie.genre.map((g) => (
                          <Badge key={g} variant="outline" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">{movie.description}</p>
                      {movie.cast && (
                        <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                          <Users className="w-3 h-3" />
                          <span>{movie.cast.slice(0, 3).join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No results found</div>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search terms or using a different search method
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={selectedMovie.backdrop || selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMovie(null)}
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedMovie.title}</h2>
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{selectedMovie.rating}</span>
                  </div>
                  <span>{selectedMovie.year}</span>
                  {selectedMovie.duration && <span>{selectedMovie.duration}min</span>}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMovie.genre.map((g) => (
                    <Badge key={g} variant="outline">
                      {g}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">{selectedMovie.description}</p>
                {selectedMovie.director && (
                  <p className="text-gray-400 text-sm mb-2">
                    <span className="font-semibold">Director:</span> {selectedMovie.director}
                  </p>
                )}
                {selectedMovie.cast && (
                  <p className="text-gray-400 text-sm mb-4">
                    <span className="font-semibold">Cast:</span> {selectedMovie.cast.join(", ")}
                  </p>
                )}
                <div className="flex space-x-3">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Trailer
                  </Button>
                  <Button variant="outline">Add to Watchlist</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
