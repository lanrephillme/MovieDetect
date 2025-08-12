"use client"

import type React from "react"

import { useState } from "react"
import { Search, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate password reset process
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsEmailSent(true)
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-black to-emerald-900/20" />

        <div className="relative w-full max-w-md">
          <Card className="bg-black/60 backdrop-blur-md border-gray-800 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-teal-400" />
              </div>
              <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
              <CardDescription className="text-gray-400">
                We've sent a password reset link to <strong className="text-white">{email}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-400">Didn't receive the email? Check your spam folder or try again.</p>
                <Button
                  onClick={() => setIsEmailSent(false)}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400"
                >
                  Try Different Email
                </Button>
                <Link href="/login">
                  <Button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-black to-emerald-900/20" />

      <div className="relative w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center text-gray-400 hover:text-teal-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Link>

        <Card className="bg-black/60 backdrop-blur-md border-gray-800 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                MovieDetect
              </span>
            </div>
            <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10 bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
              >
                {isLoading ? "Sending reset link..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400">
              Remember your password?{" "}
              <Link href="/login" className="text-teal-400 hover:text-teal-300">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
