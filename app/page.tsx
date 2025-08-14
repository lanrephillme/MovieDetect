import { Header } from "@/components/header"
import { MovieDetectHero } from "@/components/movie-detect-hero"
import { MovieCarousels } from "@/components/movie-carousels"
import { AIAssistant } from "@/components/ai-assistant"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0E17]">
      <Header />
      <MovieDetectHero />
      <MovieCarousels />
      <AIAssistant />
      <Footer />
    </main>
  )
}
