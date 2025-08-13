"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Mic, Camera, Upload, Video, Music, X, Loader2, AlertCircle, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MovieDetailModal } from "./movie-detail-modal"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery?: string
  searchType?: string
}

interface SearchResult {
  id: number
  title: string
  poster: string
  year: number
  rating: number
  genre: string[]
  synopsis: string
  confidence: number
  matchReason: string
}

interface SearchResponse {
  success: boolean
  results: SearchResult[]
  searchType: string
  confidenceScore: number
  metadata: {
    searchMethod: string
    transcribedText?: string
    detectedObjects?: string[]
    recognizedTrack?: string
    detectedScenes?: string[]
    [key: string]: any
  }
  error?: string
}

export function SearchModal({
  isOpen,
  onClose,
  searchQuery: initialQuery = "",
  searchType: initialType = "",
}: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<"text" | "voice" | "image" | "audio" | "video">("text")
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchType, setSearchType] = useState<"scene" | "actor">("scene")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setSearchResults(null)
      setSearchQuery("")
      setIsRecording(false)
      setRecordingTime(0)
      setUploadProgress(0)
      setDragOver(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
    }
  }, [initialQuery])

  const handleTextSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/search/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, searchType }),
      })

      const data: SearchResponse = await response.json()
      setSearchResults(data)

      // Auto-open first result if high confidence
      if (data.success && data.results.length > 0 && data.confidenceScore >= 80) {
        setTimeout(() => {
          handleMovieClick(data.results[0].id, data.confidenceScore)
        }, 500)
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults({
        success: false,
        results: [],
        searchType: "text",
        confidenceScore: 0,
        metadata: { searchMethod: "Text Search" },
        error: "Search failed. Please try again.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleVoiceSearch = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Voice recording is not supported in your browser")
      return
    }

    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      setIsRecording(false)
      setRecordingTime(0)
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        recordedChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/wav" })
          await processVoiceSearch(audioBlob)
          stream.getTracks().forEach((track) => track.stop())
        }

        mediaRecorder.start()
        setIsRecording(true)
        setRecordingTime(0)

        // Start recording timer
        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      } catch (error) {
        console.error("Error accessing microphone:", error)
        alert("Could not access microphone. Please check your permissions.")
      }
    }
  }

  const processVoiceSearch = async (audioBlob: Blob) => {
    setIsSearching(true)
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const response = await fetch("/api/search/voice", {
        method: "POST",
        body: formData,
      })

      const data: SearchResponse = await response.json()
      setSearchResults(data)

      // Auto-open first result if high confidence
      if (data.success && data.results.length > 0 && data.confidenceScore >= 75) {
        setTimeout(() => {
          handleMovieClick(data.results[0].id, data.confidenceScore)
        }, 1000)
      }
    } catch (error) {
      console.error("Voice search error:", error)
      setSearchResults({
        success: false,
        results: [],
        searchType: "voice",
        confidenceScore: 0,
        metadata: { searchMethod: "Voice Search" },
        error: "Voice search failed. Please try again.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleFileUpload = async (file: File, type: "image" | "audio" | "video") => {
    setIsSearching(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append(type, file)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(`/api/search/${type}`, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data: SearchResponse = await response.json()
      setSearchResults(data)

      // Auto-open first result if high confidence
      if (data.success && data.results.length > 0 && data.confidenceScore >= 70) {
        setTimeout(() => {
          handleMovieClick(data.results[0].id, data.confidenceScore)
        }, 800)
      }
    } catch (error) {
      console.error(`${type} search error:`, error)
      setSearchResults({
        success: false,
        results: [],
        searchType: type,
        confidenceScore: 0,
        metadata: { searchMethod: `${type.charAt(0).toUpperCase() + type.slice(1)} Search` },
        error: `${type.charAt(0).toUpperCase() + type.slice(1)} search failed. Please try again.`,
      })
    } finally {
      setIsSearching(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent, type: "image" | "audio" | "video") => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file) {
      const validTypes = {
        image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        audio: ["audio/mpeg", "audio/wav", "audio/mp3", "audio/m4a"],
        video: ["video/mp4", "video/mov", "video/avi", "video/webm"],
      }

      if (validTypes[type].some((validType) => file.type.startsWith(validType.split("/")[0]))) {
        handleFileUpload(file, type)
      } else {
        alert(`Please upload a valid ${type} file`)
      }
    }
  }

  const handleMovieClick = (movieId: number, confidence?: number) => {
    setSelectedMovieId(movieId)
    setShowMovieModal(true)
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Search Movies</h2>
                <p className="text-gray-600 mt-1">Use any method to find the perfect movie</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Search Method Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              {[
                { id: "text", label: "Text Search", icon: Search, desc: "Scene or actor" },
                { id: "voice", label: "Voice", icon: Mic, desc: "Speak your search" },
                { id: "image", label: "Image", icon: Camera, desc: "Upload screenshot" },
                { id: "audio", label: "Audio", icon: Music, desc: "Soundtrack clip" },
                { id: "video", label: "Video", icon: Video, desc: "Movie scene" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center space-y-2 px-4 py-4 border-b-2 font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-teal-500 text-teal-600 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <div className="text-center">
                    <div className="text-sm font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-400">{tab.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Search Content */}
            <div className="p-8">
              {activeTab === "text" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Text Search</h3>
                    <p className="text-gray-600">Describe a scene or search by actor name</p>
                  </div>

                  <div className="flex justify-center space-x-4 mb-6">
                    <Button
                      variant={searchType === "scene" ? "default" : "outline"}
                      onClick={() => setSearchType("scene")}
                      className={searchType === "scene" ? "bg-teal-600 hover:bg-teal-700" : ""}
                    >
                      Scene Description
                    </Button>
                    <Button
                      variant={searchType === "actor" ? "default" : "outline"}
                      onClick={() => setSearchType("actor")}
                      className={searchType === "actor" ? "bg-teal-600 hover:bg-teal-700" : ""}
                    >
                      Actor/Actress
                    </Button>
                  </div>

                  <div className="max-w-2xl mx-auto">
                    <div className="flex space-x-3">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          searchType === "scene"
                            ? "e.g., 'Two people meet in a train station during a snowstorm'"
                            : "e.g., 'Ryan Gosling' or 'Tom Hanks'"
                        }
                        onKeyPress={(e) => e.key === "Enter" && handleTextSearch()}
                        className="flex-1 h-12 text-lg"
                        disabled={isSearching}
                      />
                      <Button
                        onClick={handleTextSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="h-12 px-8 bg-teal-600 hover:bg-teal-700"
                      >
                        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "voice" && (
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Voice Search</h3>
                    <p className="text-gray-600">Describe the movie you're looking for using your voice</p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-50 rounded-xl p-8">
                      {isRecording && (
                        <div className="mb-4">
                          <div className="text-2xl font-mono text-teal-600 mb-2">
                            {formatRecordingTime(recordingTime)}
                          </div>
                          <div className="flex justify-center">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-teal-500 rounded-full animate-pulse"
                                  style={{
                                    height: `${Math.random() * 20 + 10}px`,
                                    animationDelay: `${i * 0.1}s`,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleVoiceSearch}
                        disabled={isSearching}
                        className={`w-24 h-24 rounded-full text-white text-lg font-medium transition-all duration-200 ${
                          isRecording
                            ? "bg-red-500 hover:bg-red-600 animate-pulse"
                            : "bg-teal-600 hover:bg-teal-700 hover:scale-105"
                        }`}
                      >
                        {isSearching ? (
                          <Loader2 className="w-8 h-8 animate-spin" />
                        ) : isRecording ? (
                          <StopCircle className="w-8 h-8" />
                        ) : (
                          <Mic className="w-8 h-8" />
                        )}
                      </Button>

                      <p className="text-sm text-gray-500 mt-4">
                        {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === "image" || activeTab === "audio" || activeTab === "video") && (
                <div className="text-center space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Search
                    </h3>
                    <p className="text-gray-600">
                      Upload{" "}
                      {activeTab === "image"
                        ? "a screenshot, poster, or scene image"
                        : activeTab === "audio"
                          ? "a soundtrack, dialogue, or sound effect clip"
                          : "a movie clip or trailer"}
                    </p>
                  </div>

                  <div className="max-w-lg mx-auto">
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
                        dragOver ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, activeTab as "image" | "audio" | "video")}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={activeTab === "image" ? "image/*" : activeTab === "audio" ? "audio/*" : "video/*"}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(file, activeTab as "image" | "audio" | "video")
                          }
                        }}
                        className="hidden"
                      />

                      {isSearching ? (
                        <div className="space-y-4">
                          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto" />
                          <div>
                            <p className="text-gray-600 mb-2">
                              {activeTab === "image"
                                ? "Analyzing image..."
                                : activeTab === "audio"
                                  ? "Identifying audio..."
                                  : "Processing video..."}
                            </p>
                            {uploadProgress > 0 && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto text-gray-400">
                            {activeTab === "image" && <Camera className="w-full h-full" />}
                            {activeTab === "audio" && <Music className="w-full h-full" />}
                            {activeTab === "video" && <Video className="w-full h-full" />}
                          </div>
                          <div>
                            <p className="text-lg font-medium text-gray-900 mb-2">Drop your {activeTab} here</p>
                            <p className="text-gray-500 mb-4">or</p>
                            <Button
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-teal-600 hover:bg-teal-700"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose {activeTab} file
                            </Button>
                          </div>
                          <p className="text-xs text-gray-400">
                            {activeTab === "image" && "Supports: JPG, PNG, GIF, WebP"}
                            {activeTab === "audio" && "Supports: MP3, WAV, M4A"}
                            {activeTab === "video" && "Supports: MP4, MOV, AVI, WebM"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults && (
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900">Search Results</h3>
                    {searchResults.confidenceScore > 0 && (
                      <Badge
                        className={`${getConfidenceColor(searchResults.confidenceScore)} text-white text-sm px-3 py-1`}
                      >
                        {searchResults.confidenceScore}% Match
                        {searchResults.confidenceScore < 60 && " ⚠️"}
                      </Badge>
                    )}
                  </div>

                  {/* Search Metadata */}
                  {searchResults.metadata && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Search Method:</span>
                          <span className="ml-2 text-gray-600">{searchResults.metadata.searchMethod}</span>
                        </div>
                        {searchResults.metadata.transcribedText && (
                          <div>
                            <span className="font-medium text-gray-700">Transcribed:</span>
                            <span className="ml-2 text-gray-600">"{searchResults.metadata.transcribedText}"</span>
                          </div>
                        )}
                        {searchResults.metadata.detectedObjects && (
                          <div>
                            <span className="font-medium text-gray-700">Detected:</span>
                            <span className="ml-2 text-gray-600">
                              {searchResults.metadata.detectedObjects.slice(0, 3).join(", ")}
                            </span>
                          </div>
                        )}
                        {searchResults.metadata.recognizedTrack && (
                          <div>
                            <span className="font-medium text-gray-700">Audio:</span>
                            <span className="ml-2 text-gray-600">{searchResults.metadata.recognizedTrack}</span>
                          </div>
                        )}
                        {searchResults.metadata.detectedScenes && (
                          <div>
                            <span className="font-medium text-gray-700">Scenes:</span>
                            <span className="ml-2 text-gray-600">
                              {searchResults.metadata.detectedScenes.slice(0, 3).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {searchResults.success && searchResults.results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {searchResults.results.map((movie, index) => (
                        <Card
                          key={movie.id}
                          className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-gray-200 hover:border-teal-300"
                          onClick={() => handleMovieClick(movie.id, movie.confidence)}
                        >
                          <CardContent className="p-0">
                            <div className="relative">
                              <img
                                src={movie.poster || "/placeholder.svg"}
                                alt={movie.title}
                                className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                              />
                              <Badge
                                className={`absolute top-3 right-3 ${getConfidenceColor(movie.confidence)} text-white text-xs`}
                              >
                                {movie.confidence}% match
                                {movie.confidence < 60 && " ⚠️"}
                              </Badge>
                              {index === 0 && searchResults.confidenceScore >= 80 && (
                                <Badge className="absolute top-3 left-3 bg-green-600 text-white text-xs">
                                  Best Match
                                </Badge>
                              )}
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                {movie.title}
                              </h4>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">{movie.year}</span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-yellow-500">★</span>
                                  <span className="text-sm text-gray-600">{movie.rating}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {movie.genre.slice(0, 3).map((g) => (
                                  <Badge key={g} variant="outline" className="text-xs border-gray-300 text-gray-600">
                                    {g}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{movie.synopsis}</p>
                              {movie.matchReason && (
                                <div className="bg-teal-50 border border-teal-200 rounded-lg p-2">
                                  <p className="text-xs text-teal-700 font-medium">Why this matches:</p>
                                  <p className="text-xs text-teal-600 mt-1">{movie.matchReason}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : searchResults.error ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Search Failed</h4>
                      <p className="text-gray-600 mb-4">{searchResults.error}</p>
                      <Button
                        onClick={() => setSearchResults(null)}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:border-gray-400"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h4>
                      <p className="text-gray-600 mb-4">
                        We couldn't find any movies matching your search. Try a different approach or refine your search
                        terms.
                      </p>
                      <div className="flex justify-center space-x-3">
                        <Button
                          onClick={() => setSearchResults(null)}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:border-gray-400"
                        >
                          Try Different Search
                        </Button>
                        <Button onClick={() => setActiveTab("text")} className="bg-teal-600 hover:bg-teal-700">
                          Text Search Instead
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Detail Modal */}
      <MovieDetailModal
        isOpen={showMovieModal}
        onClose={() => {
          setShowMovieModal(false)
          setSelectedMovieId(null)
        }}
        movieId={selectedMovieId}
        searchType={searchResults?.metadata.searchMethod}
        confidenceScore={searchResults?.confidenceScore}
      />
    </>
  )
}
