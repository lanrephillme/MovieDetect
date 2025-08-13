"use client"

import { useState, useRef } from "react"
import { Search, Mic, Camera, Upload, Video, Music, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MovieDetailModal } from "./movie-detail-modal"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: number
  title: string
  poster: string
  year: number
  rating: number
}

interface SearchResponse {
  success: boolean
  results: SearchResult[]
  searchType: string
  confidenceScore: number
  metadata: {
    searchMethod: string
    [key: string]: any
  }
  error?: string
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [activeTab, setActiveTab] = useState<"text" | "voice" | "image" | "audio" | "video">("text")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"scene" | "actor">("scene")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

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
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
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
      } catch (error) {
        console.error("Error accessing microphone:", error)
        alert("Could not access microphone")
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
    try {
      const formData = new FormData()
      formData.append(type, file)

      const response = await fetch(`/api/search/${type}`, {
        method: "POST",
        body: formData,
      })

      const data: SearchResponse = await response.json()
      setSearchResults(data)
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
    }
  }

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId)
    setShowMovieModal(true)
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Search Movies</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Search Tabs */}
            <div className="flex border-b">
              {[
                { id: "text", label: "Text", icon: Search },
                { id: "voice", label: "Voice", icon: Mic },
                { id: "image", label: "Image", icon: Camera },
                { id: "audio", label: "Audio", icon: Music },
                { id: "video", label: "Video", icon: Video },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search Content */}
            <div className="p-6">
              {activeTab === "text" && (
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <Button
                      variant={searchType === "scene" ? "default" : "outline"}
                      onClick={() => setSearchType("scene")}
                    >
                      Scene Description
                    </Button>
                    <Button
                      variant={searchType === "actor" ? "default" : "outline"}
                      onClick={() => setSearchType("actor")}
                    >
                      Actor/Actress
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        searchType === "scene"
                          ? "Describe a scene: 'futuristic city with flying cars'"
                          : "Enter actor name: 'Ryan Gosling'"
                      }
                      onKeyPress={(e) => e.key === "Enter" && handleTextSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleTextSearch} disabled={isSearching || !searchQuery.trim()}>
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "voice" && (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">Describe the movie you're looking for using your voice</p>
                  <Button
                    onClick={handleVoiceSearch}
                    disabled={isSearching}
                    className={`px-8 py-4 ${isRecording ? "bg-red-500 hover:bg-red-600" : ""}`}
                  >
                    {isSearching ? (
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    ) : (
                      <Mic className={`w-6 h-6 mr-2 ${isRecording ? "animate-pulse" : ""}`} />
                    )}
                    {isRecording ? "Stop Recording" : "Start Voice Search"}
                  </Button>
                </div>
              )}

              {(activeTab === "image" || activeTab === "audio" || activeTab === "video") && (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Upload a {activeTab} file to search for movies
                    {activeTab === "image" && " (screenshot, poster, or scene)"}
                    {activeTab === "audio" && " (soundtrack, dialogue, or sound effect)"}
                    {activeTab === "video" && " (movie clip or trailer)"}
                  </p>
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
                  <Button onClick={() => fileInputRef.current?.click()} disabled={isSearching} className="px-8 py-4">
                    {isSearching ? (
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    ) : (
                      <Upload className="w-6 h-6 mr-2" />
                    )}
                    Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </Button>
                </div>
              )}

              {/* Search Results */}
              {searchResults && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Search Results</h3>
                    {searchResults.confidenceScore > 0 && (
                      <Badge className={`${getConfidenceColor(searchResults.confidenceScore)} text-white`}>
                        {searchResults.confidenceScore}% Match
                        {searchResults.confidenceScore < 60 && " ⚠️"}
                      </Badge>
                    )}
                  </div>

                  {searchResults.metadata && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Search Method:</strong> {searchResults.metadata.searchMethod}
                      </p>
                      {searchResults.metadata.transcribedText && (
                        <p className="text-sm text-gray-600">
                          <strong>Transcribed:</strong> "{searchResults.metadata.transcribedText}"
                        </p>
                      )}
                      {searchResults.metadata.detectedObjects && (
                        <p className="text-sm text-gray-600">
                          <strong>Detected:</strong> {searchResults.metadata.detectedObjects.join(", ")}
                        </p>
                      )}
                      {searchResults.metadata.recognizedTrack && (
                        <p className="text-sm text-gray-600">
                          <strong>Recognized:</strong> {searchResults.metadata.recognizedTrack}
                        </p>
                      )}
                      {searchResults.metadata.detectedScenes && (
                        <p className="text-sm text-gray-600">
                          <strong>Scenes:</strong> {searchResults.metadata.detectedScenes.join(", ")}
                        </p>
                      )}
                    </div>
                  )}

                  {searchResults.success && searchResults.results.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {searchResults.results.map((movie) => (
                        <Card
                          key={movie.id}
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => handleMovieClick(movie.id)}
                        >
                          <CardContent className="p-0">
                            <img
                              src={movie.poster || "/placeholder.svg"}
                              alt={movie.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-3">
                              <h4 className="font-medium text-sm mb-1 line-clamp-2">{movie.title}</h4>
                              <p className="text-gray-500 text-xs mb-1">{movie.year}</p>
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-xs text-gray-600">{movie.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        {searchResults.error || "No movies found. Try a different search term or method."}
                      </p>
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
