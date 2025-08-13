"use client"

import { useState } from "react"

// Configuration hook for search functionality
export function useSearchConfig() {
  // Set this to false when your API is ready
  const [isPlaceholderMode, setIsPlaceholderMode] = useState(true)

  const enableRealSearch = () => setIsPlaceholderMode(false)
  const enablePlaceholder = () => setIsPlaceholderMode(true)

  return {
    isPlaceholderMode,
    enableRealSearch,
    enablePlaceholder,
  }
}
