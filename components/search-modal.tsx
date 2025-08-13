"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Mic, ImageIcon, Video, User, Upload, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoviePreviewModal } from "@/components/movie-preview-modal"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  searchType: "scene" | "actor" | "soundtrack" | "screenshot" | "video"
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

export function SearchModal({ isOpen, onClose, searchQuery, searchType }: SearchModalProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedConfidence, setSelectedConfidence] = useState<number | undefined>()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState<"audio" | "video" | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      performSearch()
    }
  }, [isOpen, searchQuery, searchType])

  const performSearch = async () => {
    if (!searchQuery && !["soundtrack", "screenshot", "video"].includes(searchType)) {
      return
    }

    setLoading(true)
    setError(null)
    setResults([])

    try {
      let endpoint = "/api/search/text"
      const payload: any = { query: searchQuery, type: searchType }

      switch (searchType) {
        case "scene":
          endpoint = "/api/search/text"
          payload.type = "scene"
          break
        case "actor":
          endpoint = "/api/search/text"
          payload.type = "actor"
          break
        case "soundtrack":
          endpoint = "/api/search/audio"
          break
        case "screenshot":
          endpoint = "/api/search/image"
          break
        case "video":
          endpoint = "/api/search/video"
          break
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data) {
        setResults(data.data)

        // If no results found, show AI alternative suggestions
        if (data.data.length === 0) {
          await fetchAlternativeSuggestions()
        }
      } else {
        throw new Error(data.error || "Search failed")
      }
    } catch (error) {
      console.error("Search error:", error)
      setError(error instanceof Error ? error.message : "Search failed")

      // Show fallback results for demo
      setResults([
        {
          id: 1,
          title: "Blade Runner 2049",
          year: 2017,
          rating: 8.0,
          poster: "/blade-runner-2049-poster.png",
          genre: ["Sci-Fi", "Thriller"],
          synopsis: "A young blade runner's discovery leads him to track down former blade runner Rick Deckard.",
          confidence: 85,
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
          confidence: 72,
          matchReason: "Visual elements match the digital rain sequence",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchAlternativeSuggestions = async () => {
    try {
      const response = await fetch("/api/search/alternatives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalQuery: searchQuery,
          searchType,
          reason: "no_results_found",
        }),
      })

      const data = await response.json()
      if (data.success && data.suggestions) {
        setResults(data.suggestions)
      }
    } catch (error) {
      console.error("Error fetching alternatives:", error)
    }
  }

  const handleMovieClick = (movie: SearchResult) => {
    setSelectedMovieId(movie.id)
    setSelectedConfidence(movie.confidence)
    setIsPreviewOpen(true)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      let endpoint = "/api/search/image"
      if (file.type.startsWith("audio/")) {
        endpoint = "/api/search/audio"
      } else if (file.type.startsWith("video/")) {
        endpoint = "/api/search/video"
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.data) {
        setResults(data.data)
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const startRecording = async (type: "audio" | "video") => {
    try {
      setRecordingType(type)
      setIsRecording(true)

      const constraints = type === "audio" ? { audio: true } : { video: true, audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, {
          type: type === "audio" ? "audio/webm" : "video/webm",
        })
        await uploadRecording(blob, type)
      }

      mediaRecorder.start()

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopRecording()
        }
      }, 30000)
    } catch (error) {
      console.error("Recording error:", error)
      setError("Failed to start recording. Please check your permissions.")
      setIsRecording(false)
      setRecordingType(null)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setIsRecording(false)
    setRecordingType(null)
  }

  const uploadRecording = async (blob: Blob, type: "audio" | "video") => {
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", blob, `recording.${type === "audio" ? "webm" : "webm"}`)

      const endpoint = type === "audio" ? "/api/search/audio" : "/api/search/video"

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Recording upload failed: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.data) {
        setResults(data.data)
      } else {
        throw new Error(data.error || "Recording processing failed")
      }
    } catch (error) {
      console.error("Recording upload error:", error)
      setError(error instanceof Error ? error.message : "Recording upload failed")
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

  const getSearchTypeIcon = () => {
    switch (searchType) {
      case "scene":
        return Search
      case "actor":
        return User
      case "soundtrack":
        return Mic
      case "screenshot":
        return ImageIcon
      case "video":
        return Video
      default:
        return Search
    }
  }

  if (!isOpen) return null

  const SearchIcon = getSearchTypeIcon()

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <SearchIcon className="w-6 h-6 text-teal-400" />
                <h2 className="text-2xl font-bold text-white">{getSearchTypeLabel()} Results</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Search Info */}
              {searchQuery && (
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300">
                    <span className="text-teal-400 font-medium">Search Query:</span> "{searchQuery}"
                  </p>
                </div>
              )}

              {/* Recording Controls */}
              {(searchType === "soundtrack" || searchType === "video") && !searchQuery && (
                <div className="mb-6 p-6 bg-gray-800 rounded-lg text-center">
                  <h3 className="text-white font-semibold mb-4">
                    {searchType === "soundtrack" ? "Record Audio" : "Record Video"}
                  </h3>

                  {!isRecording ? (
                    <div className="space-y-4">
                      <Button
                        onClick={() => startRecording(searchType === "soundtrack" ? "audio" : "video")}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>

                      <div className="text-gray-400 text-sm">
                        <p>Or upload a file:</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={searchType === "soundtrack" ? "audio/*" : "video/*"}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white">Recording {recordingType}...</span>
                      </div>
                      <Button
                        onClick={stopRecording}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-transparent"
                      >
                        Stop Recording
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">Uploading...</span>
                    <span className="text-teal-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
                  <p className="text-white text-lg">
                    {searchType === "soundtrack"
                      ? "Analyzing audio..."
                      : searchType === "screenshot"
                        ? "Processing image..."
                        : searchType === "video"
                          ? "Analyzing video..."
                          : "Searching movies..."}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 font-medium">Search Error</p>
                  </div>
                  <p className="text-gray-300 mt-2">{error}</p>
                  <Button
                    onClick={performSearch}
                    variant="outline"
                    size="sm"
                    className="mt-3 border-red-400 text-red-400 hover:bg-red-400/10 bg-transparent"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      Found {results.length} result{results.length !== 1 ? "s" : ""}
                    </h3>
                    {results.length > 0 && (
                      <Button
                        onClick={() =>
                          router.push(`/search-results?q=${encodeURIComponent(searchQuery)}&type=${searchType}`)
                        }
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                      >
                        View All Results
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.slice(0, 4).map((movie) => (
                      <Card
                        key={movie.id}
                        className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-all duration-200 group"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            <img
                              src={movie.poster || "/placeholder.svg"}
                              alt={movie.title}
                              className="w-20 h-30 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                                  {movie.title}
                                </h4>
                                <Badge
                                  className={`ml-2 ${
                                    movie.confidence >= 80
                                      ? "bg-green-500"
                                      : movie.confidence >= 60
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  } text-white text-xs`}
                                >
                                  {movie.confidence}%
                                </Badge>
                              </div>

                              <div className="flex items-center space-x-3 text-sm text-gray-400">
                                <span>{movie.year}</span>
                                <div className="flex items-center space-x-1">
                                  <span>⭐</span>
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

                              <p className="text-gray-300 text-sm line-clamp-2">{movie.synopsis}</p>

                              {movie.matchReason && (
                                <div className="bg-gray-700/50 rounded p-2">
                                  <p className="text-teal-400 text-xs font-medium">Match Reason:</p>
                                  <p className="text-gray-300 text-xs">{movie.matchReason}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {!loading && !error && results.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No matches found</h3>
                  <p className="text-gray-400 mb-6">
                    We couldn't find any movies matching your {getSearchTypeLabel().toLowerCase()}.
                  </p>
                  <div className="space-y-3">
                    <Button onClick={performSearch} className="bg-teal-600 hover:bg-teal-700 text-white">
                      Try Different Search
                    </Button>
                    <p className="text-gray-500 text-sm">
                      Try adjusting your search terms or using a different search method.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Preview Modal */}
      <MoviePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        movieId={selectedMovieId}
        searchType={searchType}
        confidence={selectedConfidence}
      />
    </>
  )
}
