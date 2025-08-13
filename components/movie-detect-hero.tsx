"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Search, Mic, ImageIcon, Video, User, Menu, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchModal } from "@/components/search-modal"

export function MovieDetectHero() {
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
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 grid grid-cols-8 gap-2 transform rotate-12 scale-150 opacity-20">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm"
                style={{
                  backgroundImage: `url(/placeholder.svg?height=300&width=200&query=movie-poster-${i % 10})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full opacity-60">
          <iframe
            src="https://my.spline.design/noirscene-AcYYkFVcm6oeORzoelh6NrW5/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: "none" }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[1px]" />

        <nav className="relative z-50 flex items-center justify-between px-6 py-3 backdrop-blur-xl bg-white/5 border-b border-white/10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">MovieDetect</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-3 py-1.5 text-sm text-white font-medium hover:bg-white/10 rounded-md transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="px-3 py-1.5 text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-1.5 text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="px-3 py-1.5 text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
            >
              Contact
            </Link>
            <Link
              href="/watchlist"
              className="px-3 py-1.5 text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
            >
              Watchlist
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/10 font-medium px-3 py-1.5 h-auto text-sm rounded-md"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-1.5 h-auto text-sm rounded-md transition-all duration-200">
                Get Started
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10 rounded-md w-8 h-8"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden absolute top-[73px] left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="flex flex-col p-6 space-y-1">
              <Link
                href="/"
                className="text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Contact
              </Link>
              <Link
                href="/watchlist"
                className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
              >
                Watchlist
              </Link>
              <div className="flex flex-col space-y-2 pt-4 mt-4 border-t border-white/10">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/10 justify-start w-full font-medium px-4 py-3 h-auto rounded-lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 w-full font-semibold px-4 py-3 h-auto rounded-lg shadow-lg transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div
          ref={dropZoneRef}
          className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="space-y-8">
              {/* Reduced font sizes for better balance */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-white tracking-tight">
                MovieDetect,{" "}
                <span className="block mt-2">
                  a place to{" "}
                  <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    discover
                  </span>{" "}
                  and{" "}
                  <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    search
                  </span>{" "}
                  movies.
                </span>
              </h1>

              <div className="flex flex-wrap justify-center gap-6 text-sm md:text-base text-gray-300 font-medium">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Multi-Modal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Instant Results</span>
                </div>
              </div>

              <p className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
                Find movies by describing scenes, uploading images, humming soundtracks, or recording video clips.
                <br />
                <span className="text-gray-300">Our advanced AI delivers precise results instantly.</span>
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPaste={handlePaste}
                  placeholder={
                    isDragOver
                      ? "Drop your file here..."
                      : activeSearchType === "soundtrack"
                        ? "Click to record audio or upload soundtrack..."
                        : activeSearchType === "video"
                          ? "Click to record video or upload clip..."
                          : currentSearchType.placeholder
                  }
                  className="w-full h-16 bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20 text-lg pl-14 pr-16"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  disabled={
                    activeSearchType === "soundtrack" ||
                    activeSearchType === "screenshot" ||
                    activeSearchType === "video"
                  }
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  {getSearchIcon()}
                </div>
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-2 bg-teal-600 hover:bg-teal-700 text-white h-12 px-6"
                >
                  <Search className="w-5 h-5" />
                </Button>
                {isDragOver && (
                  <div className="absolute inset-0 bg-teal-500/20 border-2 border-dashed border-teal-500 rounded-lg flex items-center justify-center">
                    <p className="text-teal-400 font-medium">Drop your file here</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {searchTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.id}
                      variant={activeSearchType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSearchTypeChange(type.id)}
                      className={`${
                        activeSearchType === type.id
                          ? "bg-teal-600 text-white border-transparent shadow-lg"
                          : "border-gray-500 text-gray-300 hover:border-teal-500 hover:text-teal-400 bg-black/30 backdrop-blur-sm"
                      } transition-all duration-200`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {type.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

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
