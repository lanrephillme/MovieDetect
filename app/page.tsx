"use client"

import { Header } from "@/components/header"
import { MovieDetectHero } from "@/components/movie-detect-hero"
import { MovieCarousels } from "@/components/movie-carousels"
import { AIAssistant } from "@/components/ai-assistant"
import { ScrollToTop } from "@/components/scroll-to-top"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0E17]">
      <Header />
      <main>
        <MovieDetectHero />
        <MovieCarousels />
      </main>
      <AIAssistant />
      <ScrollToTop />
    </div>
  )
}
