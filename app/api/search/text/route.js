import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { query } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query is required",
        },
        { status: 400 },
      )
    }

    // Mock search results based on query
    const searchResults = [
      {
        id: 1,
        title: "The Dark Knight",
        poster: "/dark-knight-poster.png",
        rating: 9.0,
        year: 2008,
        genre: ["Action", "Crime", "Drama"],
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        matchScore: 95,
        matchReason: "Title match",
      },
      {
        id: 2,
        title: "Batman Begins",
        poster: "/placeholder.svg?height=400&width=300&text=Batman+Begins",
        rating: 8.2,
        year: 2005,
        genre: ["Action", "Crime"],
        description:
          "After training with his mentor, Batman begins his fight to free crime-ridden Gotham City from corruption.",
        matchScore: 88,
        matchReason: "Related character",
      },
      {
        id: 3,
        title: "The Batman",
        poster: "/batman-2022-poster.png",
        rating: 7.8,
        year: 2022,
        genre: ["Action", "Crime", "Drama"],
        description:
          "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
        matchScore: 85,
        matchReason: "Character match",
      },
    ]

    // Filter results based on query (simple mock logic)
    const filteredResults = searchResults.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some((g) => g.toLowerCase().includes(query.toLowerCase())),
    )

    return NextResponse.json({
      success: true,
      data: filteredResults,
      query: query,
      total: filteredResults.length,
      searchType: "text",
    })
  } catch (error) {
    console.error("Error in text search:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform text search",
      },
      { status: 500 },
    )
  }
}
