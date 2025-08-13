import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { movieId, movie } = await request.json()

    if (!movieId || !movie) {
      return NextResponse.json(
        {
          success: false,
          error: "Movie ID and movie data are required",
        },
        { status: 400 },
      )
    }

    // In a real app, you would save to database
    // For now, we'll just simulate success
    console.log(`Adding movie ${movieId} to watchlist:`, movie)

    return NextResponse.json({
      success: true,
      message: "Movie added to watchlist successfully",
      data: {
        movieId,
        addedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add movie to watchlist",
      },
      { status: 500 },
    )
  }
}
