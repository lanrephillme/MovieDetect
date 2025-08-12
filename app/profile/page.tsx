"use client"

import { useState } from "react"
import { Search, User, Mail, Calendar, Crown, Settings, Eye, Clock, Star, ArrowLeft, Camera, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const userStats = [
  { label: "Movies Watched", value: "247", icon: Eye },
  { label: "Hours Watched", value: "412", icon: Clock },
  { label: "Average Rating", value: "8.2", icon: Star },
  { label: "Watchlist Items", value: "89", icon: User },
]

const recentActivity = [
  {
    type: "watched",
    movie: "Dune: Part Two",
    date: "2024-01-15",
    rating: 9.0,
  },
  {
    type: "added",
    movie: "Oppenheimer",
    date: "2024-01-14",
  },
  {
    type: "rated",
    movie: "The Batman",
    date: "2024-01-13",
    rating: 8.5,
  },
  {
    type: "watched",
    movie: "Blade Runner 2049",
    date: "2024-01-12",
    rating: 8.8,
  },
]

const favoriteGenres = [
  { name: "Sci-Fi", count: 45, percentage: 85 },
  { name: "Drama", count: 38, percentage: 72 },
  { name: "Action", count: 32, percentage: 60 },
  { name: "Thriller", count: 28, percentage: 53 },
  { name: "Comedy", count: 22, percentage: 42 },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    joinDate: "January 2023",
    subscription: "Pro",
    bio: "Movie enthusiast with a passion for sci-fi and indie films. Always looking for hidden gems and underrated masterpieces.",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save user info logic here
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 via-black to-emerald-900/10" />

      <div className="relative">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 backdrop-blur-md bg-black/30">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              MovieDetect
            </span>
          </Link>

          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-teal-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </nav>

        {/* Profile Header */}
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src="/placeholder.svg" alt={userInfo.name} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white text-2xl">
                        {userInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {isEditing ? (
                          <Input
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            className="text-2xl font-bold bg-black/50 border-gray-600 text-white"
                          />
                        ) : (
                          <h1 className="text-3xl font-bold text-white">{userInfo.name}</h1>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span>{userInfo.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {userInfo.joinDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                          <Crown className="w-4 h-4 mr-1" />
                          {userInfo.subscription}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                          className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {isEditing ? "Save" : "Edit Profile"}
                        </Button>
                      </div>
                    </div>

                    <div>
                      {isEditing ? (
                        <textarea
                          value={userInfo.bio}
                          onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20 resize-none"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-300 max-w-2xl">{userInfo.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardContent className="p-6 text-center">
                      <Icon className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="px-6 pb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">Your latest movie interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "watched"
                            ? "bg-green-400"
                            : activity.type === "added"
                              ? "bg-blue-400"
                              : "bg-yellow-400"
                        }`}
                      />
                      <div>
                        <p className="text-white font-medium">{activity.movie}</p>
                        <p className="text-sm text-gray-400">
                          {activity.type === "watched"
                            ? "Watched"
                            : activity.type === "added"
                              ? "Added to watchlist"
                              : "Rated"}
                          {activity.rating && ` • ${activity.rating}/10`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Favorite Genres */}
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Favorite Genres</CardTitle>
                <CardDescription className="text-gray-400">Based on your viewing history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {favoriteGenres.map((genre, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{genre.name}</span>
                      <span className="text-sm text-gray-400">{genre.count} movies</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${genre.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/watchlist">
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white">
                      View Watchlist
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
