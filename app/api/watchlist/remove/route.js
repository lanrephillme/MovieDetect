import { NextResponse } from "next/server"

export async function DELETE(request) {
  try {
    const { movieId, userId } = await request.json()

    if (!movieId) {
      return NextResponse.json({ success: false, error: "Movie ID is required" }, { status: 400 })
    }

    // In a real app, you would remove from database
    // For now, we'll simulate a successful removal
    return NextResponse.json({
      success: true,
      message: "Movie removed from watchlist successfully",
      data: { movieId, userId: userId || "demo-user" },
    })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json({ success: false, error: "Failed to remove movie from watchlist" }, { status: 500 })
  }
}
