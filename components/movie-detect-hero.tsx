"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Mic,
  Camera,
  Upload,
  Video,
  User,
  Play,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  Plus,
  Share,
} from "lucide-react"
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

interface HeroMovie {
  id: number
  title: string
  year: number
  genre: string[]
  rating: number
  synopsis: string
  backdrop: string
  trailer: string
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
  const [errorMessage, setErrorMessage] = useState("")
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [currentHeroMovie, setCurrentHeroMovie] = useState<HeroMovie | null>(null)
  const [showSearchControls, setShowSearchControls] = useState(true)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const cameraVideoRef = useRef<HTMLVideoElement>(null)

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

  // Featured hero movies
  const heroMovies: HeroMovie[] = [
    {
      id: 1,
      title: "Blade Runner 2049",
      year: 2017,
      genre: ["Sci-Fi", "Thriller", "Drama"],
      rating: 8.2,
      synopsis:
        "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
      backdrop: "/blade-runner-2049-cityscape.png",
      trailer: "/placeholder-trailer.mp4",
    },
    {
      id: 2,
      title: "Dune: Part Two",
      year: 2024,
      genre: ["Sci-Fi", "Adventure", "Drama"],
      rating: 8.9,
      synopsis:
        "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      backdrop: "/dune-part-two-poster.png",
      trailer: "/placeholder-trailer.mp4",
    },
  ]

