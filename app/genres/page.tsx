"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Star } from "lucide-react"
import Image from "next/image"

const genreData = [
  {
    id: 1,
    name: "Action",
    description: "High-octane thrills and adrenaline-pumping adventures",
    movieCount: 1250,
    color: "from-red-500 to-orange-500",
    image: "/placeholder.svg?height=300&width=500&text=Action+Movies",
    topMovies: [
      { title: "John Wick: Chapter 4", rating: 7.8, year: 2023 },
      { title: "Fast X", rating: 5.8, year: 2023 },
      { title: "The Batman", rating: 7.8, year: 2022 },
    ],
  },
  {
    id: 2,
    name: "Comedy",
    description: "Laugh-out-loud moments and feel-good entertainment",
    movieCount: 890,
    color: "from-yellow-400 to-orange-400",
    image: "/placeholder.svg?height=300&width=500&text=Comedy+Movies",
    topMovies: [
      { title: "Cocaine Bear", rating: 5.9, year: 2023 },
      { title: "The Menu", rating: 7.2, year: 2022 },
      { title: "Glass Onion", rating: 7.2, year: 2022 },
    ],
  },
  {
    id: 3,
    name: "Drama",
    description: "Compelling stories that touch the heart and mind",
    movieCount: 2100,
    color: "from-blue-500 to-purple-500",
    image: "/placeholder.svg?height=300&width=500&text=Drama+Movies",
    topMovies: [
      { title: "Everything Everywhere All at Once", rating: 7.8, year: 2022 },
      { title: "The Batman", rating: 7.8, year: 2022 },
      { title: "Dune: Part Two", rating: 8.8, year: 2024 },
    ],
  },
  {
    id: 4,
    name: "Horror",
    description: "Spine-chilling tales that will keep you on edge",
    movieCount: 650,
    color: "from-purple-600 to-red-600",
    image: "/placeholder.svg?height=300&width=500&text=Horror+Movies",
    topMovies: [
      { title: "Scream VI", rating: 6.5, year: 2023 },
      { title: "M3GAN", rating: 6.3, year: 2023 },
      { title: "Barbarian", rating: 7.0, year: 2022 },
    ],
  },
  {
    id: 5,
    name: "Sci-Fi",
    description: "Futuristic worlds and mind-bending concepts",
    movieCount: 780,
    color: "from-cyan-400 to-blue-600",
    image: "/placeholder.svg?height=300&width=500&text=Sci-Fi+Movies",
    topMovies: [
      { title: "Dune: Part Two", rating: 8.8, year: 2024 },
      { title: "Everything Everywhere All at Once", rating: 7.8, year: 2022 },
      { title: "Avatar: The Way of Water", rating: 7.6, year: 2022 },
    ],
  },
  {
    id: 6,
    name: "Romance",
    description: "Love stories that warm the heart",
    movieCount: 920,
    color: "from-pink-400 to-red-400",
    image: "/placeholder.svg?height=300&width=500&text=Romance+Movies",
    topMovies: [
      { title: "Top Gun: Maverick", rating: 8.3, year: 2022 },
      { title: "The Notebook", rating: 7.8, year: 2004 },
      { title: "La La Land", rating: 8.0, year: 2016 },
    ],
  },
  {
    id: 7,
    name: "Thriller",
    description: "Edge-of-your-seat suspense and mystery",
    movieCount: 1100,
    color: "from-gray-600 to-gray-800",
    image: "/placeholder.svg?height=300&width=500&text=Thriller+Movies",
    topMovies: [
      { title: "Glass Onion", rating: 7.2, year: 2022 },
      { title: "The Menu", rating: 7.2, year: 2022 },
      { title: "Nope", rating: 6.8, year: 2022 },
    ],
  },
  {
    id: 8,
    name: "Animation",
    description: "Animated adventures for all ages",
    movieCount: 540,
    color: "from-green-400 to-blue-500",
    image: "/placeholder.svg?height=300&width=500&text=Animation+Movies",
    topMovies: [
      { title: "Spider-Man: Across the Spider-Verse", rating: 8.7, year: 2023 },
      { title: "The Super Mario Bros. Movie", rating: 7.0, year: 2023 },
      { title: "Turning Red", rating: 7.0, year: 2022 },
    ],
  },
]

