"use client"

import { useState } from "react"
import { Search, User, Bell, Shield, Palette, Globe, Download, Trash2, ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile Settings
    displayName: "Alex Johnson",
    email: "alex.johnson@email.com",
    bio: "Movie enthusiast with a passion for sci-fi and indie films.",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    newReleases: true,
    watchlistReminders: false,

    // Privacy Settings
    profileVisibility: "public",
    watchlistVisibility: "friends",
    activityVisibility: "private",

    // Preferences
    theme: "dark",
    language: "en",
    autoplay: false,
    qualityPreference: "hd",
  })

  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Save settings logic here
    setHasChanges(false)
    console.log("Settings saved:", settings)
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Account deletion requested")
    }
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

          <div className="flex items-center space-x-4">
            {hasChanges && (
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
            <Link
              href="/profile"
              className="inline-flex items-center text-gray-400 hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
          </div>
        </nav>

        {/* Header */}
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Account Settings</h1>
            <p className="text-gray-400 mt-2">Manage your account preferences and privacy settings</p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="px-6 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Profile Settings */}
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <User className="w-5 h-5 text-teal-400" />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-gray-300">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => updateSetting("displayName", e.target.value)}
                      className="bg-black/50 border-gray-600 text-white focus:border-teal-400 focus:ring-teal-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting("email", e.target.value)}
                      className="bg-black/50 border-gray-600 text-white focus:border-teal-400 focus:ring-teal-400/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => updateSetting("bio", e.target.value)}
                    className="w-full p-3 bg-black/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20 resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Bell className="w-5 h-5 text-teal-400" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-white">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications" className="text-white">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-gray-400">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyDigest" className="text-white">
                        Weekly Digest
                      </Label>
                      <p className="text-sm text-gray-400">Get a weekly summary of new movies and recommendations</p>
                    </div>
                    <Switch
                      id="weeklyDigest"
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) => updateSetting("weeklyDigest", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newReleases" className="text-white">
                        New Releases
                      </Label>
                      <p className="text-sm text-gray-400">Get notified about new movie releases</p>
                    </div>
                    <Switch
                      id="newReleases"
                      checked={settings.newReleases}
                      onCheckedChange={(checked) => updateSetting("newReleases", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="watchlistReminders" className="text-white">
                        Watchlist Reminders
                      </Label>
                      <p className="text-sm text-gray-400">Remind you about movies in your watchlist</p>
                    </div>
                    <Switch
                      id="watchlistReminders"
                      checked={settings.watchlistReminders}
                      onCheckedChange={(checked) => updateSetting("watchlistReminders", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Shield className="w-5 h-5 text-teal-400" />
                  <span>Privacy & Security</span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Control who can see your profile and activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility" className="text-gray-300">
                      Profile Visibility
                    </Label>
                    <select
                      id="profileVisibility"
                      value={settings.profileVisibility}
                      onChange={(e) => updateSetting("profileVisibility", e.target.value)}
                      className="w-full p-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-teal-400 focus:ring-teal-400/20"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="watchlistVisibility" className="text-gray-300">
                      Watchlist Visibility
                    </Label>
                    <select
                      id="watchlistVisibility"
                      value={settings.watchlistVisibility}
                      onChange={(e) => updateSetting("watchlistVisibility", e.target.value)}
                      className="w-full p-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-teal-400 focus:ring-teal-400/20"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activityVisibility" className="text-gray-300">
                      Activity Visibility
                    </Label>
                    <select
                      id="activityVisibility"
                      value={settings.activityVisibility}
                      onChange={(e) => updateSetting("activityVisibility", e.target.value)}
                      className="w-full p-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-teal-400 focus:ring-teal-400/20"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Palette className="w-5 h-5 text-teal-400" />
                  <span>Preferences</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Customize your MovieDetect experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-gray-300">
                      Theme
                    </Label>
                    <select
                      id="theme"
                      value={settings.theme}
                      onChange={(e) => updateSetting("theme", e.target.value)}
                      className="w-full p-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-teal-400 focus:ring-teal-400/20"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-300">
                      Language
                    </Label>
                    <select
                      id="language"
                      value={settings.language}
                      onChange={(e) => updateSetting("language", e.target.value)}
                      className="w-full p-2 bg-black/50 border border-gray-600 rounded-md text-white focus:border-teal-400 focus:ring-teal-400/20"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoplay" className="text-white">
                      Autoplay Trailers
                    </Label>
                    <p className="text-sm text-gray-400">Automatically play movie trailers on hover</p>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={settings.autoplay}
                    onCheckedChange={(checked) => updateSetting("autoplay", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data & Account */}
            <Card className="bg-black/40 backdrop-blur-md border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Download className="w-5 h-5 text-teal-400" />
                  <span>Data & Account</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Manage your data and account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Privacy Policy
                  </Button>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-gray-400 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    onClick={handleDeleteAccount}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
