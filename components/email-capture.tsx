"use client"

import type React from "react"

import { useState } from "react"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage("Thanks for subscribing! Check your email for confirmation.")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error. Please try again later.")
    }
  }

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with{" "}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              MovieDetect
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get notified about new features, movie recommendations, and exclusive content. Join our community of movie
            enthusiasts!
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500 focus:ring-teal-500/20"
                disabled={status === "loading"}
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold px-6 whitespace-nowrap"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>

            {status === "success" && (
              <div className="flex items-center justify-center text-green-400 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                {message}
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center justify-center text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {message}
              </div>
            )}
          </form>

          <p className="text-gray-400 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
