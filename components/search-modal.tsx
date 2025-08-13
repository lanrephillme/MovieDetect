"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Mic, ImageIcon, Upload, Video, Music, User, X, Camera, MicIcon, Loader2 } from "lucide-react"
import { useSearchConfig } from "@/hooks/use-search-config"
import { SearchPlaceholder } from "./search-placeholder"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchType, setSearchType] = useState<"text" | "voice" | "image" | "audio" | "video" | "face">("text")
  const [query, setQuery] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isPlaceholderMode } = useSearchConfig()

  const handleSearch = async (searchQuery: string, type: typeof searchType) => {
    if (!searchQuery.trim()) return

    setIsProcessing(true)

    if (isPlaceholderMode) {
      // Show placeholder after a brief delay
      setTimeout(() => {
        setIsProcessing(false)
        setShowResults(true)
      }, 1500)
    } else {
      // Real search implementation would go here
      try {
        const response = await fetch(`/api/search/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        })
        const results = await response.json()
        // Handle real results
        setIsProcessing(false)
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
        setIsProcessing(false)
      }
    }
  }

  const handleVoiceSearch = () => {
    setIsRecording(true)
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false)
      const mockQuery = "action movies with superheroes"
      setQuery(mockQuery)
      handleSearch(mockQuery, "voice")
    }, 3000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const mockQuery = `Uploaded ${searchType}: ${file.name}`
      setQuery(mockQuery)
      handleSearch(mockQuery, searchType)
    }
  }

  const searchTypes = [
    { type: "text" as const, icon: <Search className="w-4 h-4" />, label: "Text Search" },
    { type: "voice" as const, icon: <Mic className="w-4 h-4" />, label: "Voice Search" },
    { type: "image" as const, icon: <ImageIcon className="w-4 h-4" />, label: "Image Search" },
    { type: "audio" as const, icon: <Music className="w-4 h-4" />, label: "Audio Search" },
    { type: "video" as const, icon: <Video className="w-4 h-4" />, label: "Video Search" },
    { type: "face" as const, icon: <User className="w-4 h-4" />, label: "Face Recognition" },
  ]

  if (!isOpen) return null

  if (showResults) {
    return (
      <div className="fixed inset-0 z-50">
        <SearchPlaceholder searchType={searchType} query={query} />
        <Button
          onClick={() => {
            setShowResults(false)
            onClose()
          }}
          className="fixed top-4 right-4 z-60 bg-gray-800 hover:bg-gray-700"
          size="sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Search Movies</h2>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Type Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
            {searchTypes.map(({ type, icon, label }) => (
              <Button
                key={type}
                onClick={() => setSearchType(type)}
                variant={searchType === type ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  searchType === type
                    ? "bg-teal-600 hover:bg-teal-700"
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>

          {/* Search Input */}
          {searchType === "text" && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search for movies, actors, genres..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(query, "text")}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                onClick={() => handleSearch(query, "text")}
                disabled={isProcessing}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          )}

          {/* Voice Search */}
          {searchType === "voice" && (
            <div className="text-center mb-4">
              <Button
                onClick={handleVoiceSearch}
                disabled={isRecording || isProcessing}
                className={`w-32 h-32 rounded-full ${
                  isRecording ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {isRecording ? (
                  <div className="flex flex-col items-center">
                    <MicIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm">Listening...</span>
                  </div>
                ) : isProcessing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Mic className="w-8 h-8 mb-2" />
                    <span className="text-sm">Tap to speak</span>
                  </div>
                )}
              </Button>
              <p className="text-gray-400 mt-4">
                {isRecording
                  ? "Listening for your voice..."
                  : "Tap the microphone and describe the movie you're looking for"}
              </p>
            </div>
          )}

          {/* File Upload for Image/Audio/Video */}
          {["image", "audio", "video"].includes(searchType) && (
            <div className="text-center mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={searchType === "image" ? "image/*" : searchType === "audio" ? "audio/*" : "video/*"}
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="w-full bg-teal-600 hover:bg-teal-700 p-8"
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 mb-2" />
                    <span>Upload {searchType === "image" ? "Image" : searchType === "audio" ? "Audio" : "Video"}</span>
                  </div>
                )}
              </Button>
              <p className="text-gray-400 mt-4">
                Upload{" "}
                {searchType === "image"
                  ? "a movie poster or scene"
                  : searchType === "audio"
                    ? "a soundtrack or dialogue clip"
                    : "a movie trailer or scene"}
              </p>
            </div>
          )}

          {/* Face Recognition */}
          {searchType === "face" && (
            <div className="text-center mb-4">
              <Button
                onClick={() => {
                  const mockQuery = "Face recognition search initiated"
                  setQuery(mockQuery)
                  handleSearch(mockQuery, "face")
                }}
                disabled={isProcessing}
                className="w-full bg-teal-600 hover:bg-teal-700 p-8"
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <div className="flex flex-col items-center">
                    <Camera className="w-8 h-8 mb-2" />
                    <span>Start Face Recognition</span>
                  </div>
                )}
              </Button>
              <p className="text-gray-400 mt-4">Use your camera to find movies featuring specific actors</p>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
              🚀 AI-Powered Search Coming Soon
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
