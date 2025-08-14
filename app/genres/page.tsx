"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MovieCarousels } from "@/components/movie-carousels"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AIAssistant } from "@/components/ai-assistant"
import { Film, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GenresPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [contentType, setContentType] = useState<"all" | "movies" | "tv">("all")

  const genres = [
    { name: "Action", icon: "💥", description: "High-octane thrills and excitement" },
    { name: "Adventure", icon: "🗺️", description: "Epic journeys and exploration" },
    { name: "Animation", icon: "🎨", description: "Animated stories for all ages" },
    { name: "Comedy", icon: "😂", description: "Laugh-out-loud entertainment" },
    { name: "Crime", icon: "🔍", description: "Mysteries and criminal investigations" },
    { name: "Documentary", icon: "📹", description: "Real stories and factual content" },
    { name: "Drama", icon: "🎭", description: "Emotional and character-driven stories" },
    { name: "Family", icon: "👨‍👩‍👧‍👦", description: "Perfect for family viewing" },
    { name: "Fantasy", icon: "🧙‍♂️", description: "Magical worlds and creatures" },
    { name: "History", icon: "📜", description: "Historical events and periods" },
    { name: "Horror", icon: "👻", description: "Spine-chilling scares" },
    { name: "Music", icon: "🎵", description: "Musical performances and stories" },
    { name: "Mystery", icon: "🔎", description: "Puzzles and suspenseful plots" },
    { name: "Romance", icon: "💕", description: "Love stories and relationships" },
    { name: "Sci-Fi", icon: "🚀", description: "Futuristic and scientific themes" },
    { name: "Thriller", icon: "⚡", description: "Edge-of-your-seat suspense" },
    { name: "War", icon: "⚔️", description: "Military conflicts and battles" },
    { name: "Western", icon: "🤠", description: "Wild West adventures" },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0E17" }}>
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Explore by
              <span className="block" style={{ color: "#00E6E6" }}>
                Genre
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover content tailored to your taste. Browse through different genres to find exactly what you're in
              the mood for.
            </p>
          </div>

          {/* Content Type Filter */}
          <div className="flex justify-center gap-2 mb-12">
            <Button
              variant={contentType === "all" ? "default" : "outline"}
              onClick={() => setContentType("all")}
              className={
                contentType === "all"
                  ? "bg-[#00E6E6] text-[#0B0E17]"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"
              }
            >
              All Content
            </Button>
            <Button
              variant={contentType === "movies" ? "default" : "outline"}
              onClick={() => setContentType("movies")}
              className={
                contentType === "movies"
                  ? "bg-[#00E6E6] text-[#0B0E17]"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"
              }
            >
              <Film className="w-4 h-4 mr-2" />
              Movies
            </Button>
            <Button
              variant={contentType === "tv" ? "default" : "outline"}
              onClick={() => setContentType("tv")}
              className={
                contentType === "tv" ? "bg-[#00E6E6] text-[#0B0E17]" : "border-gray-700 text-gray-300 hover:bg-gray-800"
              }
            >
              <Tv className="w-4 h-4 mr-2" />
              TV Shows
            </Button>
          </div>

          {/* Genre Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12">
            {genres.map((genre) => (
              <button
                key={genre.name}
                onClick={() => setSelectedGenre(genre.name)}
                className={`p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                  selectedGenre === genre.name
                    ? "border-[#00E6E6] bg-[#00E6E6]/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-[#00CCCC]"
                }`}
              >
                <div className="text-4xl mb-3">{genre.icon}</div>
                <h3 className="text-white font-semibold mb-2">{genre.name}</h3>
                <p className="text-gray-400 text-sm">{genre.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content based on selected genre */}
      {selectedGenre && (
        <section className="px-6 lg:px-8 pb-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {selectedGenre} {contentType === "movies" ? "Movies" : contentType === "tv" ? "TV Shows" : "Content"}
            </h2>
            <MovieCarousels />
          </div>
        </section>
      )}

      <Footer />
      <ScrollToTop />
      <AIAssistant />
    </div>
  )
}
