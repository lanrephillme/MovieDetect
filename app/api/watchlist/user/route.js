import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock user watchlist data
    const watchlistMovies = [
      {
        id: 31,
        title: "Dune: Part Two",
        poster: "/dune-part-two-poster.png",
        rating: 8.8,
        year: 2024,
        genre: ["Sci-Fi", "Adventure"],
        trailer: "https://example.com/dune2-trailer.mp4",
        description:
          "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        addedDate: "2024-01-15",
        watched: false,
      },
      {
        id: 32,
        title: "Oppenheimer",
        poster: "/images/posters/oppenheimer-poster.png",
        rating: 8.5,
        year: 2023,
        genre: ["Biography", "Drama"],
        trailer: "https://example.com/oppenheimer-trailer.mp4",
        description:
          "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        addedDate: "2024-01-10",
        watched: true,
      },
      {
        id: 33,
        title: "The Batman",
        poster: "/batman-2022-poster.png",
        rating: 8.2,
        year: 2022,
        genre: ["Action", "Crime"],
        trailer: "https://example.com/batman-trailer.mp4",
        description:
          "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
        addedDate: "2024-01-08",
        watched: true,
      },
      {
        id: 34,
        title: "Everything Everywhere All at Once",
        poster: "/eeaao-poster.png",
        rating: 8.1,
        year: 2022,
        genre: ["Sci-Fi", "Comedy"],
        trailer: "https://example.com/eeaao-trailer.mp4",
        description: "A middle-aged Chinese immigrant is swept up into an insane adventure.",
        addedDate: "2024-01-05",
        watched: false,
      },
      {
        id: 35,
        title: "John Wick: Chapter 4",
        poster: "/john-wick-chapter-4-inspired-poster.png",
        rating: 7.9,
        year: 2023,
        genre: ["Action", "Thriller"],
        trailer: "https://example.com/johnwick4-trailer.mp4",
        description: "John Wick uncovers a path to defeating The High Table.",
        addedDate: "2024-01-03",
        watched: false,
      },
    ]

    return NextResponse.json({
      success: true,
      data: watchlistMovies,
      total: watchlistMovies.length,
    })
  } catch (error) {
    console.error("Error fetching user watchlist:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user watchlist",
      },
      { status: 500 },
    )
  }
}
