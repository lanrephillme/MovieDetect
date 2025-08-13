import { NextResponse } from "next/server"

export async function GET() {
  try {
    const movies = [
      {
        id: 1,
        title: "Dune: Part Two",
        poster: "/dune-part-two-poster.png",
        rating: 8.8,
        year: 2024,
        genre: "Sci-Fi",
        duration: "166 min",
        description:
          "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      },
      {
        id: 2,
        title: "Spider-Man: Across the Spider-Verse",
        poster: "/spider-man-across-spider-verse-inspired-poster.png",
        rating: 8.7,
        year: 2023,
        genre: "Animation",
        duration: "140 min",
        description:
          "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
      },
      {
        id: 3,
        title: "Guardians of the Galaxy Vol. 3",
        poster: "/guardians-galaxy-vol-3-poster.png",
        rating: 8.0,
        year: 2023,
        genre: "Action",
        duration: "150 min",
        description:
          "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and protect one of their own.",
      },
      {
        id: 4,
        title: "John Wick: Chapter 4",
        poster: "/john-wick-chapter-4-inspired-poster.png",
        rating: 7.8,
        year: 2023,
        genre: "Action",
        duration: "169 min",
        description:
          "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.",
      },
      {
        id: 5,
        title: "The Super Mario Bros. Movie",
        poster: "/super-mario-movie-poster.png",
        rating: 7.0,
        year: 2023,
        genre: "Animation",
        duration: "92 min",
        description:
          "A plumber named Mario travels through an underground labyrinth with his brother Luigi, trying to save a captured princess.",
      },
      {
        id: 6,
        title: "Fast X",
        poster: "/fast-x-action-racing-poster.png",
        rating: 5.8,
        year: 2023,
        genre: "Action",
        duration: "141 min",
        description: "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.",
      },
    ]

    return NextResponse.json({
      success: true,
      data: movies,
      total: movies.length,
    })
  } catch (error) {
    console.error("Error in trending movies API:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch trending movies" }, { status: 500 })
  }
}
