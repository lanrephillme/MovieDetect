import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image")

    if (!imageFile) {
      return NextResponse.json(
        {
          success: false,
          error: "Image file is required",
        },
        { status: 400 },
      )
    }

    // Mock face search results
    const mockResults = [
      {
        id: 1,
        title: "John Wick: Chapter 4",
        poster: "/john-wick-chapter-4-inspired-poster.png",
        rating: 7.9,
        year: 2023,
        genre: ["Action", "Thriller"],
        description: "John Wick uncovers a path to defeating The High Table.",
        confidence: 0.94,
        matchType: "Actor recognition",
        detectedActor: "Keanu Reeves",
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockResults,
      total: mockResults.length,
      analysis: "Detected actor: Keanu Reeves",
    })
  } catch (error) {
    console.error("Error in face search:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform face search",
      },
      { status: 500 },
    )
  }
}
