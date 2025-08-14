"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AIAssistant } from "@/components/ai-assistant"
import { Search, Filter, Clock, MapPin, Trophy, Users, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface SportEvent {
  id: number
  title: string
  sport: string
  teams: string[]
  date: string
  time: string
  venue: string
  status: "live" | "upcoming" | "ended"
  thumbnail: string
  viewers?: number
}

export default function SportsPage() {
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const sports = ["Football", "Basketball", "Baseball", "Soccer", "Tennis", "Golf", "Hockey", "Boxing", "MMA", "Racing"]
  const statuses = ["Live", "Upcoming", "Ended"]

  const mockEvents: SportEvent[] = [
    {
      id: 1,
      title: "Championship Final",
      sport: "Football",
      teams: ["Team A", "Team B"],
      date: "2024-01-15",
      time: "8:00 PM",
      venue: "Stadium Arena",
      status: "live",
      thumbnail: "/placeholder.svg",
      viewers: 125000,
    },
    {
      id: 2,
      title: "Season Opener",
      sport: "Basketball",
      teams: ["Lakers", "Warriors"],
      date: "2024-01-16",
      time: "7:30 PM",
      venue: "Sports Center",
      status: "upcoming",
      thumbnail: "/placeholder.svg",
    },
    {
      id: 3,
      title: "World Cup Qualifier",
      sport: "Soccer",
      teams: ["Country A", "Country B"],
      date: "2024-01-14",
      time: "6:00 PM",
      venue: "National Stadium",
      status: "ended",
      thumbnail: "/placeholder.svg",
      viewers: 89000,
    },
  ]

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSport = !selectedSport || event.sport === selectedSport
    const matchesStatus = !selectedStatus || event.status === selectedStatus.toLowerCase()
    const matchesSearch =
      !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.teams.some((team) => team.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSport && matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500"
      case "upcoming":
        return "bg-blue-500"
      case "ended":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B0E17" }}>
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Live Sports
              <span className="block" style={{ color: "#00E6E6" }}>
                Events
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Never miss a game! Watch live sports events, catch up on highlights, and follow your favorite teams.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search events, teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Sport Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedSport === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSport(null)}
                className={
                  selectedSport === null
                    ? "bg-[#00E6E6] text-[#0B0E17]"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                }
              >
                All Sports
              </Button>
              {sports.map((sport) => (
                <Button
                  key={sport}
                  variant={selectedSport === sport ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSport(sport)}
                  className={
                    selectedSport === sport
                      ? "bg-[#00E6E6] text-[#0B0E17]"
                      : "border-gray-700 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {sport}
                </Button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 text-sm self-center mr-2">Status:</span>
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
                All
              </Button>
              {statuses.map((status) => (
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

      {/* Events Grid */}
      <section className="px-6 lg:px-8 pb-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={event.thumbnail || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=400&text=Sports+Event"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getStatusColor(event.status)} text-white`}>{event.status.toUpperCase()}</Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="lg"
                      className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] rounded-full w-16 h-16 p-0"
                    >
                      <Play className="w-8 h-8 ml-1" />
                    </Button>
                  </div>
                  {event.viewers && (
                    <div className="absolute bottom-4 right-4 bg-black/70 rounded-full px-3 py-1 flex items-center">
                      <Users className="w-4 h-4 text-white mr-1" />
                      <span className="text-white text-sm">{event.viewers.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-[#00E6E6] text-[#00E6E6]">
                      {event.sport}
                    </Badge>
                    <span className="text-gray-400 text-sm">{event.date}</span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>

                  <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                    <span>{event.teams.join(" vs ")}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-400 space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.venue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
      <AIAssistant />
    </div>
  )
}
