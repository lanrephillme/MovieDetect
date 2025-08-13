"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Search, Mic, ImageIcon, Video, User, X, Camera, Upload, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SearchModal } from "@/components/search-modal"

const MovieDetectHero: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearchType, setActiveSearchType] = useState<"scene" | "actor" | "soundtrack" | "screenshot" | "video">(
    "scene",
  )
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isMicCancelled, setIsMicCancelled] = useState(false)
  const [isCameraCancelled, setIsCameraCancelled] = useState(false)
  const [isRecording, setIsRecording] = useState(false) // Declared setIsRecording variable
  const audioInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

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

  const handleSearch = async (type: string) => {
    if (type === "soundtrack") {
      handleSoundtrackSearch()
    } else if (type === "screenshot") {
      handleScreenshotSearch()
    } else if (type === "video") {
      handleVideoSearch()
    } else if (searchQuery.trim() || type !== "scene") {
      // TODO: Call appropriate search API based on search type
      try {
        let endpoint = "/api/search/text"
        const payload: any = { query: searchQuery }

        switch (type) {
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
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Main heading */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Find Any Movie
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Describe It Any Way
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Can't remember the title? No problem! Describe scenes, upload images, hum soundtracks, or record video
              clips. Our AI will find it.
            </p>
          </div>

          {/* Search input */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Describe the movie... 'A movie about dreams within dreams' or 'That film with the spinning top'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-6 pr-16 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Button
                onClick={() => handleSearch("text")}
                className="absolute right-2 top-2 h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 border-0"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search methods */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Upload Image</h3>
                <p className="text-gray-400 text-sm">Screenshot or poster</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Hum Soundtrack</h3>
                <p className="text-gray-400 text-sm">Audio recognition</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Record Clip</h3>
                <p className="text-gray-400 text-sm">Video analysis</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Face Search</h3>
                <p className="text-gray-400 text-sm">Actor recognition</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Try MovieDetect AI
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full text-lg font-semibold backdrop-blur-sm bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">50M+</div>
              <div className="text-gray-400 text-sm">Movies Identified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-gray-400 text-sm">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">2M+</div>
              <div className="text-gray-400 text-sm">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, "audio")}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, "image")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, "video")}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        searchType={activeSearchType}
      />
    </>
  )
}

export { MovieDetectHero }
export default MovieDetectHero
