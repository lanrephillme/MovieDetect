"use client"

import { Search, Brain, Database, Heart, Share2, Zap, Target, Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const features = [
  {
    icon: Search,
    title: "Advanced Search Methods",
    description: "Multiple ways to find movies using AI-powered recognition",
    details: [
      "Natural language scene descriptions",
      "Actor/actress name autocomplete",
      "Audio recognition from soundtracks",
      "Image recognition from screenshots",
      "Video clip frame analysis",
    ],
  },
  {
    icon: Brain,
    title: "AI Confidence Scoring",
    description: "Get confidence ratings for every search result",
    details: [
      "Machine learning accuracy scores",
      "Multiple data source verification",
      "Real-time result ranking",
      "Contextual relevance matching",
    ],
  },
  {
    icon: Database,
    title: "Comprehensive Movie Database",
    description: "Access to extensive movie metadata from multiple sources",
    details: [
      "TMDb integration for latest releases",
      "IMDb ratings and reviews",
      "Cast and crew information",
      "Plot summaries and trivia",
      "Release dates and box office data",
    ],
  },
  {
    icon: Target,
    title: "Smart Recommendations",
    description: "Personalized movie suggestions based on your preferences",
    details: [
      "AI-powered recommendation engine",
      "Genre and mood-based suggestions",
      "Similar movie discovery",
      "Trending and popular content",
      "Collaborative filtering algorithms",
    ],
  },
  {
    icon: Heart,
    title: "Watchlist Management",
    description: "Organize and track your movie discoveries",
    details: [
      "Personal watchlist creation",
      "Custom categories and tags",
      "Progress tracking",
      "Reminder notifications",
      "Cross-device synchronization",
    ],
  },
  {
    icon: Share2,
    title: "Social Features",
    description: "Share discoveries and connect with other movie enthusiasts",
    details: [
      "Share movie recommendations",
      "Create public watchlists",
      "Follow other users",
      "Community discussions",
      "Social media integration",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background gradient */}
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

        {/* Hero Section */}
        <div className="px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <Badge className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Revolutionary Movie
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                {" "}
                Discovery Features
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of movie search with our comprehensive suite of AI-powered tools designed to help
              you find any movie, no matter how vague your memory.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={index}
                    className="bg-black/40 backdrop-blur-md border-gray-800 hover:border-teal-500/50 transition-all duration-300 group"
                  >
                    <CardHeader className="space-y-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center group-hover:from-teal-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                        <Icon className="w-6 h-6 text-teal-400" />
                      </div>
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                      <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="px-6 py-16 bg-gradient-to-r from-teal-900/10 to-emerald-900/10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">How MovieDetect Works</h2>
              <p className="text-xl text-gray-300">
                Our advanced AI processes your input through multiple recognition systems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Input Your Memory</h3>
                <p className="text-gray-400">
                  Describe a scene, upload an image, hum a tune, or enter an actor's name - any fragment of memory
                  works.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white">AI Analysis</h3>
                <p className="text-gray-400">
                  Our AI processes your input through multiple recognition systems and cross-references vast movie
                  databases.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Get Results</h3>
                <p className="text-gray-400">
                  Receive ranked results with confidence scores, detailed information, and personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-8 h-8 text-teal-400" />
              <h2 className="text-3xl font-bold text-white">Privacy & Security</h2>
            </div>
            <p className="text-xl text-gray-300">
              Your data is protected with enterprise-grade security and privacy measures
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Data Protection</h3>
                <p className="text-gray-400">All uploads and searches are encrypted and processed securely</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Privacy First</h3>
                <p className="text-gray-400">We don't store your personal media files after processing</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">GDPR Compliant</h3>
                <p className="text-gray-400">Full compliance with international privacy regulations</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Transparent AI</h3>
                <p className="text-gray-400">Clear confidence scores and explainable AI results</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-16 bg-gradient-to-r from-teal-900/20 to-emerald-900/20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to Discover Movies Like Never Before?</h2>
            <p className="text-xl text-gray-300">Join thousands of movie enthusiasts using AI-powered search</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3 text-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 px-8 py-3 text-lg bg-transparent"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
