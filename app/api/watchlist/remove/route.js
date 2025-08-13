import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { movieId } = await request.json()

    if (!movieId) {
      return NextResponse.json(
        {
          success: false,
          error: "Movie ID is required",
        },
        { status: 400 },
      )
    }

    // In a real app, you would remove from database
    // For now, we'll just simulate success
    console.log(`Removing movie ${movieId} from watchlist`)

    return NextResponse.json({
      success: true,
      message: "Movie removed from watchlist successfully",
      data: {
        movieId,
        removedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove movie from watchlist",
      },
      { status: 500 },
    )
  }
}
