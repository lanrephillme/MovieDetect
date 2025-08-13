import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const videoFile = formData.get("video")

    if (!videoFile) {
      return NextResponse.json(
        {
          success: false,
          error: "Video file is required",
        },
        { status: 400 },
      )
    }

    // Mock video search results
    const mockResults = [
      {
        id: 1,
        title: "The Matrix",
        poster: "/matrix-movie-poster.png",
        rating: 8.7,
        year: 1999,
        genre: ["Sci-Fi", "Action"],
        description: "A computer programmer is led to fight an underground war against powerful computers.",
        confidence: 0.89,
        matchType: "Scene similarity",
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockResults,
      total: mockResults.length,
      analysis: "Detected action sequence with digital effects",
    })
  } catch (error) {
    console.error("Error in video search:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform video search",
      },
      { status: 500 },
    )
  }
}
