"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCarousels } from "@/components/movie-carousels"
import { AIAssistant } from "@/components/ai-assistant"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Calendar, Clock, Users, Trophy } from "lucide-react"
import Image from "next/image"

interface SportEvent {
  id: number
  title: string
  sport: string
  teams: string[]
  date: string
  time: string
  status: "Live" | "Upcoming" | "Completed"
  thumbnail: string
  description: string
  venue: string
  viewers?: number
}

const sports = ["All", "Football", "Basketball", "Soccer", "Baseball", "Tennis", "Boxing", "MMA", "Hockey"]

const mockSportEvents: SportEvent[] = [
  {
    id: 1,
    title: "Super Bowl LVIII",
    sport: "Football",
    teams: ["Kansas City Chiefs", "San Francisco 49ers"],
    date: "2024-02-11",
    time: "18:30",
    status: "Completed",
    thumbnail: "/placeholder.svg",
    description: "The biggest game in American football featuring two powerhouse teams.",
    venue: "Allegiant Stadium, Las Vegas",
    viewers: 115000000,
  },
  {
    id: 2,
    title: "NBA Finals Game 7",
    sport: "Basketball",
    teams: ["Boston Celtics", "Dallas Mavericks"],
    date: "2024-06-23",
    time: "20:00",
    status: "Completed",
    thumbnail: "/placeholder.svg",
    description: "The decisive game seven of the NBA Finals championship series.",
    venue: "TD Garden, Boston",
    viewers: 28000000,
  },
  {
    id: 3,
    title: "UEFA Champions League Final",
    sport: "Soccer",
    teams: ["Real Madrid", "Borussia Dortmund"],
    date: "2024-06-01",
    time: "21:00",
    status: "Completed",
    thumbnail: "/placeholder.svg",
    description: "The pinnacle of European club football competition.",
    venue: "Wembley Stadium, London",
    viewers: 450000000,
  },
  {
    id: 4,
    title: "World Series Game 5",
    sport: "Baseball",
    teams: ["Los Angeles Dodgers", "New York Yankees"],
    date: "2024-10-30",
    time: "20:08",
    status: "Upcoming",
    thumbnail: "/placeholder.svg",
    description: "Historic matchup between two legendary baseball franchises.",
    venue: "Yankee Stadium, New York",
  },
  {
    id: 5,
    title: "Wimbledon Men's Final",
    sport: "Tennis",
    teams: ["Carlos Alcaraz", "Novak Djokovic"],
    date: "2024-07-14",
    time: "14:00",
    status: "Completed",
    thumbnail: "/placeholder.svg",
    description: "The most prestigious tennis tournament's championship match.",
    venue: "All England Club, London",
    viewers: 12000000,
  },
  {
    id: 6,
    title: "Heavyweight Championship",
    sport: "Boxing",
    teams: ["Tyson Fury", "Francis Ngannou"],
    date: "2024-12-15",
    time: "22:00",
    status: "Upcoming",
    thumbnail: "/placeholder.svg",
    description: "Undisputed heavyweight championship bout.",
    venue: "MGM Grand, Las Vegas",
  },
]

export default function SportsPage() {
  const [events, setEvents] = useState<SportEvent[]>(mockSportEvents)
  const [filteredEvents, setFilteredEvents] = useState<SportEvent[]>(mockSportEvents)
  const [selectedSport, setSelectedSport] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")

  useEffect(() => {
    let filtered = events

    // Filter by sport
    if (selectedSport !== "All") {
      filtered = filtered.filter((event) => event.sport === selectedSport)
    }

    // Filter by status
    if (selectedStatus !== "All") {
      filtered = filtered.filter((event) => event.status === selectedStatus)
    }

    // Sort by date (upcoming first, then recent)
    filtered.sort((a, b) => {
      if (a.status === "Upcoming" && b.status !== "Upcoming") return -1
      if (b.status === "Upcoming" && a.status !== "Upcoming") return 1
      if (a.status === "Live" && b.status !== "Live") return -1
      if (b.status === "Live" && a.status !== "Live") return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    setFilteredEvents(filtered)
  }, [events, selectedSport, selectedStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "bg-red-600 animate-pulse"
      case "Upcoming":
        return "bg-green-600"
      case "Completed":
        return "bg-gray-600"
      default:
        return "bg-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatViewers = (viewers?: number) => {
    if (!viewers) return ""
    if (viewers >= 1000000) {
      return `${(viewers / 1000000).toFixed(1)}M viewers`
    }
    if (viewers >= 1000) {
      return `${(viewers / 1000).toFixed(0)}K viewers`
    }
    return `${viewers} viewers`
  }

  return (
    <main className="min-h-screen bg-[#0B0E17]">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">Sports</h1>
          <p className="text-[#B3B3B3] mb-8">Watch live sports, documentaries, and sports-related content.</p>
        </div>
        <MovieCarousels />
      </div>
      <div className="pt-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Sport Filter */}
            <div>
              <h3 className="text-white mb-2">Sports</h3>
              <div className="flex flex-wrap gap-2">
                {sports.map((sport) => (
                  <Button
                    key={sport}
                    variant={selectedSport === sport ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSport(sport)}
                    className={
                      selectedSport === sport
                        ? "bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
                        : "border-[#1F2937] text-[#B3B3B3] hover:bg-[#1F2937] hover:text-white"
                    }
                  >
                    {sport}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-white mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {["All", "Live", "Upcoming", "Completed"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className={
                      selectedStatus === status
                        ? "bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
                        : "border-[#1F2937] text-[#B3B3B3] hover:bg-[#1F2937] hover:text-white"
                    }
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="bg-[#1F2937] border-[#1F2937] hover:border-[#00E6E6] transition-all duration-300 group"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={event.thumbnail || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />

                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold text-white ${getStatusColor(event.status)}`}
                    >
                      {event.status === "Live" ? "🔴 LIVE" : event.status}
                    </div>

                    {/* Sport Badge */}
                    <div className="absolute top-3 right-3 bg-[#00E6E6] text-[#0B0E17] px-2 py-1 rounded text-xs font-medium">
                      {event.sport}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                      <Button className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                        <Play className="w-5 h-5 mr-2" />
                        {event.status === "Live"
                          ? "Watch Live"
                          : event.status === "Upcoming"
                            ? "Set Reminder"
                            : "Watch Highlights"}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>

                    {/* Teams */}
                    <div className="flex items-center justify-center mb-3">
                      <span className="text-[#00E6E6] font-medium text-sm">{event.teams[0]}</span>
                      <span className="text-[#B3B3B3] mx-2">vs</span>
                      <span className="text-[#00E6E6] font-medium text-sm">{event.teams[1]}</span>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center gap-4 mb-3 text-[#B3B3B3] text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-1 mb-3 text-[#B3B3B3] text-sm">
                      <Trophy className="w-4 h-4" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>

                    {/* Viewers */}
                    {event.viewers && (
                      <div className="flex items-center gap-1 mb-3 text-[#00E6E6] text-sm">
                        <Users className="w-4 h-4" />
                        <span>{formatViewers(event.viewers)}</span>
                      </div>
                    )}

                    <p className="text-[#B3B3B3] text-sm line-clamp-2">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-white mb-4">No events found</h3>
              <p className="text-[#B3B3B3] mb-6">Try adjusting your filter criteria</p>
              <Button
                onClick={() => {
                  setSelectedSport("All")
                  setSelectedStatus("All")
                }}
                className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <AIAssistant />
      <Footer />
    </main>
  )
}
