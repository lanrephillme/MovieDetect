"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Mic, Camera, Upload, Video, User, X, Loader2, AlertCircle, Play, Plus, Star } from "lucide-react"
import Image from "next/image"

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
  synopsis: string
  confidence: number
  matchReason: string
}

const searchMethods = [
  {
    id: "text",
    label: "Text",
    icon: Search,
    description: "Describe the movie, title, actor, genre or anything you remember",
  },
  {
    id: "voice",
    label: "Voice",
    icon: Mic,
    description: "Tell us about the movie you're looking for",
  },
  {
    id: "image",
    label: "Image",
    icon: Camera,
    description: "Upload a movie poster or screenshot",
  },
  {
    id: "audio",
    label: "Audio",
    icon: Upload,
    description: "Upload soundtrack or scene audio",
  },
  {
    id: "video",
    label: "Video",
    icon: Video,
    description: "Upload a video clip from the movie",
  },
  {
    id: "face",
    label: "Face",
    icon: User,
    description: "Use camera to find movies by actor's face",
  },
]

export function SearchModal({ isOpen, onClose, searchQuery = "", searchType = "" }: SearchModalProps) {
  const [activeMethod, setActiveMethod] = useState(searchType || "text")
  const [query, setQuery] = useState(searchQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [errorMessage, setErrorMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  if (!isOpen) return null

  const handleSearch = async () => {
    if (!query.trim() && !uploadedFile && activeMethod === "text") return

    setIsSearching(true)
    setErrorMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResults: SearchResult[] = [
        {
          id: 1,
          title: "Dune: Part Two",
          year: 2024,
          poster: "/dune-part-two-poster.png",
          rating: 8.9,
          genre: ["Sci-Fi", "Adventure"],
          synopsis:
            "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
          confidence: 95,
          matchReason: "Perfect match for your search criteria",
        },
        {
          id: 2,
          title: "Blade Runner 2049",
          year: 2017,
          poster: "/blade-runner-2049-poster.png",
          rating: 8.2,
          genre: ["Sci-Fi", "Thriller"],
          synopsis:
            "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
          confidence: 87,
          matchReason: "Strong visual and thematic match",
        },
      ]

      setSearchResults(mockResults)
    } catch (error) {
      setErrorMessage("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
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
        handleSearch()
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
      setErrorMessage("Could not access microphone. Please check permissions.")
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
      handleSearch()
    }
  }

  const handleMethodAction = () => {
    switch (activeMethod) {
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
      case "face":
        fileInputRef.current?.click()
        break
      default:
        handleSearch()
    }
  }

  const getButtonContent = () => {
    if (isSearching) {
      return <Loader2 className="w-6 h-6 animate-spin" />
    }

    switch (activeMethod) {
      case "voice":
        return isRecording ? (
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mb-1" />
            <span className="text-xs">Stop</span>
          </div>
        ) : (
          <Mic className="w-6 h-6" />
        )
      case "image":
      case "face":
        return <Camera className="w-6 h-6" />
      case "audio":
        return <Upload className="w-6 h-6" />
      case "video":
        return <Video className="w-6 h-6" />
      default:
        return <Search className="w-6 h-6" />
    }
  }

  const currentMethod = searchMethods.find((m) => m.id === activeMethod)

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1F2937] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#00E6E6]/20">
          <h2 className="text-2xl font-bold text-white">AI-Powered Movie Search</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-[#B3B3B3] hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Search Methods */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Choose Your Search Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {searchMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setActiveMethod(method.id)
                    setErrorMessage("")
                    setSearchResults([])
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    activeMethod === method.id
                      ? "border-[#00E6E6] bg-[#00E6E6]/10"
                      : "border-[#0B0E17] bg-[#0B0E17] hover:border-[#00E6E6]/50"
                  }`}
                >
                  <method.icon
                    className={`w-6 h-6 mb-2 ${activeMethod === method.id ? "text-[#00E6E6]" : "text-[#B3B3B3]"}`}
                  />
                  <h4 className={`font-medium mb-1 ${activeMethod === method.id ? "text-[#00E6E6]" : "text-white"}`}>
                    {method.label}
                  </h4>
                  <p className="text-[#B3B3B3] text-sm">{method.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-200">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="mb-6">
            <div className="bg-[#0B0E17] rounded-xl p-6">
              {activeMethod === "text" && (
                <Input
                  placeholder={currentMethod?.description}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-[#1F2937] border-[#1F2937] text-white placeholder-[#B3B3B3] text-lg h-12 mb-4 focus:border-[#00E6E6]"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              )}

              {activeMethod !== "text" && (
                <div className="text-center py-6">
                  <p className="text-white text-lg mb-4">{currentMethod?.description}</p>
                  {isRecording && <p className="text-red-400 text-sm animate-pulse mb-4">Recording... Speak now</p>}
                  {uploadedFile && <p className="text-[#00E6E6] text-sm mb-4">File uploaded: {uploadedFile.name}</p>}
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleMethodAction}
                  disabled={isSearching || (activeMethod === "text" && !query.trim())}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording
                      ? "bg-red-500/80 hover:bg-red-500 animate-pulse"
                      : "bg-[#00E6E6]/20 hover:bg-[#00E6E6]/30 hover:scale-110"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {getButtonContent()}
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-4">Search Results</h3>
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <Card
                    key={result.id}
                    className="bg-[#0B0E17] border-[#00E6E6]/20 hover:border-[#00E6E6] transition-all"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Image
                          src={result.poster || "/placeholder.svg"}
                          alt={result.title}
                          width={80}
                          height={120}
                          className="rounded-lg flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-white font-semibold text-lg">{result.title}</h4>
                              <div className="flex items-center gap-2 text-[#B3B3B3] text-sm">
                                <span>{result.year}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span>{result.rating}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-600 text-white">{result.confidence}% Match</Badge>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {result.genre.map((g) => (
                              <Badge key={g} variant="outline" className="text-xs border-[#00E6E6] text-[#00E6E6]">
                                {g}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-[#B3B3B3] text-sm mb-2 line-clamp-2">{result.synopsis}</p>
                          <p className="text-[#00E6E6] text-xs mb-3">{result.matchReason}</p>

                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                              <Play className="w-4 h-4 mr-1" />
                              Watch
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17] bg-transparent"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Watchlist
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
          {isSearching && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-[#00E6E6] animate-spin mx-auto mb-4" />
              <p className="text-white text-xl">Searching with AI...</p>
              <p className="text-[#B3B3B3]">Analyzing your request...</p>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={
            activeMethod === "image" || activeMethod === "face"
              ? "image/*"
              : activeMethod === "audio"
                ? "audio/*"
                : activeMethod === "video"
                  ? "video/*"
                  : "*/*"
          }
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
