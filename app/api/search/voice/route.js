import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio")

    if (!audioFile) {
      return NextResponse.json(
        {
          success: false,
          error: "Audio file is required",
        },
        { status: 400 },
      )
    }

    // Mock voice search results
    const mockResults = [
      {
        id: 1,
        title: "Her",
        poster: "/her-ai-romance-movie-poster.png",
        rating: 8.0,
        year: 2013,
        genre: ["Romance", "Sci-Fi"],
        description: "A sensitive writer develops an unlikely relationship with an operating system.",
        confidence: 0.95,
        transcription: "Find movies about AI and love",
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockResults,
      total: mockResults.length,
      transcription: "Find movies about AI and love",
    })
  } catch (error) {
    console.error("Error in voice search:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform voice search",
      },
      { status: 500 },
    )
  }
}
