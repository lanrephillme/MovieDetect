"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCarousels } from "@/components/movie-carousels"
import { AIAssistant } from "@/components/ai-assistant"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Genre {
  id: number
  name: string
  description: string
  image: string
  movieCount: number
  color: string
}

const genres: Genre[] = [
  {
    id: 1,
    name: "Action",
    description: "High-octane thrills and explosive adventures",
    image: "/john-wick-chapter-4-inspired-poster.png",
    movieCount: 1250,
    color: "from-red-600 to-orange-600",
  },
  {
    id: 2,
    name: "Sci-Fi",
    description: "Explore the future and beyond",
    image: "/blade-runner-2049-poster.png",
    movieCount: 890,
    color: "from-blue-600 to-purple-600",
  },
  {
    id: 3,
    name: "Horror",
    description: "Spine-chilling tales that will haunt you",
    image: "/placeholder.svg",
    movieCount: 670,
    color: "from-gray-800 to-black",
  },
  {
    id: 4,
    name: "Comedy",
    description: "Laugh out loud with the best comedies",
    image: "/cocaine-bear-comedy-poster.png",
    movieCount: 1100,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: 5,
    name: "Drama",
    description: "Powerful stories that touch the heart",
    image: "/images/posters/oppenheimer-poster.png",
    movieCount: 1450,
    color: "from-purple-600 to-pink-600",
  },
  {
    id: 6,
    name: "Romance",
    description: "Love stories that warm the heart",
    image: "/her-ai-romance-movie-poster.png",
    movieCount: 780,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 7,
    name: "Thriller",
    description: "Edge-of-your-seat suspense",
    image: "/glass-onion-poster.png",
    movieCount: 920,
    color: "from-gray-700 to-gray-900",
  },
  {
    id: 8,
    name: "Animation",
    description: "Animated adventures for all ages",
    image: "/spider-man-across-spider-verse-inspired-poster.png",
    movieCount: 560,
    color: "from-green-500 to-blue-500",
  },
  {
    id: 9,
    name: "Fantasy",
    description: "Magical worlds and mythical creatures",
    image: "/placeholder.svg",
    movieCount: 640,
    color: "from-indigo-600 to-purple-700",
  },
]

export default function GenresPage() {
  const [hoveredGenre, setHoveredGenre] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-[#0B0E17]">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">Genres</h1>
          <p className="text-[#B3B3B3] mb-8">Browse movies and shows by your favorite genres.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[
              "Action",
              "Comedy",
              "Drama",
              "Horror",
              "Sci-Fi",
              "Romance",
              "Thriller",
              "Adventure",
              "Animation",
              "Crime",
              "Fantasy",
              "Mystery",
            ].map((genre) => (
              <div
                key={genre}
                className="bg-[#1F2937] hover:bg-[#00E6E6] hover:text-[#0B0E17] text-white p-4 rounded-lg text-center cursor-pointer transition-all duration-300"
              >
                {genre}
              </div>
            ))}
          </div>
          {/* Genres Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {genres.map((genre) => (
              <Card
                key={genre.id}
                className="bg-[#1F2937] border-[#1F2937] hover:border-[#00E6E6] transition-all duration-300 group overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredGenre(genre.id)}
                onMouseLeave={() => setHoveredGenre(null)}
              >
                <CardContent className="p-0 relative h-64">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={genre.image || "/placeholder.svg"}
                      alt={genre.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${genre.color} opacity-80`} />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{genre.name}</h3>
                      <p className="text-gray-200 text-sm mb-4">{genre.description}</p>
                      <p className="text-[#00E6E6] text-sm font-medium">{genre.movieCount.toLocaleString()} titles</p>
                    </div>

                    {/* Action Button */}
                    <div
                      className={`transition-all duration-300 ${hoveredGenre === genre.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    >
                      <Link href={`/movies?genre=${genre.name.toLowerCase()}`}>
                        <Button className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Explore {genre.name}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <MovieCarousels />
        </div>
      </div>
      <AIAssistant />
      <Footer />
    </main>
  )
}
