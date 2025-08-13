"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Search, Mic, ImageIcon, Video, User, X, Camera, Sparkles, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "@/components/search-modal"
import { Badge } from "@/components/ui/badge"

interface MovieDetectHeroProps {
  onSearchClick: () => void
}

const MovieDetectHero: React.FC<MovieDetectHeroProps> = ({ onSearchClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearchType, setActiveSearchType] = useState<"scene" | "actor" | "soundtrack" | "screenshot" | "video">(
    "scene",
  )
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isMicCancelled, setIsMicCancelled] = useState(false)
  const [isCameraCancelled, setIsCameraCancelled] = useState(false)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const searchTypes = [
    {
      id: "scene" as const,
      label: "Describe Scene",
      icon: Search,
      placeholder: "Describe a scene, quote, or moment from the movie...",
      description: "Use natural language to describe what you remember",
    },
    {
      id: "actor" as const,
      label: "Actor/Actress",
      icon: User,
      placeholder: "Type actor or actress name...",
      description: "Search by cast members with autocomplete",
    },
    {
      id: "soundtrack" as const,
      label: "Soundtrack",
      icon: Mic,
      placeholder: "Record audio or upload soundtrack...",
      description: "Audio recognition from soundtracks and scores",
    },
    {
      id: "screenshot" as const,
      label: "Screenshot",
      icon: ImageIcon,
      placeholder: "Upload screenshot or movie poster...",
      description: "Image recognition from scenes and posters",
    },
    {
      id: "video" as const,
      label: "Video Clip",
      icon: Video,
      placeholder: "Record video or upload clip...",
      description: "Frame-by-frame analysis of video content",
    },
  ]

  const searchMethods = [
    { icon: Search, label: "Text", desc: "Describe scenes or actors" },
    { icon: Camera, label: "Image", desc: "Upload screenshots" },
    { icon: Video, label: "Video", desc: "Movie clips" },
    { icon: Sparkles, label: "Audio", desc: "Soundtrack clips" },
    { icon: Zap, label: "Voice", desc: "Speak your search" },
    { icon: Brain, label: "AI", desc: "Smart recommendations" },
  ]

  const handleSearch = async () => {
    if (activeSearchType === "soundtrack") {
      handleSoundtrackSearch()
    } else if (activeSearchType === "screenshot") {
      handleScreenshotSearch()
    } else if (activeSearchType === "video") {
      handleVideoSearch()
    } else if (searchQuery.trim() || activeSearchType !== "scene") {
      // TODO: Call appropriate search API based on search type
      try {
        let endpoint = "/api/search/text"
        const payload: any = { query: searchQuery }

        switch (activeSearchType) {
          case "actor":
            endpoint = "/api/search/text"
            payload.type = "actor"
            break
          case "scene":
            endpoint = "/api/search/text"
            payload.type = "scene"
            break
          default:
            endpoint = "/api/search/text"
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        const results = await response.json()
        console.log("Search results:", results)

        setIsSearchModalOpen(true)
      } catch (error) {
        console.error("Search error:", error)
        setIsSearchModalOpen(true) // Still open modal for demo
      }
    }
  }

  const handleSoundtrackSearch = () => {
    if (isMicCancelled) {
      audioInputRef.current?.click()
      return
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
          setIsRecording(true)
          // TODO: Implement audio recording and send to /api/search/audio
          console.log("Recording audio for soundtrack search...")

          // Stop recording after 10 seconds for demo
          setTimeout(() => {
            stream.getTracks().forEach((track) => track.stop())
            setIsRecording(false)
            setIsSearchModalOpen(true)
          }, 10000)
        })
        .catch(() => {
          audioInputRef.current?.click()
        })
    } else {
      audioInputRef.current?.click()
    }
  }

  const handleScreenshotSearch = () => {
    imageInputRef.current?.click()
  }

  const handleVideoSearch = () => {
    if (isCameraCancelled) {
      videoInputRef.current?.click()
      return
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => {
          // TODO: Implement video recording and send to /api/search/video
          console.log("Recording video for search...")
          setIsSearchModalOpen(true)
        })
        .catch(() => {
          videoInputRef.current?.click()
        })
    } else {
      videoInputRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]

      // TODO: Upload file and call appropriate search API
      const formData = new FormData()
      formData.append("file", file)

      try {
        let endpoint = "/api/search/image"

        if (file.type.startsWith("audio/")) {
          setActiveSearchType("soundtrack")
          endpoint = "/api/search/audio"
        } else if (file.type.startsWith("image/")) {
          setActiveSearchType("screenshot")
          endpoint = "/api/search/image"
        } else if (file.type.startsWith("video/")) {
          setActiveSearchType("video")
          endpoint = "/api/search/video"
        }

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        })

        const results = await response.json()
        console.log("File search results:", results)

        setIsSearchModalOpen(true)
      } catch (error) {
        console.error("File search error:", error)
        setIsSearchModalOpen(true) // Still open modal for demo
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text")
    if (
      pastedText.includes("drive.google.com") ||
      pastedText.includes("dropbox.com") ||
      pastedText.includes("onedrive.com")
    ) {
      setSearchQuery(pastedText)
      setIsSearchModalOpen(true)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Upload file and call appropriate search API
      const formData = new FormData()
      formData.append("file", file)

      try {
        let endpoint = "/api/search/image"

        switch (type) {
          case "audio":
            endpoint = "/api/search/audio"
            break
          case "image":
            endpoint = "/api/search/image"
            break
          case "video":
            endpoint = "/api/search/video"
            break
        }

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        })

        const results = await response.json()
        console.log("File upload search results:", results)

        setIsSearchModalOpen(true)
      } catch (error) {
        console.error("File upload search error:", error)
        setIsSearchModalOpen(true) // Still open modal for demo
      }
    }
  }

  const handleSearchTypeChange = (typeId: typeof activeSearchType) => {
    setActiveSearchType(typeId)
    if (typeId !== "soundtrack") {
      setIsMicCancelled(false)
    }
    if (typeId !== "video") {
      setIsCameraCancelled(false)
    }
  }

  const handleMicIconClick = () => {
    setIsMicCancelled(true)
  }

  const handleCameraIconClick = () => {
    setIsCameraCancelled(true)
  }

  const currentSearchType = searchTypes.find((type) => type.id === activeSearchType)!

  const getSearchIcon = () => {
    if (activeSearchType === "soundtrack") {
      if (isMicCancelled) {
        return <X className="w-5 h-5 text-red-400/60" />
      }
      return (
        <Mic
          className="w-5 h-5 text-white/60 cursor-pointer hover:text-red-400/60 transition-colors"
          onClick={handleMicIconClick}
        />
      )
    } else if (activeSearchType === "video") {
      if (isCameraCancelled) {
        return <X className="w-5 h-5 text-red-400/60" />
      }
      return (
        <Camera
          className="w-5 h-5 text-white/60 cursor-pointer hover:text-red-400/60 transition-colors"
          onClick={handleCameraIconClick}
        />
      )
    }
    return <Search className="w-5 h-5" />
  }

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Main heading */}
          <div className="mb-8">
            <Badge className="mb-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2">
              🎬 AI-Powered Movie Discovery
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Any Movie
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Any Way You Want
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Search by scene descriptions, upload screenshots, hum a soundtrack, or speak your query. Our AI
              understands it all.
            </p>
          </div>

          {/* Search methods grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {searchMethods.map((method, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={onSearchClick}
              >
                <div
                  className={`
                  bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 
                  transition-all duration-300 hover:bg-gray-700/50 hover:border-teal-500
                  ${hoveredFeature === index ? "scale-105 shadow-xl shadow-teal-500/20" : ""}
                `}
                >
                  <method.icon className="w-8 h-8 text-teal-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-medium text-sm mb-1">{method.label}</h3>
                  <p className="text-gray-400 text-xs">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <div className="space-y-6">
            <Button
              onClick={onSearchClick}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105"
            >
              <Search className="w-6 h-6 mr-3" />
              Start Searching Movies
            </Button>

            <p className="text-gray-400 text-sm">No sign-up required • Powered by advanced AI • Free to use</p>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/30 transition-all duration-300">
              <Brain className="w-10 h-10 text-teal-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">AI-Powered Recognition</h3>
              <p className="text-gray-400">
                Advanced machine learning identifies movies from any input - images, audio, video, or text descriptions.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/30 transition-all duration-300">
              <Sparkles className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Multiple Search Methods</h3>
              <p className="text-gray-400">
                Search by scene description, actor name, screenshot, soundtrack, video clip, or voice command.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/30 transition-all duration-300">
              <Zap className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Instant Results</h3>
              <p className="text-gray-400">
                Get accurate movie matches in seconds with confidence scores and streaming availability.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        searchType={activeSearchType}
      />
    </>
  )
}

export default MovieDetectHero
