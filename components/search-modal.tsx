"use client"

import { useState, useEffect } from "react"
import { X, Search, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MovieDetailModal } from "@/components/movie-detail-modal"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  searchType: string
  audioFile?: File
  imageFile?: File
  videoFile?: File
}

interface SearchResult {
  id: number
  title: string
  year: number
  rating: number
  poster: string
  genre: string[]
  synopsis: string
  confidence: number
  matchReason: string
}

export function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  searchType,
  audioFile,
  imageFile,
  videoFile,
}: SearchModalProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchMetadata, setSearchMetadata] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      performSearch()
    }
  }, [isOpen, searchQuery, searchType, audioFile, imageFile, videoFile])

  const performSearch = async () => {
    if (!searchQuery && !audioFile && !imageFile && !videoFile) return

    try {
      setLoading(true)
      setError(null)
      setResults([])

      let endpoint = "/api/search/text"
      let body: any = null
      let headers: any = {}

      // Determine endpoint and prepare request based on search type
      switch (searchType) {
        case "soundtrack":
          endpoint = "/api/search/audio"
          body = new FormData()
          if (audioFile) {
            body.append("audio", audioFile)
          }
          break

        case "screenshot":
          endpoint = "/api/search/image"
          body = new FormData()
          if (imageFile) {
            body.append("image", imageFile)
          }
          break

        case "video":
          endpoint = "/api/search/video"
          body = new FormData()
          if (videoFile) {
            body.append("video", videoFile)
          }
          break

        case "scene":
        case "actor":
        default:
          endpoint = "/api/search/text"
          headers = { "Content-Type": "application/json" }
          body = JSON.stringify({
            query: searchQuery,
            type: searchType,
          })
          break
      }

      console.log(`[SEARCH MODAL] Performing ${searchType} search...`)

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body,
      })

      const data = await response.json()

      if (data.success) {
        setResults(data.data || [])
        setSearchMetadata({
          searchType: data.searchType,
          total: data.total,
          apiUsed: data.apiUsed,
          transcribedText: data.transcribedText,
          detectedObjects: data.detectedObjects,
          detectedText: data.detectedText,
          identifiedTrack: data.identifiedTrack,
          searchTerms: data.searchTerms,
        })
      } else {
        throw new Error(data.error || "Search failed")
      }
    } catch (error) {
      console.error("Search error:", error)
      setError(error instanceof Error ? error.message : "An error occurred during search")

      // Show alternative suggestions on error
      setResults([
        {
          id: 999,
          title: "The Matrix",
          year: 1999,
          rating: 8.7,
          poster: "/matrix-movie-poster.png",
          genre: ["Action", "Sci-Fi"],
          synopsis:
            "A computer programmer is led to fight an underground war against powerful computers who have constructed a false reality.",
          confidence: 75,
          matchReason: "Alternative suggestion - popular sci-fi movie",
        },
        {
          id: 998,
          title: "Blade Runner 2049",
          year: 2017,
          rating: 8.0,
          poster: "/blade-runner-2049-poster.png",
          genre: ["Sci-Fi", "Thriller"],
          synopsis: "A young blade runner discovers a secret that leads him to search for Rick Deckard.",
          confidence: 72,
          matchReason: "Alternative suggestion - similar themes",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = (movieId: number, confidence?: number) => {
    setSelectedMovieId(movieId)
    setIsDetailModalOpen(true)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500"
    if (confidence >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getSearchTypeLabel = (type: string) => {
    const labels = {
      scene: "Scene Description",
      actor: "Actor Search",
      soundtrack: "Audio Recognition",
      screenshot: "Image Recognition",
      video: "Video Analysis",
    }
    return labels[type as keyof typeof labels] || type
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-6xl bg-gray-900 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white">Search Results</h2>
                <p className="text-gray-400 mt-1">
                  {getSearchTypeLabel(searchType)} • {loading ? "Searching..." : `${results.length} results found`}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-800">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Search Metadata */}
            {searchMetadata && (
              <div className="p-4 bg-gray-800 border-b border-gray-700">
                <div className="flex flex-wrap gap-4 text-sm">
                  {searchMetadata.transcribedText && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-blue-500 text-blue-400">
                        Voice
                      </Badge>
                      <span className="text-gray-300">"{searchMetadata.transcribedText}"</span>
                    </div>
                  )}
                  {searchMetadata.identifiedTrack && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        Audio
                      </Badge>
                      <span className="text-gray-300">
                        {searchMetadata.identifiedTrack.title} by {searchMetadata.identifiedTrack.artist}
                      </span>
                    </div>
                  )}
                  {searchMetadata.detectedObjects && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        Objects
                      </Badge>
                      <span className="text-gray-300">{searchMetadata.detectedObjects.slice(0, 3).join(", ")}</span>
                    </div>
                  )}
                  {searchMetadata.apiUsed && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-gray-500 text-gray-400">
                        API
                      </Badge>
                      <span className="text-gray-300">{searchMetadata.apiUsed}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
                  <p className="text-white text-lg">Analyzing your {searchType} search...</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {searchType === "soundtrack" && "Identifying audio track..."}
                    {searchType === "screenshot" && "Analyzing image content..."}
                    {searchType === "video" && "Processing video frames..."}
                    {(searchType === "scene" || searchType === "actor") && "Searching movie database..."}
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-white text-lg mb-2">Search Error</p>
                  <p className="text-gray-400 text-center mb-6">{error}</p>
                  <Button onClick={performSearch} className="bg-teal-600 hover:bg-teal-700">
                    Try Again
                  </Button>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Search className="w-12 h-12 text-gray-500 mb-4" />
                  <p className="text-white text-lg mb-2">No Results Found</p>
                  <p className="text-gray-400 text-center mb-6">
                    We couldn't find any movies matching your search. Try a different approach or check our suggestions
                    below.
                  </p>
                  <Button onClick={onClose} variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    Try Another Search
                  </Button>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-white font-medium">
                        Found {results.length} matching movie{results.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {results.some((r) => r.confidence < 60) && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Some results have low confidence
                      </Badge>
                    )}
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((movie) => (
                      <Card
                        key={movie.id}
                        className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-all duration-300 group"
                        onClick={() => handleMovieClick(movie.id, movie.confidence)}
                      >
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={movie.poster || "/placeholder.svg"}
                              alt={movie.title}
                              className="w-full h-64 object-cover rounded-t-lg"
                            />
                            <Badge
                              className={`absolute top-2 right-2 ${getConfidenceColor(movie.confidence)} text-white`}
                            >
                              {movie.confidence}% match
                              {movie.confidence < 60 && " ⚠️"}
                            </Badge>
                          </div>

                          <div className="p-4 space-y-3">
                            <div>
                              <h3 className="font-semibold text-white text-lg group-hover:text-teal-400 transition-colors">
                                {movie.title}
                              </h3>
                              <p className="text-gray-400 text-sm">{movie.year}</p>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {movie.genre.slice(0, 3).map((g) => (
                                <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-400">
                                  {g}
                                </Badge>
                              ))}
                            </div>

                            <p className="text-gray-300 text-sm line-clamp-2">{movie.synopsis}</p>

                            {movie.matchReason && (
                              <div className="bg-gray-700/50 rounded-lg p-3">
                                <p className="text-xs text-teal-400 font-medium">Why this matches:</p>
                                <p className="text-xs text-gray-300 mt-1">{movie.matchReason}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-white text-sm">{movie.rating}</span>
                              </div>
                              <Button
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-700 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <MovieDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        movieId={selectedMovieId}
        searchType={searchType}
        confidenceScore={results.find((r) => r.id === selectedMovieId)?.confidence}
      />
    </>
  )
}
