"use client"

import { useState, useEffect } from "react"
import { X, Star, Play, Plus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  searchType: "scene" | "actor" | "soundtrack" | "screenshot" | "video"
}

const mockMovies = [
  {
    id: 1,
    title: "Blade Runner 2049",
    year: 2017,
    rating: 8.0,
    genre: ["Sci-Fi", "Thriller"],
    poster: "/blade-runner-2049-poster.png",
    backdrop: "/blade-runner-2049-cityscape.png",
    description:
      "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
    confidence: 95,
    matchReason: "Scene description matches the rooftop confrontation sequence",
  },
  {
    id: 2,
    title: "The Matrix",
    year: 1999,
    rating: 8.7,
    genre: ["Action", "Sci-Fi"],
    poster: "/matrix-movie-poster.png",
    backdrop: "/matrix-digital-rain.png",
    description: "A computer programmer is led to fight an underground war against powerful computers.",
    confidence: 87,
    matchReason: "Visual elements match the digital rain sequence",
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    rating: 8.6,
    genre: ["Drama", "Sci-Fi"],
    poster: "/interstellar-inspired-poster.png",
    backdrop: "/interstellar-space.png",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    confidence: 82,
    matchReason: "Audio signature matches Hans Zimmer's score",
  },
]

export function SearchModal({ isOpen, onClose, searchQuery, searchType }: SearchModalProps) {
  const [selectedMovie, setSelectedMovie] = useState(mockMovies[0])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      // Simulate API call
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl bg-gray-900 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-xl font-semibold text-white">Search Results</h2>
              <p className="text-sm text-gray-400">
                Found {mockMovies.length} matches for "{searchQuery}"
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex">
            {/* Results List */}
            <div className="w-1/3 border-r border-gray-800 max-h-[70vh] overflow-y-auto">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex space-x-3">
                        <div className="w-16 h-24 bg-gray-700 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4" />
                          <div className="h-3 bg-gray-700 rounded w-1/2" />
                          <div className="h-3 bg-gray-700 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {mockMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => setSelectedMovie(movie)}
                      className={`flex space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMovie.id === movie.id ? "bg-teal-500/20 border border-teal-500/30" : "hover:bg-gray-800"
                      }`}
                    >
                      <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-12 h-18 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{movie.title}</h3>
                        <p className="text-sm text-gray-400">{movie.year}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-400">{movie.rating}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-teal-500/20 text-teal-400">
                            {movie.confidence}% match
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Movie Details */}
            <div className="flex-1">
              {isLoading ? (
                <div className="p-6 animate-pulse">
                  <div className="h-64 bg-gray-700 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-700 rounded w-2/3" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Backdrop */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={selectedMovie.backdrop || "/placeholder.svg"}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                        <Play className="w-6 h-6 mr-2" />
                        Watch Trailer
                      </Button>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-white">{selectedMovie.title}</h1>
                        <Badge className="bg-teal-500/20 text-teal-400">{selectedMovie.confidence}% AI Match</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{selectedMovie.year}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{selectedMovie.rating}</span>
                        </div>
                        <div className="flex space-x-1">
                          {selectedMovie.genre.map((g) => (
                            <Badge key={g} variant="outline" className="text-xs">
                              {g}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed">{selectedMovie.description}</p>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-teal-400 mb-2">Why this matches:</h3>
                      <p className="text-sm text-gray-300">{selectedMovie.matchReason}</p>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Watchlist
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        More Info
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
