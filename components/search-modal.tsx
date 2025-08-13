"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchPlaceholder } from "@/components/search-placeholder"
import { useSearchConfig } from "@/hooks/use-search-config"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  searchType: "scene" | "actor" | "soundtrack" | "screenshot" | "video"
}

export function SearchModal({ isOpen, onClose, searchQuery, searchType }: SearchModalProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const { isPlaceholderMode } = useSearchConfig()
  const router = useRouter()

  useEffect(() => {
    if (isOpen && searchQuery && isPlaceholderMode) {
      setShowPlaceholder(true)
    }
  }, [isOpen, searchQuery, isPlaceholderMode])

  const handleClose = () => {
    setShowPlaceholder(false)
    onClose()
  }

  if (!isOpen) return null

  // Show placeholder when in placeholder mode
  if (showPlaceholder && isPlaceholderMode) {
    return <SearchPlaceholder searchQuery={searchQuery} searchType={searchType} onClose={handleClose} />
  }

  // Original search modal UI for when placeholder mode is disabled
  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Search className="w-6 h-6 text-teal-400" />
              <h2 className="text-2xl font-bold text-white">Search Results</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">Searching movies...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
