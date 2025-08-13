import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { movieId, userId } = await request.json()

    if (!movieId) {
      return NextResponse.json({ success: false, error: "Movie ID is required" }, { status: 400 })
    }

    // In a real app, you would save to database
    // For now, we'll simulate a successful addition
    const watchlistItem = {
      id: Date.now(),
      movieId,
      userId: userId || "demo-user",
      addedDate: new Date().toISOString(),
      watchStatus: "not_started",
    }

    return NextResponse.json({
      success: true,
      message: "Movie added to watchlist successfully",
      data: watchlistItem,
    })
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return NextResponse.json({ success: false, error: "Failed to add movie to watchlist" }, { status: 500 })
  }
}
