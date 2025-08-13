import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock trending movies data
    const trendingMovies = [
      {
        id: 1,
        title: "Dune: Part Two",
        poster: "/dune-part-two-poster.png",
        rating: 8.8,
        year: 2024,
        genre: ["Sci-Fi", "Adventure"],
        trailer: "https://example.com/dune2-trailer.mp4",
        description:
          "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      },
      {
        id: 2,
        title: "Oppenheimer",
        poster: "/images/posters/oppenheimer-poster.png",
        rating: 8.5,
        year: 2023,
        genre: ["Biography", "Drama"],
        trailer: "https://example.com/oppenheimer-trailer.mp4",
        description:
          "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      },
      {
        id: 3,
        title: "Spider-Man: Across the Spider-Verse",
        poster: "/spider-man-across-spider-verse-inspired-poster.png",
        rating: 8.7,
        year: 2023,
        genre: ["Animation", "Action"],
        trailer: "https://example.com/spiderverse-trailer.mp4",
        description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.",
      },
      {
        id: 4,
        title: "Guardians of the Galaxy Vol. 3",
        poster: "/guardians-galaxy-vol-3-poster.png",
        rating: 8.1,
        year: 2023,
        genre: ["Action", "Comedy"],
        trailer: "https://example.com/gotg3-trailer.mp4",
        description: "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe.",
      },
      {
        id: 5,
        title: "John Wick: Chapter 4",
        poster: "/john-wick-chapter-4-inspired-poster.png",
        rating: 7.9,
        year: 2023,
        genre: ["Action", "Thriller"],
        trailer: "https://example.com/johnwick4-trailer.mp4",
        description: "John Wick uncovers a path to defeating The High Table.",
      },
      {
        id: 6,
        title: "Fast X",
        poster: "/fast-x-action-racing-poster.png",
        rating: 6.2,
        year: 2023,
        genre: ["Action", "Adventure"],
        trailer: "https://example.com/fastx-trailer.mp4",
        description: "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.",
      },
    ]

    return NextResponse.json({
      success: true,
      data: trendingMovies,
      total: trendingMovies.length,
    })
  } catch (error) {
    console.error("Error fetching trending movies:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trending movies",
      },
      { status: 500 },
    )
  }
}
