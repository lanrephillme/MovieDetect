"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, Users, MapPin, Play, Star } from "lucide-react"
import Image from "next/image"

const mockSportsEvents = [
  {
    id: 1,
    title: "UEFA Champions League Final",
    sport: "Football",
    teams: ["Manchester City", "Inter Milan"],
    date: "2024-06-10",
    time: "20:00",
    venue: "Wembley Stadium, London",
    status: "Live",
    viewers: "1.2M",
    rating: 9.2,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Champions+League",
    description: "The biggest club competition in European football reaches its climax.",
  },
  {
    id: 2,
    title: "NBA Finals Game 7",
    sport: "Basketball",
    teams: ["Boston Celtics", "Miami Heat"],
    date: "2024-06-15",
    time: "21:00",
    venue: "TD Garden, Boston",
    status: "Upcoming",
    viewers: "890K",
    rating: 8.9,
    thumbnail: "/placeholder.svg?height=200&width=300&text=NBA+Finals",
    description: "Winner takes all in this decisive Game 7 of the NBA Finals.",
  },
  {
    id: 3,
    title: "Wimbledon Men's Final",
    sport: "Tennis",
    teams: ["Novak Djokovic", "Carlos Alcaraz"],
    date: "2024-07-14",
    time: "14:00",
    venue: "All England Club, London",
    status: "Upcoming",
    viewers: "650K",
    rating: 8.7,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Wimbledon",
    description: "The most prestigious tennis tournament reaches its men's singles final.",
  },
  {
    id: 4,
    title: "Formula 1 Monaco Grand Prix",
    sport: "Racing",
    teams: ["Max Verstappen", "Lewis Hamilton"],
    date: "2024-05-26",
    time: "15:00",
    venue: "Circuit de Monaco",
    status: "Ended",
    viewers: "1.5M",
    rating: 9.1,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Monaco+GP",
    description: "The jewel in the crown of Formula 1 racing calendar.",
  },
  {
    id: 5,
    title: "Super Bowl LVIII",
    sport: "American Football",
    teams: ["Kansas City Chiefs", "Philadelphia Eagles"],
    date: "2024-02-11",
    time: "18:30",
    venue: "Allegiant Stadium, Las Vegas",
    status: "Ended",
    viewers: "2.1M",
    rating: 9.5,
    thumbnail: "/placeholder.svg?height=200&width=300&text=Super+Bowl",
    description: "The biggest sporting event in America returns to Las Vegas.",
  },
  {
    id: 6,
    title: "World Cup Final",
    sport: "Football",
    teams: ["Argentina", "France"],
    date: "2022-12-18",
    time: "16:00",
    venue: "Lusail Stadium, Qatar",
    status: "Ended",
    viewers: "3.2M",
    rating: 9.8,
    thumbnail: "/placeholder.svg?height=200&width=300&text=World+Cup",
    description: "The greatest football match ever played - a final for the ages.",
  },
]

const sportsCategories = ["All", "Football", "Basketball", "Tennis", "Racing", "American Football"]
const statusOptions = ["All", "Live", "Upcoming", "Ended"]

export default function SportsPage() {
  const [events, setEvents] = useState(mockSportsEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    filterEvents()
  }, [searchTerm, selectedSport, selectedStatus])

  const filterEvents = () => {
    setIsLoading(true)

    setTimeout(() => {
      const filtered = mockSportsEvents.filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.teams.some((team) => team.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesSport = selectedSport === "All" || event.sport === selectedSport
        const matchesStatus = selectedStatus === "All" || event.status === selectedStatus
        return matchesSearch && matchesSport && matchesStatus
      })

      // Sort by status priority: Live > Upcoming > Ended
      filtered.sort((a, b) => {
        const statusPriority = { Live: 3, Upcoming: 2, Ended: 1 }
        return statusPriority[b.status] - statusPriority[a.status]
      })

      setEvents(filtered)
      setIsLoading(false)
    }, 500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-red-500"
      case "Upcoming":
        return "bg-green-500"
      case "Ended":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E17]">
      <Header />

      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Live <span className="gradient-text">Sports</span>
          </h1>
          <p className="text-[#B3B3B3] text-lg max-w-2xl">
            Watch live sports events, highlights, and replays from around the world. Never miss a moment of the action.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
            <Input
              placeholder="Search events, teams, or sports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1F2937] border-[#1F2937] text-white placeholder:text-[#B3B3B3] focus:border-[#00E6E6]"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Sport Filter */}
            <div className="flex flex-wrap gap-2">
              {sportsCategories.map((sport) => (
                <Button
                  key={sport}
                  variant={selectedSport === sport ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSport(sport)}
                  className={
                    selectedSport === sport
                      ? "bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
                      : "border-[#1F2937] text-[#B3B3B3] hover:border-[#00E6E6] hover:text-[#00E6E6]"
                  }
                >
                  {sport}
                </Button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#1F2937] border border-[#1F2937] text-white rounded-md px-3 py-2 focus:border-[#00E6E6] focus:outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Events Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🔴 Live Now</h2>
                <p className="text-red-100">Don't miss the action happening right now!</p>
              </div>
              <Button className="bg-white text-red-600 hover:bg-red-50">
                <Play className="w-4 h-4 mr-2" />
                Watch Live
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[#B3B3B3]">{isLoading ? "Loading..." : `${events.length} events found`}</p>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="loading">
                <div className="bg-[#1F2937] rounded-lg h-48 mb-4"></div>
                <div className="bg-[#1F2937] h-4 rounded mb-2"></div>
                <div className="bg-[#1F2937] h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="movie-card bg-[#1F2937] border-[#1F2937] overflow-hidden cursor-pointer">
                <div className="relative h-48">
                  <Image src={event.thumbnail || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${getStatusColor(event.status)} text-white font-semibold`}>
                      {event.status === "Live" && <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />}
                      {event.status}
                    </Badge>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-[#00E6E6] text-[#0B0E17] font-semibold">
                      <Star className="w-3 h-3 mr-1" />
                      {event.rating}
                    </Badge>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Button size="lg" className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] rounded-full">
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#00E6E6] text-sm mb-2">
                    <span className="font-semibold">{event.sport}</span>
                  </div>

                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{event.title}</h3>

                  {/* Teams */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-white text-sm font-medium">{event.teams[0]}</span>
                    <span className="text-[#B3B3B3]">vs</span>
                    <span className="text-white text-sm font-medium">{event.teams[1]}</span>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 text-[#B3B3B3] text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.viewers} viewers</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#B3B3B3] text-sm mt-3 line-clamp-2">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-semibold text-white mb-2">No sports events found</h3>
            <p className="text-[#B3B3B3] mb-4">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedSport("All")
                setSelectedStatus("All")
              }}
              className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Sports Categories Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Popular <span className="gradient-text">Sports</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sportsCategories.slice(1).map((sport) => (
              <Card
                key={sport}
                className="bg-[#1F2937] border-[#1F2937] cursor-pointer hover:border-[#00E6E6] transition-colors"
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">
                    {sport === "Football" && "⚽"}
                    {sport === "Basketball" && "🏀"}
                    {sport === "Tennis" && "🎾"}
                    {sport === "Racing" && "🏎️"}
                    {sport === "American Football" && "🏈"}
                  </div>
                  <h3 className="text-white font-semibold">{sport}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
