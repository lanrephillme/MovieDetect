"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Search, Mic, ImageIcon, Music, Video, User, Upload, MicIcon, StopCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery?: string
  searchType?: string
}

interface SearchResult {
  id: number
  title: string
  year: number
  poster: string
  rating: number
  genre: string[]
  confidence: number
  synopsis: string
}

export function SearchModal({ isOpen, onClose, searchQuery = "", searchType = "" }: SearchModalProps) {
  const [activeMethod, setActiveMethod] = useState(searchType || "text")
  const [query, setQuery] = useState(searchQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const searchMethods = [
    { id: "text", name: "Text", icon: Search, description: "Search by title, actor, or genre" },
    { id: "voice", name: "Voice", icon: Mic, description: "Describe what you're looking for" },
    { id: "image", name: "Image", icon: ImageIcon, description: "Upload a poster or screenshot" },
    { id: "audio", name: "Audio", icon: Music, description: "Upload soundtrack or dialogue" },
    { id: "video", name: "Video", icon: Video, description: "Upload a movie clip" },
    { id: "face", name: "Face", icon: User, description: "Find movies by actor's face" },
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery)
    }
    if (searchType) {
      setActiveMethod(searchType)
    }
  }, [searchQuery, searchType])

  const handleSearch = async () => {
    if (!query && !uploadedFile) return

    setLoading(true)
    try {
      const endpoint = `/api/search/${activeMethod}`
      let body: any = {}

      if (activeMethod === "text" || activeMethod === "voice") {
        body = { query }
      } else if (uploadedFile) {
        const formData = new FormData()
        formData.append("file", uploadedFile)
        // For file uploads, we'd use FormData instead of JSON
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: activeMethod === "text" || activeMethod === "voice" ? { "Content-Type": "application/json" } : {},
        body: activeMethod === "text" || activeMethod === "voice" ? JSON.stringify(body) : body,
      })

      const data = await response.json()

      if (data.success && data.results) {
        setResults(data.results)
      } else {
        // Mock results for demo
        setResults(generateMockResults())
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults(generateMockResults())
    } finally {
      setLoading(false)
    }
  }

  const generateMockResults = (): SearchResult[] => {
    return [
      {
        id: 1,
        title: "Blade Runner 2049",
        year: 2017,
        poster: "/blade-runner-2049-poster.png",
        rating: 8.2,
        genre: ["Sci-Fi", "Thriller"],
        confidence: 95,
        synopsis: "A young blade runner's discovery leads him to track down Rick Deckard.",
      },
      {
        id: 2,
        title: "The Matrix",
        year: 1999,
        poster: "/matrix-movie-poster.png",
        rating: 8.7,
        genre: ["Action", "Sci-Fi"],
        confidence: 88,
        synopsis: "A computer programmer fights an underground war against powerful computers.",
      },
      {
        id: 3,
        title: "Interstellar",
        year: 2014,
        poster: "/interstellar-inspired-poster.png",
        rating: 8.6,
        genre: ["Sci-Fi", "Drama"],
        confidence: 82,
        synopsis: "Explorers travel through a wormhole to ensure humanity's survival.",
      },
    ]
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      mediaRecorder.ondataavailable = (event) => {
        const audioBlob = new Blob([event.data], { type: "audio/wav" })
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" })
        setUploadedFile(audioFile)
      }
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="h-full overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">AI-Powered Movie Search</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Search Method Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {searchMethods.map((method) => {
                const IconComponent = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => setActiveMethod(method.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeMethod === method.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{method.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Search Interface */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchMethods.find((m) => m.id === activeMethod)?.name} Search
                </h3>
                <p className="text-gray-400">{searchMethods.find((m) => m.id === activeMethod)?.description}</p>
              </div>

              {/* Text Search */}
              {activeMethod === "text" && (
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter movie title, actor name, or genre..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={!query || loading} className="bg-blue-600 hover:bg-blue-700">
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              )}

              {/* Voice Search */}
              {activeMethod === "voice" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {!isRecording ? (
                      <Button onClick={startRecording} className="bg-green-600 hover:bg-green-700">
                        <MicIcon className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700">
                        <StopCircle className="w-4 h-4 mr-2" />
                        Stop Recording ({formatTime(recordingTime)})
                      </Button>
                    )}
                  </div>
                  {uploadedFile && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">Recording ready:</span>
                      <Badge variant="secondary">{uploadedFile.name}</Badge>
                      <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading ? "Processing..." : "Analyze Audio"}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* File Upload (Image, Audio, Video, Face) */}
              {(activeMethod === "image" ||
                activeMethod === "audio" ||
                activeMethod === "video" ||
                activeMethod === "face") && (
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Click to upload or drag and drop your {activeMethod} file</p>
                    <p className="text-gray-500 text-sm">
                      {activeMethod === "image" || activeMethod === "face"
                        ? "Supported: JPG, PNG, GIF"
                        : activeMethod === "audio"
                          ? "Supported: MP3, WAV, M4A"
                          : "Supported: MP4, MOV, AVI"}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={
                      activeMethod === "image" || activeMethod === "face"
                        ? "image/*"
                        : activeMethod === "audio"
                          ? "audio/*"
                          : "video/*"
                    }
                    onChange={handleFileUpload}
                  />
                  {uploadedFile && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300">File uploaded:</span>
                        <Badge variant="secondary">{uploadedFile.name}</Badge>
                      </div>
                      {previewUrl && (activeMethod === "image" || activeMethod === "face") && (
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-xs max-h-48 rounded-lg object-cover"
                        />
                      )}
                      {previewUrl && activeMethod === "video" && (
                        <video src={previewUrl} controls className="max-w-xs max-h-48 rounded-lg" />
                      )}
                      <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading
                          ? "Analyzing..."
                          : `Analyze ${activeMethod.charAt(0).toUpperCase() + activeMethod.slice(1)}`}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search Results */}
            {results.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Search Results</h3>
                <div className="grid gap-4">
                  {results.map((movie) => (
                    <Card
                      key={movie.id}
                      className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <img
                            src={movie.poster || "/placeholder.svg"}
                            alt={movie.title}
                            className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-white font-semibold text-lg">{movie.title}</h4>
                                <p className="text-gray-400">{movie.year}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={`${
                                    movie.confidence >= 90
                                      ? "bg-green-600"
                                      : movie.confidence >= 70
                                        ? "bg-yellow-600"
                                        : "bg-red-600"
                                  } text-white`}
                                >
                                  {movie.confidence}% match
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-white">{movie.rating}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {movie.genre.slice(0, 3).map((g) => (
                                  <Badge key={g} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                    {g}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300 text-sm line-clamp-2">{movie.synopsis}</p>
                            <div className="flex space-x-2 pt-2">
                              <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                                <Play className="w-4 h-4 mr-1" />
                                Watch
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                              >
                                More Info
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-300 mt-4">Searching with AI...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
