"use client"

import { useState, useEffect } from "react"
import { Search, Users, Film, TrendingUp, Settings, Eye, Plus, Edit, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface AdminStats {
  totalUsers: number
  totalMovies: number
  totalSearches: number
  activeUsers: number
  premiumUsers: number
  revenue: number
}

interface User {
  id: number
  name: string
  email: string
  subscription: string
  joinDate: string
  lastActive: string
  searches: number
}

interface Movie {
  id: number
  title: string
  year: number
  views: number
  rating: number
  status: "active" | "pending" | "disabled"
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "movies" | "analytics">("overview")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // TODO: Replace with actual API calls
      const [statsResponse, usersResponse, moviesResponse] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
        fetch("/api/admin/movies"),
      ])

      const statsData = await statsResponse.json()
      const usersData = await usersResponse.json()
      const moviesData = await moviesResponse.json()

      setStats(statsData.stats)
      setUsers(usersData.users)
      setMovies(moviesData.movies)
    } catch (error) {
      console.error("Error fetching admin data:", error)
      // Fallback mock data for demo
      setStats({
        totalUsers: 15420,
        totalMovies: 8934,
        totalSearches: 234567,
        activeUsers: 3421,
        premiumUsers: 1205,
        revenue: 45230,
      })
      setUsers([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          subscription: "Pro",
          joinDate: "2024-01-15",
          lastActive: "2024-01-20",
          searches: 145,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          subscription: "Free",
          joinDate: "2024-01-10",
          lastActive: "2024-01-19",
          searches: 23,
        },
      ])
      setMovies([
        {
          id: 1,
          title: "Blade Runner 2049",
          year: 2017,
          views: 15420,
          rating: 8.0,
          status: "active",
        },
        {
          id: 2,
          title: "The Matrix",
          year: 1999,
          views: 23456,
          rating: 8.7,
          status: "active",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: number, action: "suspend" | "activate" | "delete") => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      const result = await response.json()
      console.log("User action result:", result)

      // Refresh user data
      fetchAdminData()
    } catch (error) {
      console.error("Error performing user action:", error)
    }
  }

  const handleMovieAction = async (movieId: number, action: "activate" | "disable" | "delete") => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/admin/movies/${movieId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      const result = await response.json()
      console.log("Movie action result:", result)

      // Refresh movie data
      fetchAdminData()
    } catch (error) {
      console.error("Error performing movie action:", error)
    }
  }

  const exportData = async (type: "users" | "movies" | "analytics") => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/admin/export/${type}`)
      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-export-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-teal-900/10" />

      <div className="relative">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 backdrop-blur-md bg-black/30 border-b border-gray-800">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              MovieDetect Admin
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
              >
                Back to Site
              </Button>
            </Link>
          </div>
        </nav>

        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-1">
              {[
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "users", label: "Users", icon: Users },
                { id: "movies", label: "Movies", icon: Film },
                { id: "analytics", label: "Analytics", icon: Eye },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-500 to-teal-500 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardContent className="p-6 text-center">
                      <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats?.totalUsers.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Total Users</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardContent className="p-6 text-center">
                      <Film className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats?.totalMovies.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Total Movies</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardContent className="p-6 text-center">
                      <Search className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats?.totalSearches.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Total Searches</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardContent className="p-6 text-center">
                      <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats?.activeUsers.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Active Users</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats?.premiumUsers.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Premium Users</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-green-400">${stats?.revenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">Monthly Revenue</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Users</CardTitle>
                      <CardDescription className="text-gray-400">Latest user registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {users.slice(0, 5).map((user) => (
                          <div key={user.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                            <Badge
                              className={
                                user.subscription === "Pro"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-gray-500/20 text-gray-400"
                              }
                            >
                              {user.subscription}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Popular Movies</CardTitle>
                      <CardDescription className="text-gray-400">Most viewed this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {movies.slice(0, 5).map((movie) => (
                          <div key={movie.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{movie.title}</p>
                              <p className="text-sm text-gray-400">{movie.year}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white">{movie.views.toLocaleString()} views</p>
                              <p className="text-sm text-gray-400">★ {movie.rating}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">User Management</h2>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => exportData("users")}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-800">
                          <tr>
                            <th className="text-left p-4 text-gray-300">User</th>
                            <th className="text-left p-4 text-gray-300">Subscription</th>
                            <th className="text-left p-4 text-gray-300">Joined</th>
                            <th className="text-left p-4 text-gray-300">Last Active</th>
                            <th className="text-left p-4 text-gray-300">Searches</th>
                            <th className="text-left p-4 text-gray-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-800/50">
                              <td className="p-4">
                                <div>
                                  <p className="text-white font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge
                                  className={
                                    user.subscription === "Pro"
                                      ? "bg-purple-500/20 text-purple-400"
                                      : "bg-gray-500/20 text-gray-400"
                                  }
                                >
                                  {user.subscription}
                                </Badge>
                              </td>
                              <td className="p-4 text-gray-300">{user.joinDate}</td>
                              <td className="p-4 text-gray-300">{user.lastActive}</td>
                              <td className="p-4 text-gray-300">{user.searches}</td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
                                    onClick={() => handleUserAction(user.id, "activate")}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-transparent"
                                    onClick={() => handleUserAction(user.id, "delete")}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "movies" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Movie Management</h2>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => exportData("movies")}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-teal-500 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Movie
                    </Button>
                  </div>
                </div>

                <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-800">
                          <tr>
                            <th className="text-left p-4 text-gray-300">Movie</th>
                            <th className="text-left p-4 text-gray-300">Year</th>
                            <th className="text-left p-4 text-gray-300">Views</th>
                            <th className="text-left p-4 text-gray-300">Rating</th>
                            <th className="text-left p-4 text-gray-300">Status</th>
                            <th className="text-left p-4 text-gray-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movies.map((movie) => (
                            <tr key={movie.id} className="border-b border-gray-800/50">
                              <td className="p-4">
                                <p className="text-white font-medium">{movie.title}</p>
                              </td>
                              <td className="p-4 text-gray-300">{movie.year}</td>
                              <td className="p-4 text-gray-300">{movie.views.toLocaleString()}</td>
                              <td className="p-4 text-gray-300">★ {movie.rating}</td>
                              <td className="p-4">
                                <Badge
                                  className={
                                    movie.status === "active"
                                      ? "bg-green-500/20 text-green-400"
                                      : movie.status === "pending"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-red-500/20 text-red-400"
                                  }
                                >
                                  {movie.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400 bg-transparent"
                                    onClick={() => handleMovieAction(movie.id, "activate")}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 bg-transparent"
                                    onClick={() => handleMovieAction(movie.id, "delete")}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Analytics</h2>
                  <Button
                    onClick={() => exportData("analytics")}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Search Analytics</CardTitle>
                      <CardDescription className="text-gray-400">Search method usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { method: "Text Search", percentage: 65, count: 152340 },
                          { method: "Image Search", percentage: 20, count: 46890 },
                          { method: "Audio Search", percentage: 10, count: 23445 },
                          { method: "Video Search", percentage: 5, count: 11723 },
                        ].map((item) => (
                          <div key={item.method} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white font-medium">{item.method}</span>
                              <span className="text-sm text-gray-400">{item.count.toLocaleString()} searches</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 backdrop-blur-md border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">User Growth</CardTitle>
                      <CardDescription className="text-gray-400">Monthly user acquisition</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { month: "January", users: 1250, growth: "+12%" },
                          { month: "February", users: 1420, growth: "+14%" },
                          { month: "March", users: 1680, growth: "+18%" },
                          { month: "April", users: 1890, growth: "+12%" },
                        ].map((item) => (
                          <div key={item.month} className="flex items-center justify-between">
                            <span className="text-white font-medium">{item.month}</span>
                            <div className="text-right">
                              <p className="text-white">{item.users.toLocaleString()} users</p>
                              <p className="text-sm text-green-400">{item.growth}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
