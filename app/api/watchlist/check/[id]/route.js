import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Movie ID is required",
        },
        { status: 400 },
      )
    }

    // TODO: Check if movie is in user's watchlist from database
    // const userId = await getUserIdFromSession(request)
    // const watchlistItem = await db.watchlist.findFirst({
    //   where: { userId, movieId: parseInt(id) }
    // })

    // Mock response for demo
    const inWatchlist = Math.random() > 0.7 // Random for demo

    return NextResponse.json({
      success: true,
      inWatchlist,
      movieId: Number.parseInt(id),
    })
  } catch (error) {
    console.error("Error checking watchlist:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check watchlist status",
      },
      { status: 500 },
    )
  }
}