  useEffect(() => {
    // Set initial hero movie
    setCurrentHeroMovie(heroMovies[0])

    // Auto-play video after 3 seconds
    const timer = setTimeout(() => {
      if (videoRef.current && !selectedResult) {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
            // Fade out search controls when video starts playing
            setShowSearchControls(false)
          })
          .catch((error) => {
            console.log("Hero video autoplay failed:", error)
          })
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Handle video play/pause state changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsVideoPlaying(true)
      setShowSearchControls(false)
    }

    const handlePause = () => {
      setIsVideoPlaying(false)
      setShowSearchControls(true)
    }

    const handleEnded = () => {
      setIsVideoPlaying(false)
      setShowSearchControls(true)
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((error) => {
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

  const handlePlayMovie = () => {
    // Implement play functionality
    console.log("Playing movie:", displayMovie?.title)
  }

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
    // API call to update watchlist
    console.log(isInWatchlist ? "Removed from watchlist" : "Added to watchlist")
  }

  const handleShareMovie = () => {
    if (navigator.share && displayMovie) {
      navigator.share({
        title: displayMovie.title,
        text: `Check out ${displayMovie.title} on MovieDetect!`,
        url: window.location.href,
      })
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const startVoiceRecording = async () => {
    try {
      setErrorMessage("")
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
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
        }
      }, 10000)
    } catch (error) {
      console.error("Error starting voice recording:", error)
      setErrorMessage("Could not access microphone. Please check your browser permissions and try again.")
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
      setErrorMessage("")
      performSearch()
    }
  }

  const activateCamera = async () => {
    try {
      setErrorMessage("")

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })

      setCameraStream(stream)

      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream
        cameraVideoRef.current.play()
      }

      setTimeout(() => {
        captureFromCamera()
      }, 3000)
    } catch (error) {
      console.error("Error accessing camera:", error)

      let errorMsg = "Could not access camera. "

      if (error instanceof Error) {
        if (error.name === "NotAllowedError" || error.message.includes("Permission denied")) {
          errorMsg += "Please allow camera access in your browser settings and try again."
        } else if (error.name === "NotFoundError") {
          errorMsg += "No camera found on this device."
        } else if (error.name === "NotSupportedError") {
          errorMsg += "Camera access is not supported in this browser."
        } else {
          errorMsg += "Please check your camera permissions and try again."
        }
      }

      setErrorMessage(errorMsg)

      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.click()
        }
      }, 2000)
    }
  }

  const captureFromCamera = () => {
    if (cameraVideoRef.current && cameraStream) {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = cameraVideoRef.current.videoWidth
        canvas.height = cameraVideoRef.current.videoHeight
        context.drawImage(cameraVideoRef.current, 0, 0)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
              setUploadedFile(file)
              performSearch()
            }
          },
          "image/jpeg",
          0.8,
        )
      }

      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  const performSearch = async () => {
    if (!searchQuery.trim() && !uploadedFile && activeSearchMethod === "text") return

    setIsSearching(true)
    setShowSearchOverlay(false)
    setErrorMessage("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

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
      setErrorMessage("Search failed. Please try again.")
      setShowSearchOverlay(true)
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
  const displayMovie = selectedResult
    ? {
        title: selectedResult.title,
        year: selectedResult.year,
        genre: selectedResult.genre,
        rating: selectedResult.rating,
        synopsis: selectedResult.synopsis,
        backdrop: selectedResult.backdrop,
        trailer: selectedResult.trailer,
      }
    : currentHeroMovie

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          poster={displayMovie?.backdrop || "/blade-runner-2049-cityscape.png"}
          onError={() => {
            console.log("Hero video failed to load, using fallback image")
            setIsVideoPlaying(false)
          }}
        >
          <source src={displayMovie?.trailer || "/placeholder-trailer.mp4"} type="video/mp4" />
        </video>

        {/* Fallback background image */}
        {!isVideoPlaying && (
          <img
            src={displayMovie?.backdrop || "/blade-runner-2049-cityscape.png"}
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
        {/* Bottom gradient for carousel flush */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-transparent via-transparent to-transparent" />
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

      {/* Movie Info Overlay - Apple TV Style */}
      {displayMovie && !showSearchOverlay && (
        <div className="absolute bottom-32 left-0 right-0 z-10">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <div
                className={`transition-all duration-1000 ease-in-out ${showSearchControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">{displayMovie.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-gray-300 text-lg">{displayMovie.year}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-medium text-lg">{displayMovie.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {displayMovie.genre.map((g) => (
                      <Badge key={g} variant="outline" className="border-gray-400 text-gray-300">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed max-w-2xl mb-6">{displayMovie.synopsis}</p>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                    onClick={handlePlayMovie}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Play
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToWatchlist}
                    className={`border-white/50 hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg ${
                      isInWatchlist ? "text-[#00E6E6] border-[#00E6E6]" : "text-white"
                    }`}
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    {isInWatchlist ? "In My List" : "My List"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                    onClick={handleShareMovie}
                  >
                    <Share className="w-6 h-6 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Search Overlay */}
            {showSearchOverlay && (
              <div
                className={`transition-all duration-1000 ease-in-out ${showSearchControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="text-center mb-8">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Find Any Movie
                    <br />
                    <span style={{ color: "#00E6E6" }}>Using AI</span>
                  </h1>

                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Revolutionary AI-powered movie discovery. Search by voice, image, audio, video, or describe what you
                    remember.
                  </p>

                  {/* About MovieDetect */}
                  <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 mb-8 max-w-3xl mx-auto">
                    <h3 className="text-xl font-semibold text-white mb-3">What is MovieDetect?</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      MovieDetect is an advanced AI-powered platform that revolutionizes how you discover movies and TV
                      shows. Using cutting-edge artificial intelligence, we can identify any movie from just a
                      description, image, audio clip, or even a hummed tune. Whether you remember a single scene, an
                      actor's face, or just the feeling a movie gave you, our AI will help you find exactly what you're
                      looking for.
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 backdrop-blur-sm max-w-2xl mx-auto">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <p className="text-red-200">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Centered Search Method Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {searchMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setActiveSearchMethod(method.id)
                        setErrorMessage("")
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                        activeSearchMethod === method.id
                          ? "bg-[#00E6E6] text-[#0B0E17]"
                          : "bg-black/30 text-white hover:bg-[#00CCCC]/20 backdrop-blur-sm"
                      }`}
                    >
                      <method.icon className="w-4 h-4" />
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Centered Search Input Area */}
                <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 mb-6 max-w-2xl mx-auto">
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
                      {cameraStream && (
                        <div className="mb-4">
                          <video
                            ref={cameraVideoRef}
                            className="w-64 h-48 mx-auto rounded-lg bg-black"
                            autoPlay
                            muted
                            playsInline
                          />
                          <p className="text-blue-400 text-sm mt-2">Capturing in 3 seconds...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Centered Big Round Search Button */}
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleSearchAction}
                      disabled={isSearching || (activeSearchMethod === "text" && !searchQuery.trim())}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isRecording
                          ? "bg-red-500/80 hover:bg-red-500 animate-pulse"
                          : "bg-[#00E6E6]/20 hover:bg-[#00E6E6]/30 backdrop-blur-md hover:scale-110"
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
              <div
                className={`transition-all duration-1000 ease-in-out text-center ${showSearchControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="mb-6">
                  <Badge className="bg-green-600 text-white mb-4">{selectedResult.confidence}% Match</Badge>
                  <p className="text-blue-400 text-sm mb-6">{selectedResult.matchReason}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                    onClick={handlePlayMovie}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Play
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToWatchlist}
                    className={`border-white/50 hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg ${
                      isInWatchlist ? "text-[#00E6E6] border-[#00E6E6]" : "text-white"
                    }`}
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    {isInWatchlist ? "In My List" : "My List"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-3 text-lg"
                    onClick={() => {
                      setShowSearchOverlay(true)
                      setSelectedResult(null)
                      setErrorMessage("")
                    }}
                  >
                    New Search
                  </Button>
                </div>

                {/* Streaming Platforms */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
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
    </section>
  )
}
