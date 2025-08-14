"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  Search,
  Mic,
  Camera,
  ImageIcon,
  Video,
  Music,
  User,
  Upload,
  Loader2,
  Play,
  Star,
  Calendar,
} from "lucide-react"
import Image from "next/image"

interface SearchResult {
  id: number
  title: string
  year: number
  poster: string
  backdrop: string
  rating: number
  genre: string[]
  synopsis: string
  confidence: number
  matchReason: string
  trailer: string
  streamingPlatforms: Array<{
    name: string
    icon: string
    link: string
    type: string
    price?: string
  }>
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [activeMethod, setActiveMethod] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [cameraError, setCameraError] = useState("")
  const [uploadError, setUploadError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const mockResults: SearchResult[] = [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      poster: "/inception-movie-poster.png",
      backdrop: "/inception-movie-poster.png",
      rating: 8.8,
      genre: ["Sci-Fi", "Thriller", "Action"],
      synopsis:
        "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      confidence: 95,
      matchReason: "Visual similarity to uploaded image",
      trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      streamingPlatforms: [
        { name: "Netflix", icon: "🎬", link: "#", type: "subscription" },
        { name: "Amazon Prime", icon: "📺", link: "#", type: "subscription" },
        { name: "Apple TV", icon: "🍎", link: "#", type: "rent", price: "$3.99" },
      ],
    },
    {
      id: 2,
      title: "The Matrix",
      year: 1999,
      poster: "/matrix-movie-poster.png",
      backdrop: "/matrix-movie-poster.png",
      rating: 8.7,
      genre: ["Sci-Fi", "Action"],
      synopsis:
        "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
      confidence: 87,
      matchReason: "Similar themes and visual style",
      trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      streamingPlatforms: [
        { name: "HBO Max", icon: "🎭", link: "#", type: "subscription" },
        { name: "Hulu", icon: "📱", link: "#", type: "subscription" },
      ],
    },
  ]

  const searchMethods = [
    {
      id: "text",
      name: "Text Search",
      icon: Search,
      description: "Describe the movie in words",
      color: "bg-blue-500",
    },
    {
      id: "voice",
      name: "Voice Search",
      icon: Mic,
      description: "Speak your description",
      color: "bg-green-500",
    },
    {
      id: "image",
      name: "Image Search",
      icon: ImageIcon,
      description: "Upload a screenshot or poster",
      color: "bg-purple-500",
    },
    {
      id: "video",
      name: "Video Search",
      icon: Video,
      description: "Upload a video clip",
      color: "bg-red-500",
    },
    {
      id: "audio",
      name: "Audio Search",
      icon: Music,
      description: "Upload audio or hum a tune",
      color: "bg-yellow-500",
    },
    {
      id: "face",
      name: "Face Search",
      icon: User,
      description: "Find movies by actor's face",
      color: "bg-pink-500",
    },
  ]

  const handleSearch = async (method: string, query?: string) => {
    setIsSearching(true)
    setSearchResults([])

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadError("")
      handleSearch(activeMethod || "image")
    }
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      streamRef.current = stream

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      mediaRecorder.onstop = () => {
        clearInterval(timer)
        setIsRecording(false)
        stream.getTracks().forEach((track) => track.stop())
        handleSearch("voice")
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setUploadError("Could not access microphone. Please check permissions.")
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }

  const startCamera = async () => {
    try {
      setCameraError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error("Camera error:", error)
      setCameraError("Could not access camera. Please check permissions or try uploading a photo instead.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        // Stop camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        handleSearch("face")
      }
    }
  }

  const renderSearchMethod = (method: any) => {
    const IconComponent = method.icon

    return (
      <Card
        key={method.id}
        className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
          activeMethod === method.id ? "border-[#00E6E6] bg-[#00E6E6]/10" : "border-[#1F2937] hover:border-[#00E6E6]/50"
        } bg-[#1F2937]`}
        onClick={() => {
          setActiveMethod(method.id)
          setSearchResults([])
          setSelectedFile(null)
          setUploadError("")
          setCameraError("")

          if (method.id === "face") {
            startCamera()
          }
        }}
      >
        <CardContent className="p-6 text-center">
          <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">{method.name}</h3>
          <p className="text-[#B3B3B3] text-sm">{method.description}</p>
        </CardContent>
      </Card>
    )
  }