export default function GenresPage() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)

  const handleGenreClick = (genreId: number) => {
    // In a real app, this would navigate to a filtered movies page
    console.log(`Navigate to ${genreData.find((g) => g.id === genreId)?.name} movies`)
  }

  return (
    <div className="min-h-screen bg-[#0B0E17]">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Explore by <span className="gradient-text">Genre</span>
          </h1>
          <p className="text-[#B3B3B3] text-lg max-w-3xl mx-auto">
            Discover your next favorite movie or TV show by browsing through our carefully curated genres. From
            heart-pounding action to tear-jerking dramas, find exactly what you're in the mood for.
          </p>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {genreData.map((genre) => (
            <Card
              key={genre.id}
              className="movie-card bg-[#1F2937] border-[#1F2937] overflow-hidden cursor-pointer group"
              onClick={() => handleGenreClick(genre.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80`} />
                <Image
                  src={genre.image || "/placeholder.svg"}
                  alt={genre.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Genre Info Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{genre.name}</h3>
                    <p className="text-white/90 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {genre.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-white/20 text-white border-white/30">
                        {genre.movieCount.toLocaleString()} titles
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Movies Preview */}
              <CardContent className="p-4">
                <h4 className="text-white font-semibold mb-3">Top in {genre.name}</h4>
                <div className="space-y-2">
                  {genre.topMovies.map((movie, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[#00E6E6] font-bold">#{index + 1}</span>
                        <span className="text-white truncate">{movie.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#B3B3B3]">
                        <Star className="w-3 h-3 fill-current text-yellow-400" />
                        <span>{movie.rating}</span>
                        <span>({movie.year})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Genre Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Trending <span className="gradient-text">This Week</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Action */}
            <Card className="bg-[#1F2937] border-[#1F2937] overflow-hidden">
              <div className="relative h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 opacity-80" />
                <Image
                  src="/placeholder.svg?height=300&width=600&text=Action+Spotlight"
                  alt="Action Spotlight"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">Action Movies</h3>
                    <p className="text-white/90 mb-4">Experience the thrill</p>
                    <Button className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Featured Sci-Fi */}
            <Card className="bg-[#1F2937] border-[#1F2937] overflow-hidden">
              <div className="relative h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-80" />
                <Image
                  src="/placeholder.svg?height=300&width=600&text=Sci-Fi+Spotlight"
                  alt="Sci-Fi Spotlight"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-2">Sci-Fi Adventures</h3>
                    <p className="text-white/90 mb-4">Explore the future</p>
                    <Button className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                      <Play className="w-4 h-4 mr-2" />
                      Discover
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Our <span className="gradient-text">Collection</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#1F2937] rounded-lg p-6">
              <div className="text-3xl font-bold text-[#00E6E6] mb-2">
                {genreData.reduce((sum, genre) => sum + genre.movieCount, 0).toLocaleString()}
              </div>
              <div className="text-[#B3B3B3]">Total Titles</div>
            </div>
            <div className="bg-[#1F2937] rounded-lg p-6">
              <div className="text-3xl font-bold text-[#00E6E6] mb-2">{genreData.length}</div>
              <div className="text-[#B3B3B3]">Genres</div>
            </div>
            <div className="bg-[#1F2937] rounded-lg p-6">
              <div className="text-3xl font-bold text-[#00E6E6] mb-2">4K</div>
              <div className="text-[#B3B3B3]">Ultra HD</div>
            </div>
            <div className="bg-[#1F2937] rounded-lg p-6">
              <div className="text-3xl font-bold text-[#00E6E6] mb-2">24/7</div>
              <div className="text-[#B3B3B3]">Streaming</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
