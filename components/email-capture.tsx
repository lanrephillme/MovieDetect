"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      // Handle email submission here
    }
  }

  return (
    <div className="py-20 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-3xl blur-3xl" />
          <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-12 space-y-8">
            {!isSubmitted ? (
              <>
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Get Early Access</h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Be the first to experience the future of movie discovery. Join our waitlist for exclusive early
                    access and updates.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                      required
                    />
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-6"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>

                <p className="text-sm text-gray-500">No spam, ever. Unsubscribe at any time.</p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">You're on the list!</h2>
                <p className="text-xl text-gray-300">
                  Thanks for joining our waitlist. We'll notify you as soon as MovieDetect is ready.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
