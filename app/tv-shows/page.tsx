"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { MovieCarousels } from "@/components/movie-carousels"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AIAssistant } from "@/components/ai-assistant"
import { Search, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TVShowsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("popularity")

  const showStatuses = ["Airing", "Ended", "Upcoming", "Cancelled"]
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0E17" }}>
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Binge-Worthy
              <span className="block" style={{ color: "#00E6E6" }}>
                TV Shows
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From gripping dramas to hilarious comedies, discover your next obsession with our curated collection of TV
              shows.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search TV shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Status Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(null)}
                className={
                  selectedStatus === null
                    ? "bg-[#00E6E6] text-[#0B0E17]"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                }
              >
                All Shows
              </Button>
              {showStatuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={
                    selectedStatus === status
                      ? "bg-[#00E6E6] text-[#0B0E17]"
                      : "border-gray-700 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TV Show Carousels */}
      <MovieCarousels />

      <Footer />
      <ScrollToTop />
      <AIAssistant />
    </div>
  )
}