  const renderActiveMethod = () => {
    if (!activeMethod) return null

    const method = searchMethods.find((m) => m.id === activeMethod)
    if (!method) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setActiveMethod(null)
              setSearchResults([])
              if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
              }
            }}
            className="text-[#B3B3B3] hover:text-[#00E6E6]"
          >
            ← Back to Methods
          </Button>
          <h2 className="text-2xl font-bold text-white">{method.name}</h2>
        </div>

        {activeMethod === "text" && (
          <div className="space-y-4">
            <Input
              placeholder="Describe the movie you're looking for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1F2937] border-[#00E6E6]/20 text-white placeholder-[#B3B3B3] focus:border-[#00E6E6]"
              onKeyPress={(e) => e.key === "Enter" && handleSearch("text", searchQuery)}
            />
            <Button
              onClick={() => handleSearch("text", searchQuery)}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] w-full"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Search Movies
            </Button>
          </div>
        )}

        {activeMethod === "voice" && (
          <div className="space-y-4 text-center">
            <div className="bg-[#1F2937] p-8 rounded-lg">
              <div
                className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isRecording ? "bg-red-500 animate-pulse" : "bg-[#00E6E6]"
                }`}
              >
                <Mic className="w-12 h-12 text-white" />
              </div>
              {isRecording && <p className="text-white mb-4">Recording... {recordingTime}s</p>}
              <Button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`${
                  isRecording ? "bg-red-500 hover:bg-red-600" : "bg-[#00E6E6] hover:bg-[#00CCCC]"
                } text-white`}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>
            {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
          </div>
        )}

        {(activeMethod === "image" || activeMethod === "video" || activeMethod === "audio") && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#00E6E6]/30 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-[#00E6E6] mx-auto mb-4" />
              <p className="text-white mb-4">
                {activeMethod === "image" && "Upload an image, screenshot, or movie poster"}
                {activeMethod === "video" && "Upload a video clip from the movie"}
                {activeMethod === "audio" && "Upload an audio file or soundtrack"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={activeMethod === "image" ? "image/*" : activeMethod === "video" ? "video/*" : "audio/*"}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
              >
                Choose File
              </Button>
            </div>
            {selectedFile && (
              <div className="bg-[#1F2937] p-4 rounded-lg">
                <p className="text-white">Selected: {selectedFile.name}</p>
              </div>
            )}
            {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}
          </div>
        )}

        {activeMethod === "face" && (
          <div className="space-y-4">
            <div className="bg-[#1F2937] p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Face Recognition Search</h3>
              {cameraError ? (
                <div className="text-center">
                  <p className="text-red-400 mb-4">{cameraError}</p>
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
                    >
                      Upload Photo Instead
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto rounded-lg" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-4 justify-center">
                    <Button onClick={capturePhoto} className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17] bg-transparent"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-[#00E6E6] mx-auto mb-4" />
          <p className="text-white">Searching for movies...</p>
        </div>
      )
    }

    if (searchResults.length === 0) return null

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Search Results</h3>
        <div className="grid gap-6">
          {searchResults.map((result) => (
            <Card key={result.id} className="bg-[#1F2937] border-[#00E6E6]/20 overflow-hidden">
              <div className="flex">
                <div className="w-32 h-48 flex-shrink-0">
                  <Image
                    src={result.poster || "/placeholder.svg"}
                    alt={result.title}
                    width={128}
                    height={192}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{result.title}</h4>
                      <div className="flex items-center gap-4 text-[#B3B3B3] mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {result.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {result.rating}
                        </span>
                      </div>
                      <div className="flex gap-2 mb-4">
                        {result.genre.map((g) => (
                          <Badge key={g} variant="secondary" className="bg-[#00E6E6]/20 text-[#00E6E6]">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">{result.confidence}% Match</Badge>
                  </div>

                  <p className="text-[#B3B3B3] mb-4 line-clamp-3">{result.synopsis}</p>

                  <div className="mb-4">
                    <p className="text-sm text-[#00E6E6] mb-2">Match Reason: {result.matchReason}</p>
                    <div className="flex gap-2 flex-wrap">
                      {result.streamingPlatforms.map((platform, index) => (
                        <Badge key={index} variant="outline" className="border-[#00E6E6]/30 text-[#B3B3B3]">
                          {platform.icon} {platform.name} {platform.price && `(${platform.price})`}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Trailer
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17] bg-transparent"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 h-full">
        <div className="bg-[#0B0E17] rounded-lg h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[#1F2937]">
            <h1 className="text-3xl font-bold text-white">AI-Powered Movie Search</h1>
            <Button variant="ghost" onClick={onClose} className="text-[#B3B3B3] hover:text-[#00E6E6]">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-6">
            {!activeMethod ? (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Choose Your Search Method</h2>
                  <p className="text-[#B3B3B3] max-w-2xl mx-auto">
                    Our AI can find movies using multiple search methods. Choose the one that works best for what you
                    remember about the movie.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchMethods.map(renderSearchMethod)}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {renderActiveMethod()}
                {renderSearchResults()}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
