"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "@/components/search-modal"
import { Play, Pause, Plus, Share2, Volume2, VolumeX, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface HeroMovie {
  id: number
  title: string
  year: number
  genre: string[]
  rating: number
  synopsis: string
  backdrop: string
  trailer: string
  duration: string
  director: string
  cast: string[]
}

const featuredMovies: HeroMovie[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    year: 2024,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    rating: 8.9,
    synopsis:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. When faced with a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
    backdrop: "/dune-part-two-poster.png",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "166 min",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
  },
  {
    id: 2,
    title: "Oppenheimer",
    year: 2023,
    genre: ["Drama", "Biography", "History"],
    rating: 8.7,
    synopsis:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    backdrop: "/images/posters/oppenheimer-poster.png",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "180 min",
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    genre: ["Animation", "Action", "Adventure"],
    rating: 8.8,
    synopsis:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    backdrop: "/spider-man-across-spider-verse-inspired-poster.png",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "140 min",
    director: "Joaquim Dos Santos",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Brian Tyree Henry"],
  },
  {
    id: 4,
    title: "John Wick: Chapter 4",
    year: 2023,
    genre: ["Action", "Thriller", "Crime"],
    rating: 8.2,
    synopsis:
      "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.",
    backdrop: "/john-wick-chapter-4-inspired-poster.png",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: "169 min",
    director: "Chad Stahelski",
    cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård"],
  },
  {
    id: 5,
    title: "Everything Everywhere All at Once",
    year: 2022,
    genre: ["Sci-Fi", "Comedy", "Drama"],
    rating: 8.9,
    synopsis:
      "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have lived.",
    backdrop: "/eeaao-poster.png",
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: "139 min",
    director: "Daniels",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan"],
  },
]

export function MovieDetectHero() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const currentMovie = featuredMovies[currentMovieIndex]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSearchOpen && !isFullscreen) {
        setIsPlaying(true)
        if (videoRef.current) {
          videoRef.current.play().catch(console.log)
        }
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentMovieIndex, isSearchOpen, isFullscreen])

  useEffect(() => {
    if (!isPlaying && !isFullscreen) {
      const interval = setInterval(() => {
        setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length)
      }, 8000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, isFullscreen])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      if (!isFullscreen) setShowControls(false)
    }

    const handlePause = () => {
      setIsPlaying(false)
      setShowControls(true)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setShowControls(true)
      if (!isFullscreen) {
        setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length)
      }
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handleEnded)
    }
  }, [isFullscreen])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(console.log)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setShowControls(true)
    if (!isFullscreen) {
      if (videoRef.current && !isPlaying) {
        videoRef.current.play().catch(console.log)
      }
    }
  }

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
    console.log(isInWatchlist ? "Removed from watchlist" : "Added to watchlist", currentMovie.title)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentMovie.title,
          text: currentMovie.synopsis,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      console.log("Link copied to clipboard")
    }
  }

  const nextMovie = () => {
    setCurrentMovieIndex((prev) => (prev + 1) % featuredMovies.length)
    setIsPlaying(false)
  }

  const prevMovie = () => {
    setCurrentMovieIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
    setIsPlaying(false)
  }

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <>
      {isFullscreen && (
        <div className="fullscreen-video">
          <video ref={videoRef} className="w-full h-full object-cover" muted={isMuted} playsInline controls={false}>
            <source src={currentMovie.trailer} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/20">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="bg-black/50 text-white hover:bg-black/70 rounded-full"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="bg-black/50 text-white hover:bg-black/70 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlay}
                className="bg-black/50 text-white hover:bg-black/70 rounded-full w-20 h-20"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-3xl font-bold text-white mb-2">{currentMovie.title}</h2>
              <p className="text-gray-200 max-w-2xl">{currentMovie.synopsis}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          {isPlaying && !isFullscreen ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isMuted}
              playsInline
              poster={currentMovie.backdrop}
            >
              <source src={currentMovie.trailer} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={currentMovie.backdrop || "/placeholder.svg"}
              alt={currentMovie.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg"
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E17]/90 via-[#0B0E17]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-transparent" />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={prevMovie}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMovie}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        <div className="absolute top-24 right-6 z-30 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        <div className="relative z-20 flex flex-col justify-center min-h-screen px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto w-full text-center">
            <div className="mb-12 animate-fadeIn">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Discover Movies with <span className="gradient-text">AI</span>
              </h1>
              <p className="text-lg md:text-xl text-[#B3B3B3] max-w-3xl mx-auto mb-8 leading-relaxed">
                MovieDetect revolutionizes how you discover entertainment. Use our advanced AI-powered search to find
                movies and TV shows through text, voice, images, videos, audio clips, or even face recognition. Simply
                describe what you're looking for, upload a screenshot, hum a tune, or show us a face - our AI will find
                exactly what you need.
              </p>
            </div>

            <div className="mb-16">
              <Button
                onClick={() => setIsSearchOpen(true)}
                size="lg"
                className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] text-lg px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#00E6E6]/25"
              >
                Explore Search Methods
              </Button>
            </div>

            {showControls && (
              <div className="animate-fadeIn">
                <div className="text-left max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{currentMovie.title}</h2>
                  <div className="flex items-center gap-4 text-[#B3B3B3] mb-4 flex-wrap">
                    <span className="bg-[#00E6E6] text-[#0B0E17] px-2 py-1 rounded font-semibold">
                      ⭐ {currentMovie.rating}
                    </span>
                    <span>{currentMovie.year}</span>
                    <span>{currentMovie.duration}</span>
                    <span>{currentMovie.genre.join(", ")}</span>
                  </div>
                  <p className="text-[#B3B3B3] mb-6 leading-relaxed">{currentMovie.synopsis}</p>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={toggleFullscreen}
                      size="lg"
                      className="bg-white text-black hover:bg-gray-200 font-semibold"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Watch Trailer
                    </Button>

                    <Button
                      onClick={handleAddToWatchlist}
                      variant="outline"
                      size="lg"
                      className={`font-semibold bg-transparent ${
                        isInWatchlist
                          ? "border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17]"
                          : "border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17]"
                      }`}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                    </Button>

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-black font-semibold bg-transparent"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="px-4 md:px-8 lg:px-16">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-white font-semibold">Featured Movies</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollCarousel("left")}
                  className="bg-black/50 text-white hover:bg-black/70 rounded-full w-8 h-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollCarousel("right")}
                  className="bg-black/50 text-white hover:bg-black/70 rounded-full w-8 h-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div ref={carouselRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {featuredMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => setCurrentMovieIndex(index)}
                  className={`flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    index === currentMovieIndex
                      ? "ring-2 ring-[#00E6E6] scale-105"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={movie.backdrop || "/placeholder.svg"}
                    alt={movie.title}
                    width={128}
                    height={192}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg"
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMovieIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentMovieIndex ? "bg-[#00E6E6] w-8" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
