import { MovieDetectHero } from "@/components/movie-detect-hero"
import { MovieCarousels } from "@/components/movie-carousels"
import { HowItWorks } from "@/components/how-it-works"
import { EmailCapture } from "@/components/email-capture"
import { Footer } from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MovieDetectHero />
      <MovieCarousels />
      <HowItWorks />
      <EmailCapture />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
