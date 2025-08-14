"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Search, Mic, Camera, Music, Video, Users, Upload, MicIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery?: string
  searchType?: string
  initialMethod?: string | null
}

interface SearchResult {
  id: number
  title: string
  year: number
  poster: string
  rating: number
  genre: string[]
  synopsis: string
  confidence: number
}

export function SearchModal({
  isOpen,
  onClose,
  searchQuery = "",
  searchType = "",
  initialMethod = null,
}: SearchModalProps) {
  const [activeMethod, setActiveMethod] = useState<string>(initialMethod || searchType || "text")
  const [query, setQuery] = useState(searchQuery)
  const [isRecording, setIsRecording] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const searchMethods = [
    {
      id: "text",
      title: "Text Search",
      description: "Search by movie title, actor, director, or plot description",
      icon: Search,
      color: "bg-blue-500",
      placeholder: "Enter movie title, actor name, or describe the plot...",
    },
    {
      id: "voice",
      title: "Voice Search",
      description: "Describe the movie you're looking for using your voice",
      icon: Mic,
      color: "bg-green-500",
      placeholder: "Click the microphone and describe the movie...",
    },
    {
      id: "image",
      title: "Image Search",
      description: "Upload a movie poster, screenshot, or scene image",
      icon: Camera,
      color: "bg-purple-500",
      placeholder: "Upload an image from the movie...",
    },
    {
      id: "audio",
      title: "Audio Search",
      description: "Hum a tune, play a soundtrack, or record movie audio",
      icon: Music,
      color: "bg-orange-500",
      placeholder: "Record or upload audio from the movie...",
    },
    {
      id: "video",
      title: "Video Search",
      description: "Upload a movie clip, trailer, or scene video",
      icon: Video,
      color: "bg-red-500",
      placeholder: "Upload a video clip from the movie...",
    },
    {
      id: "face",
      title: "Face Recognition",
      description: "Find movies by uploading an actor's photo",
      icon: Users,
      color: "bg-pink-500",
      placeholder: "Upload a photo of an actor...",
    },
  ]

  const mockResults: SearchResult[] = [
    {
      id: 1,
      title: "Blade Runner 2049",
      year: 2017,
      poster: "/blade-runner-2049-poster.png",
      rating: 8.2,
      genre: ["Sci-Fi", "Thriller", "Drama"],
      synopsis:
        "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
      confidence: 95,
    },
    {
      id: 2,
      title: "The Matrix",
      year: 1999,
      poster: "/matrix-movie-poster.png",
      rating: 8.7,
      genre: ["Action", "Sci-Fi"],
      synopsis: "A computer programmer is led to fight an underground war against powerful computers.",
      confidence: 87,
    },
    {
      id: 3,
      title: "Interstellar",
      year: 2014,
      poster: "/interstellar-inspired-poster.png",
      rating: 8.6,
      genre: ["Sci-Fi", "Drama", "Adventure"],
      synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      confidence: 82,
    },
  ]

  useEffect(() => {
    if (initialMethod) {
      setActiveMethod(initialMethod)
    }
  }, [initialMethod])

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery)
    }
  }, [searchQuery])

  const handleSearch = async () => {
    if (!query.trim() && !uploadedFile) return

    setIsSearching(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSearchResults(mockResults)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Auto-search when file is uploaded
      setTimeout(() => {
        handleSearch()
      }, 500)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setPreviewUrl(audioUrl)
        handleSearch()
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const currentMethod = searchMethods.find((method) => method.id === activeMethod)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">AI Movie Search</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Search Methods Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-700 bg-gray-800">
          {searchMethods.map((method) => {
            const IconComponent = method.icon
            return (
              <button
                key={method.id}
                onClick={() => setActiveMethod(method.id)}
                className={`flex items-center space-x-2 px-6 py-4 whitespace-nowrap transition-colors ${
                  activeMethod === method.id
                    ? "text-white border-b-2 border-red-500 bg-gray-700"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <div className={`${method.color} w-5 h-5 rounded flex items-center justify-center`}>
                  <IconComponent className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">{method.title}</span>
              </button>
            )
          })}
        </div>

        {/* Search Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {currentMethod && (
            <div className="space-y-6">
              {/* Method Description */}
              <div className="text-center">
                <div
                  className={`${currentMethod.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <currentMethod.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{currentMethod.title}</h3>
                <p className="text-gray-400">{currentMethod.description}</p>
              </div>

              {/* Search Input */}
              <div className="space-y-4">
                {activeMethod === "text" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={currentMethod.placeholder}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button
                        onClick={handleSearch}
                        disabled={!query.trim() || isSearching}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700"
                      >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {activeMethod === "voice" && (
                  <div className="text-center space-y-4">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-32 h-32 rounded-full ${
                        isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <MicIcon className="w-12 h-12 text-white" />
                    </Button>
                    <p className="text-gray-400">
                      {isRecording ? "Recording... Click to stop" : "Click to start voice recording"}
                    </p>
                    {previewUrl && activeMethod === "voice" && (
                      <audio controls className="w-full">
                        <source src={previewUrl} type="audio/wav" />
                      </audio>
                    )}
                  </div>
                )}

                {(activeMethod === "image" || activeMethod === "video" || activeMethod === "face") && (
                  <div className="space-y-4">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">
                        {uploadedFile
                          ? uploadedFile.name
                          : `Click to upload ${activeMethod === "image" ? "image" : activeMethod === "video" ? "video" : "photo"}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activeMethod === "image" && "Supports JPG, PNG, WebP"}
                        {activeMethod === "video" && "Supports MP4, WebM, MOV"}
                        {activeMethod === "face" && "Supports JPG, PNG for face recognition"}
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={activeMethod === "image" || activeMethod === "face" ? "image/*" : "video/*"}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {previewUrl && (
                      <div className="mt-4">
                        {(activeMethod === "image" || activeMethod === "face") && (
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Preview"
                            className="max-w-full h-48 object-contain mx-auto rounded-lg"
                          />
                        )}
                        {activeMethod === "video" && (
                          <video
                            ref={videoRef}
                            src={previewUrl}
                            controls
                            className="max-w-full h-48 mx-auto rounded-lg"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeMethod === "audio" && (
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`${
                          isRecording ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"
                        }`}
                      >
                        <Music className="w-4 h-4 mr-2" />
                        {isRecording ? "Stop Recording" : "Record Audio"}
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Audio
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {previewUrl && (
                      <audio controls className="w-full">
                        <source src={previewUrl} type="audio/wav" />
                      </audio>
                    )}
                  </div>
                )}
              </div>

              {/* Search Results */}
              {isSearching && (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
                  <p className="text-gray-400">Analyzing with AI...</p>
                </div>
              )}

              {searchResults.length > 0 && !isSearching && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Search Results</h4>
                  <div className="grid gap-4">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => {
                          console.log("Selected movie:", result.title)
                          onClose()
                        }}
                      >
                        <img
                          src={result.poster || "/placeholder.svg"}
                          alt={result.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold text-white">{result.title}</h5>
                            <Badge className="bg-green-600 text-white">{result.confidence}% Match</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{result.year}</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span>{result.rating}</span>
                            </div>
                            <div className="flex space-x-1">
                              {result.genre.slice(0, 2).map((g) => (
                                <Badge key={g} variant="secondary" className="text-xs">
                                  {g}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm line-clamp-2">{result.synopsis}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
