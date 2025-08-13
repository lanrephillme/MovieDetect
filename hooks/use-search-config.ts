"use client"

import { useState, useCallback } from "react"

interface SearchConfig {
  isPlaceholderMode: boolean
  enableRealSearch: () => void
  enablePlaceholder: () => void
}

export function useSearchConfig(): SearchConfig {
  // Set to true to show placeholder, false to use real search
  const [isPlaceholderMode, setIsPlaceholderMode] = useState(true)

  const enableRealSearch = useCallback(() => {
    setIsPlaceholderMode(false)
  }, [])

  const enablePlaceholder = useCallback(() => {
    setIsPlaceholderMode(true)
  }, [])

  return {
    isPlaceholderMode,
    enableRealSearch,
    enablePlaceholder,
  }
}
