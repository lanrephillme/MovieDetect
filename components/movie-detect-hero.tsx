"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Mic, Camera, Upload, Video, User, Play, Volume2, VolumeX, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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

export function MovieDetectHero() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [activeSearchMethod, setActiveSearchMethod] = useState("text")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showSearchOverlay, setShowSearchOverlay] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const searchMethods = [
    {
      id: "text",
      label: "Text",
      icon: Search,
      description: "Describe the movie, title, actor, genre or anything you remember",
    },
    { id: "voice", label: "Voice", icon: Mic, description: "Tell us about the movie you're looking for" },
    { id: "image", label: "Image", icon: Camera, description: "Upload a movie poster or screenshot" },
    { id: "audio", label: "Audio", icon: Upload, description: "Upload soundtrack or scene audio" },
    { id: "video", label: "Video", icon: Video, description: "Upload a video clip from the movie" },
    { id: "face", label: "Face", icon: User, description: "Use camera to find movies by actor's face" },
  ]

  useEffect(() => {
    // Auto-play video after 3 seconds
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
          })
          .catch((error) => {
            console.log("Hero video autoplay failed:", error)
          })
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
          })
          .catch((error) => {
            console.log("Hero video play failed:", error)
          })
      }
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        const audioFile = new File([audioBlob], "voice-search.wav", { type: "audio/wav" })
        setUploadedFile(audioFile)
        performSearch()
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
        }
      }, 10000)
    } catch (error) {
      console.error("Error starting voice recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      performSearch()
    }
  }

  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // For demo purposes, we'll just trigger search
      // In real implementation, you'd capture the video frame
      performSearch()
      stream.getTracks().forEach((track) => track.stop())
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  const performSearch = async () => {
    if (!searchQuery.trim() && !uploadedFile && activeSearchMethod === "text") return

    setIsSearching(true)
    setShowSearchOverlay(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: 1,
          title: "Blade Runner 2049",
          year: 2017,
          poster: "/blade-runner-2049-poster.png",
          backdrop: "/blade-runner-2049-cityscape.png",
          rating: 8.2,
          genre: ["Sci-Fi", "Thriller", "Drama"],
          synopsis:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
          confidence: 95,
          matchReason: "Perfect match for your search criteria",
          trailer: "/placeholder-trailer.mp4",
          streamingPlatforms: [
            { name: "Netflix", icon: "/netflix-icon.png", link: "https://netflix.com", type: "subscription" },
            { name: "Prime Video", icon: "/prime-icon.png", link: "https://primevideo.com", type: "subscription" },
            { name: "Apple TV", icon: "/appletv-icon.png", link: "https://tv.apple.com", type: "rent", price: "$3.99" },
          ],
        },
      ]

      setSearchResults(mockResults)
      setSelectedResult(mockResults[0])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchAction = () => {
    switch (activeSearchMethod) {
      case "voice":
        if (isRecording) {
          stopVoiceRecording()
        } else {
          startVoiceRecording()
        }
        break
      case "image":
      case "audio":
      case "video":
        fileInputRef.current?.click()
        break
      case "face":
        activateCamera()
        break
      default:
        performSearch()
    }
  }

  const getSearchButtonContent = () => {
    if (isSearching) {
      return <Loader2 className="w-8 h-8 animate-spin" />
    }

    switch (activeSearchMethod) {
      case "voice":
        return isRecording ? (
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse mb-1" />
            <span className="text-xs">Stop</span>
          </div>
        ) : (
          <Mic className="w-8 h-8" />
        )
      case "image":
        return <Camera className="w-8 h-8" />
      case "audio":
        return <Upload className="w-8 h-8" />
      case "video":
        return <Video className="w-8 h-8" />
      case "face":
        return <User className="w-8 h-8" />
      default:
        return <Search className="w-8 h-8" />
    }
  }

  const currentMethod = searchMethods.find((m) => m.id === activeSearchMethod)

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          poster={selectedResult?.backdrop || "/blade-runner-2049-cityscape.png"}
          onError={() => {
            console.log("Hero video failed to load, using fallback image")
            setIsVideoPlaying(false)
          }}
        >
          <source src={selectedResult?.trailer || "/placeholder-trailer.mp4"} type="video/mp4" />
        </video>

        {/* Fallback background image */}
        {!isVideoPlaying && (
          <img
            src={selectedResult?.backdrop || "/blade-runner-2049-cityscape.png"}
            alt="Hero Background"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Video Controls */}
      <div className="absolute top-6 right-6 flex space-x-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
          onClick={handleVideoToggle}
        >
          <Play className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
          onClick={handleMuteToggle}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Search Overlay */}
            {showSearchOverlay && (
              <div className="transition-all duration-1000 ease-in-out">
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Find Any Movie
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Using AI
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                  Revolutionary AI-powered movie discovery. Search by voice, image, audio, video, or describe what you
                  remember.
                </p>

                {/* Search Method Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {searchMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setActiveSearchMethod(method.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        activeSearchMethod === method.id
                          ? "bg-white text-black"
                          : "bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                      }`}
                    >
                      <method.icon className="w-4 h-4" />
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Search Input Area */}
                <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 mb-6">
                  {activeSearchMethod === "text" && (
                    <Input
                      placeholder={currentMethod?.description}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-300 text-lg h-14 rounded-xl backdrop-blur-sm"
                      onKeyPress={(e) => e.key === "Enter" && performSearch()}
                    />
                  )}

                  {activeSearchMethod !== "text" && (
                    <div className="text-center py-4">
                      <p className="text-white text-lg mb-4">{currentMethod?.description}</p>
                      {isRecording && <p className="text-red-400 text-sm animate-pulse">Recording... Speak now</p>}
                    </div>
                  )}

                  {/* Big Round Search Button */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleSearchAction}
                      disabled={isSearching || (activeSearchMethod === "text" && !searchQuery.trim())}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording
                          ? "bg-red-500/80 hover:bg-red-500 animate-pulse"
                          : "bg-white/20 hover:bg-white/30 backdrop-blur-md hover:scale-110"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {getSearchButtonContent()}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {selectedResult && !showSearchOverlay && (
              <div className="transition-all duration-1000 ease-in-out">
                <div className="mb-6">
                  <Badge className="bg-green-600 text-white mb-4">{selectedResult.confidence}% Match</Badge>
                  <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {selectedResult.title}
                  </h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-gray-300 text-lg">{selectedResult.year}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white font-medium text-lg">{selectedResult.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedResult.genre.map((g) => (
                        <Badge key={g} variant="outline" className="border-gray-400 text-gray-300">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-200 text-lg leading-relaxed mb-6 max-w-2xl">{selectedResult.synopsis}</p>
                  <p className="text-blue-400 text-sm mb-6">{selectedResult.matchReason}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mb-8">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold">
                    <Play className="w-6 h-6 mr-2" />
                    Play
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                  >
                    + My List
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                    onClick={() => setShowSearchOverlay(true)}
                  >
                    New Search
                  </Button>
                </div>

                {/* Streaming Platforms */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {selectedResult.streamingPlatforms.map((platform, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-black/30 backdrop-blur-sm"
                      onClick={() => window.open(platform.link, "_blank")}
                    >
                      {platform.name} {platform.price && `- ${platform.price}`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                <p className="text-white text-xl">Searching with AI...</p>
                <p className="text-gray-400">Analyzing your request...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={
          activeSearchMethod === "image" || activeSearchMethod === "face"
            ? "image/*"
            : activeSearchMethod === "audio"
              ? "audio/*"
              : activeSearchMethod === "video"
                ? "video/*"
                : "*/*"
        }
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  )
}
