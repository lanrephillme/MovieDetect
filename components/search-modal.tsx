"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Search, Mic, Camera, Upload, Play, MicIcon, Square, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: number
  title: string
  year: number
  poster: string
  rating: number
  genre: string[]
  confidence: number
  matchReason: string
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [activeMethod, setActiveMethod] = useState("text")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
      // Clean up when modal closes
      stopRecording()
      setSearchQuery("")
      setUploadedFile(null)
      setFilePreview(null)
      setSearchResults([])
      setActiveMethod("text")
    }

    return () => {
      document.body.style.overflow = "unset"
      stopRecording()
    }
  }, [isOpen])

  const searchMethods = [
    { id: "text", label: "Text Search", icon: Search, description: "Search by title, actor, or description" },
    { id: "voice", label: "Voice Search", icon: Mic, description: "Describe the movie you're looking for" },
    { id: "image", label: "Image Search", icon: Camera, description: "Upload a poster or screenshot" },
    { id: "audio", label: "Audio Search", icon: Upload, description: "Upload an audio clip" },
    { id: "video", label: "Video Search", icon: Play, description: "Upload a video clip" },
    { id: "face", label: "Face Search", icon: Camera, description: "Find movies by actor's face" },
  ]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setAudioStream(stream)

      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)

      const audioChunks: BlobPart[] = []
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" })
        setUploadedFile(audioFile)
        setFilePreview(URL.createObjectURL(audioBlob))
      }

      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
    }
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop())
      setAudioStream(null)
    }
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }
    setIsRecording(false)
    setMediaRecorder(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)

      // Create preview for images and videos
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const previewUrl = URL.createObjectURL(file)
        setFilePreview(previewUrl)
      } else {
        setFilePreview(null)
      }
    }
  }

  const performSearch = async () => {
    setIsSearching(true)
    setSearchResults([])

    try {
      let endpoint = ""
      let body: any = {}

      switch (activeMethod) {
        case "text":
          endpoint = "/api/search/text"
          body = { query: searchQuery }
          break
        case "voice":
          endpoint = "/api/search/voice"
          if (uploadedFile) {
            const formData = new FormData()
            formData.append("audio", uploadedFile)
            body = formData
          } else {
            body = { query: searchQuery }
          }
          break
        case "image":
        case "face":
          endpoint = `/api/search/${activeMethod}`
          if (uploadedFile) {
            const formData = new FormData()
            formData.append("image", uploadedFile)
            body = formData
          }
          break
        case "audio":
          endpoint = "/api/search/audio"
          if (uploadedFile) {
            const formData = new FormData()
            formData.append("audio", uploadedFile)
            body = formData
          }
          break
        case "video":
          endpoint = "/api/search/video"
          if (uploadedFile) {
            const formData = new FormData()
            formData.append("video", uploadedFile)
            body = formData
          }
          break
      }

      const isFormData = body instanceof FormData
      const response = await fetch(endpoint, {
        method: "POST",
        ...(isFormData ? {} : { headers: { "Content-Type": "application/json" } }),
        body: isFormData ? body : JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success && data.results && Array.isArray(data.results)) {
        // Ensure each result has proper structure
        const validatedResults = data.results.map((result: any) => ({
          id: result.id || Math.random(),
          title: result.title || "Unknown Title",
          year: result.year || 2023,
          poster: result.poster || "/placeholder.svg",
          rating: result.rating || 0,
          genre: Array.isArray(result.genre) ? result.genre : [],
          confidence: result.confidence || 0,
          matchReason: result.matchReason || "AI match",
        }))
        setSearchResults(validatedResults)
      } else {
        // Mock results for demonstration
        setSearchResults(generateMockResults())
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults(generateMockResults())
    } finally {
      setIsSearching(false)
    }
  }

  const generateMockResults = (): SearchResult[] => {
    const mockResults = [
      {
        id: 1,
        title: "Blade Runner 2049",
        year: 2017,
        poster: "/blade-runner-2049-poster.png",
        rating: 8.2,
        genre: ["Sci-Fi", "Thriller"],
        confidence: 95,
        matchReason: "Perfect match for sci-fi thriller description",
      },
      {
        id: 2,
        title: "The Matrix",
        year: 1999,
        poster: "/matrix-movie-poster.png",
        rating: 8.7,
        genre: ["Action", "Sci-Fi"],
        confidence: 88,
        matchReason: "Similar themes and visual style",
      },
      {
        id: 3,
        title: "Interstellar",
        year: 2014,
        poster: "/interstellar-inspired-poster.png",
        rating: 8.6,
        genre: ["Sci-Fi", "Drama"],
        confidence: 82,
        matchReason: "Matches your preference for complex narratives",
      },
      {
        id: 4,
        title: "Ex Machina",
        year: 2014,
        poster: "/ex-machina-poster.png",
        rating: 7.7,
        genre: ["Sci-Fi", "Thriller"],
        confidence: 79,
        matchReason: "AI themes align with your search",
      },
    ]

    return mockResults.slice(0, Math.floor(Math.random() * 4) + 1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getAcceptedFileTypes = () => {
    switch (activeMethod) {
      case "image":
      case "face":
        return "image/*"
      case "audio":
        return "audio/*"
      case "video":
        return "video/*"
      default:
        return "*/*"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="h-full overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">AI Movie Search</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Search Method Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {searchMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setActiveMethod(method.id)
                  setSearchQuery("")
                  setUploadedFile(null)
                  setFilePreview(null)
                  setSearchResults([])
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeMethod === method.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <method.icon className="w-4 h-4" />
                <span className="font-medium">{method.label}</span>
              </button>
            ))}
          </div>

          {/* Search Interface */}
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchMethods.find((m) => m.id === activeMethod)?.label}
                </h3>
                <p className="text-gray-400">{searchMethods.find((m) => m.id === activeMethod)?.description}</p>
              </div>

              {/* Text Search */}
              {activeMethod === "text" && (
                <div className="space-y-4">
                  <Input
                    placeholder="Search by title, actor, or description"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    onKeyPress={(e) => e.key === "Enter" && searchQuery.trim() && performSearch()}
                  />
                  <Button
                    onClick={performSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4 mr-2" />
                    )}
                    Search Movies
                  </Button>
                </div>
              )}

              {/* Voice Search */}
              {activeMethod === "voice" && (
                <div className="space-y-4">
                  {!isRecording && !uploadedFile && (
                    <div className="text-center py-8">
                      <Button
                        onClick={startRecording}
                        className="bg-green-600 hover:bg-green-700 text-white mb-4"
                        size="lg"
                      >
                        <MicIcon className="w-6 h-6 mr-2" />
                        Start Recording
                      </Button>
                      <p className="text-gray-400">Click to start recording your voice description</p>
                    </div>
                  )}

                  {isRecording && (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <MicIcon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-white text-xl font-semibold">{formatTime(recordingTime)}</p>
                        <p className="text-gray-400">Recording... Describe the movie you're looking for</p>
                      </div>
                      <Button onClick={stopRecording} className="bg-red-600 hover:bg-red-700 text-white" size="lg">
                        <Square className="w-6 h-6 mr-2" />
                        Stop Recording
                      </Button>
                    </div>
                  )}

                  {uploadedFile && activeMethod === "voice" && (
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-white mb-2">Recording ready:</p>
                        {filePreview && (
                          <audio controls className="w-full">
                            <source src={filePreview} type="audio/wav" />
                          </audio>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={performSearch}
                          disabled={isSearching}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isSearching ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 mr-2" />
                          )}
                          Search with Audio
                        </Button>
                        <Button
                          onClick={() => {
                            setUploadedFile(null)
                            setFilePreview(null)
                          }}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Record Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* File Upload Methods */}
              {(activeMethod === "image" ||
                activeMethod === "audio" ||
                activeMethod === "video" ||
                activeMethod === "face") && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {!uploadedFile && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">
                        Upload {activeMethod === "image" || activeMethod === "face" ? "an image" : `a ${activeMethod}`}{" "}
                        file
                      </p>
                      <p className="text-gray-400 text-sm">Click here or drag and drop your file</p>
                    </div>
                  )}

                  {uploadedFile && (
                    <div className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-white mb-2">File uploaded: {uploadedFile.name}</p>
                        {filePreview && (
                          <div className="mt-4">
                            {activeMethod === "image" || activeMethod === "face" ? (
                              <img
                                src={filePreview || "/placeholder.svg"}
                                alt="Preview"
                                className="max-w-full h-48 object-contain rounded-lg"
                              />
                            ) : activeMethod === "video" ? (
                              <video src={filePreview} controls className="max-w-full h-48 rounded-lg" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={performSearch}
                          disabled={isSearching}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isSearching ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 mr-2" />
                          )}
                          Search with{" "}
                          {activeMethod === "image" || activeMethod === "face"
                            ? "Image"
                            : activeMethod === "audio"
                              ? "Audio"
                              : "Video"}
                        </Button>
                        <Button
                          onClick={() => {
                            setUploadedFile(null)
                            setFilePreview(null)
                          }}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Upload Different File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults && searchResults.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {searchResults.map((result) => {
                  // Ensure result and result.genre exist and are valid
                  const safeResult = {
                    id: result?.id || Math.random(),
                    title: result?.title || "Unknown Title",
                    year: result?.year || 2023,
                    poster: result?.poster || "/placeholder.svg",
                    rating: result?.rating || 0,
                    genre: Array.isArray(result?.genre) ? result.genre : [],
                    confidence: result?.confidence || 0,
                    matchReason: result?.matchReason || "AI match",
                  }

                  return (
                    <Card
                      key={safeResult.id}
                      className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <CardContent className="p-0">
                        <div className="flex">
                          <img
                            src={safeResult.poster || "/placeholder.svg"}
                            alt={safeResult.title}
                            className="w-24 h-36 object-cover rounded-l-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                          <div className="p-4 flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-white font-semibold text-lg line-clamp-2">{safeResult.title}</h4>
                              <Badge className="bg-green-600 text-white ml-2">{safeResult.confidence}%</Badge>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{safeResult.year}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {safeResult.genre.map((g, index) => (
                                <Badge
                                  key={`${g}-${index}`}
                                  variant="outline"
                                  className="border-gray-600 text-gray-300 text-xs"
                                >
                                  {g}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{safeResult.matchReason}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-white text-sm font-medium">{safeResult.rating}</span>
                              </div>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Searching movies with AI...</p>
              <p className="text-gray-400">This may take a few moments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
