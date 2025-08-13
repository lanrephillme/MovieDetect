"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface TestResult {
  endpoint: string
  title: string
  status: "loading" | "success" | "error"
  data?: any
  error?: string
  responseTime?: number
}

export function CarouselTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([
    { endpoint: "/api/movies/trending", title: "Trending Movies", status: "loading" },
    { endpoint: "/api/movies/popular", title: "Popular This Week", status: "loading" },
    { endpoint: "/api/movies/new-releases", title: "New Releases", status: "loading" },
    { endpoint: "/api/recommendations", title: "AI Recommendations", status: "loading" },
    { endpoint: "/api/movies/top-rated", title: "Top Rated", status: "loading" },
    { endpoint: "/api/watchlist/user", title: "Your Watchlist", status: "loading" },
  ])

  const [isRunning, setIsRunning] = useState(false)

  const testEndpoint = async (endpoint: string, index: number) => {
    const startTime = Date.now()

    try {
      const response = await fetch(endpoint)
      const responseTime = Date.now() - startTime

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "API returned success: false")
      }

      setTestResults((prev) =>
        prev.map((result, i) =>
          i === index
            ? {
                ...result,
                status: "success",
                data,
                responseTime,
              }
            : result,
        ),
      )
    } catch (error) {
      const responseTime = Date.now() - startTime
      setTestResults((prev) =>
        prev.map((result, i) =>
          i === index
            ? {
                ...result,
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error",
                responseTime,
              }
            : result,
        ),
      )
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults((prev) => prev.map((result) => ({ ...result, status: "loading" })))

    // Test all endpoints in parallel
    await Promise.all(testResults.map((result, index) => testEndpoint(result.endpoint, index)))

    setIsRunning(false)
  }

  useEffect(() => {
    runAllTests()
  }, [])

  const successCount = testResults.filter((r) => r.status === "success").length
  const errorCount = testResults.filter((r) => r.status === "error").length
  const loadingCount = testResults.filter((r) => r.status === "loading").length

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Movie Carousel API Test</h2>
        <div className="flex items-center space-x-4 mb-4">
          <Badge variant={successCount === 6 ? "default" : "secondary"} className="bg-green-600">
            ✅ {successCount} Passed
          </Badge>
          <Badge variant={errorCount > 0 ? "destructive" : "secondary"}>❌ {errorCount} Failed</Badge>
          <Badge variant="secondary">⏳ {loadingCount} Loading</Badge>
        </div>
        <Button onClick={runAllTests} disabled={isRunning} className="bg-blue-600 hover:bg-blue-700">
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            "Run Tests Again"
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={result.endpoint} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {result.status === "loading" && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                {result.status === "success" && <CheckCircle className="w-5 h-5 text-green-400" />}
                {result.status === "error" && <XCircle className="w-5 h-5 text-red-400" />}
                <h3 className="text-lg font-semibold text-white">{result.title}</h3>
              </div>
              {result.responseTime && (
                <Badge variant="outline" className="text-gray-300">
                  {result.responseTime}ms
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-400 mb-2">{result.endpoint}</p>

            {result.status === "success" && result.data && (
              <div className="text-sm text-green-400">
                ✅ Success: {result.data.total || result.data.data?.length || 0} movies loaded
              </div>
            )}

            {result.status === "error" && <div className="text-sm text-red-400">❌ Error: {result.error}</div>}

            {result.status === "loading" && <div className="text-sm text-blue-400">⏳ Testing endpoint...</div>}
          </div>
        ))}
      </div>

      {successCount === 6 && (
        <div className="mt-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-2">🎉 All Tests Passed!</h3>
          <p className="text-green-300">
            All 6 movie carousels are working perfectly. The MovieDetect application is ready to use!
          </p>
        </div>
      )}
    </div>
  )
}
