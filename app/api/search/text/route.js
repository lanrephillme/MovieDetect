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
    const allMovies = [
      {
        id: 1,
        title: "Dune: Part Two",
        poster: "/dune-part-two-poster.png",
        rating: 8.8,
        year: 2024,
        genre: ["Sci-Fi", "Adventure"],
        description:
          "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      },
      {
        id: 2,
        title: "The Batman",
        poster: "/batman-2022-poster.png",
        rating: 8.2,
        year: 2022,
        genre: ["Action", "Crime"],
        description:
          "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
      },
      {
        id: 3,
        title: "Spider-Man: Across the Spider-Verse",
        poster: "/spider-man-across-spider-verse-inspired-poster.png",
        rating: 8.7,
        year: 2023,
        genre: ["Animation", "Action"],
        description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.",
      },
    ]

    // Simple search filter
    const results = allMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some((g) => g.toLowerCase().includes(query.toLowerCase())) ||
        movie.description.toLowerCase().includes(query.toLowerCase()),
    )

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      query,
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
