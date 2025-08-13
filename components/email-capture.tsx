"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus("error")
      setMessage("Email is required")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message)
        setEmail("")
        setName("")
      } else {
        setStatus("error")
        setMessage(data.error)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to subscribe. Please try again.")
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <Mail className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get the latest movie recommendations, new features, and exclusive content delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={status === "loading"}
          />

          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={status === "loading"}
            required
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Subscribe to Newsletter
              </>
            )}
          </Button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg flex items-center justify-center space-x-2 ${
              status === "success"
                ? "bg-green-900/20 border border-green-600 text-green-400"
                : "bg-red-900/20 border border-red-600 text-red-400"
            }`}
          >
            {status === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message}</span>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-400">
          <p>We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  )
}
