import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { query } = await request.json()

    if (!query) {
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
        id: 101,
        title: "The Dark Knight",
        poster: "/dark-knight-poster.png",
        rating: 9.0,
        year: 2008,
        genre: ["Action", "Crime"],
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
        relevanceScore: 95,
      },
      {
        id: 102,
        title: "Batman Begins",
        poster: "/batman-2022-poster.png",
        rating: 8.2,
        year: 2005,
        genre: ["Action", "Adventure"],
        description: "After training with his mentor, Batman begins his fight to free crime-ridden Gotham City.",
        relevanceScore: 88,
      },
      {
        id: 103,
        title: "The Batman",
        poster: "/batman-2022-poster.png",
        rating: 7.8,
        year: 2022,
        genre: ["Action", "Crime"],
        description:
          "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind cryptic clues.",
        relevanceScore: 92,
      },
    ].filter(
      (movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some((g) => g.toLowerCase().includes(query.toLowerCase())),
    )

    return NextResponse.json({
      success: true,
      data: searchResults,
      query,
      total: searchResults.length,
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
