import { NextResponse } from "next/server"

export async function GET() {
  try {
    const movies = [
      {
        id: 31,
        title: "Dune: Part Two",
        poster: "/dune-part-two-poster.png",
        rating: 8.8,
        year: 2024,
        genre: "Sci-Fi",
        duration: "166 min",
        description:
          "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
        watchStatus: "not_started",
        addedDate: "2024-01-15",
      },
      {
        id: 32,
        title: "The Batman",
        poster: "/batman-2022-poster.png",
        rating: 7.8,
        year: 2022,
        genre: "Action",
        duration: "176 min",
        description:
          "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
        watchStatus: "watching",
        addedDate: "2024-01-10",
        progress: 45,
      },
      {
        id: 33,
        title: "Everything Everywhere All at Once",
        poster: "/eeaao-poster.png",
        rating: 7.8,
        year: 2022,
        genre: "Sci-Fi",
        duration: "139 min",
        description:
          "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence.",
        watchStatus: "completed",
        addedDate: "2024-01-05",
        completedDate: "2024-01-08",
      },
      {
        id: 34,
        title: "Inception",
        poster: "/inception-movie-poster.png",
        rating: 8.8,
        year: 2010,
        genre: "Sci-Fi",
        duration: "148 min",
        description:
          "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        watchStatus: "not_started",
        addedDate: "2024-01-12",
      },
      {
        id: 35,
        title: "Spider-Man: Across the Spider-Verse",
        poster: "/spider-man-across-spider-verse-inspired-poster.png",
        rating: 8.7,
        year: 2023,
        genre: "Animation",
        duration: "140 min",
        description:
          "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        watchStatus: "watching",
        addedDate: "2024-01-08",
        progress: 78,
      },
    ]

    return NextResponse.json({
      success: true,
      data: movies,
      total: movies.length,
    })
  } catch (error) {
    console.error("Error in watchlist API:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch watchlist" }, { status: 500 })
  }
}
