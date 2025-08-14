"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MovieDetectHero } from "@/components/movie-detect-hero"
import { MovieCarousels } from "@/components/movie-carousels"
import { HowItWorks } from "@/components/how-it-works"
import { EmailCapture } from "@/components/email-capture"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { SearchModal } from "@/components/search-modal"

export default function HomePage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("")

  const handleSearchClick = (query?: string, type?: string) => {
    if (query) setSearchQuery(query)
    if (type) setSearchType(type)
    setIsSearchModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <MovieDetectHero />
      <MovieCarousels />
      <HowItWorks />
      <EmailCapture />
      <Footer />
      <ScrollToTop />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        searchType={searchType}
      />
    </div>
  )
}
