import { NextResponse } from "next/server"

export async function GET() {
  try {
    const movies = [
      {
        id: 19,
        title: "The Dark Knight",
        poster: "/dark-knight-poster.png",
        rating: 9.0,
        year: 2008,
        genre: "Action",
        duration: "152 min",
        description:
          "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      },
      {
        id: 20,
        title: "Pulp Fiction",
        poster: "/pulp-fiction-poster.png",
        rating: 8.9,
        year: 1994,
        genre: "Crime",
        duration: "154 min",
        description:
          "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      },
      {
        id: 21,
        title: "Inception",
        poster: "/inception-movie-poster.png",
        rating: 8.8,
        year: 2010,
        genre: "Sci-Fi",
        duration: "148 min",
        description:
          "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      },
      {
        id: 22,
        title: "The Matrix",
        poster: "/matrix-movie-poster.png",
        rating: 8.7,
        year: 1999,
        genre: "Sci-Fi",
        duration: "136 min",
        description:
          "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
      },
      {
        id: 23,
        title: "Goodfellas",
        poster: "/goodfellas-poster.png",
        rating: 8.7,
        year: 1990,
        genre: "Crime",
        duration: "146 min",
        description:
          "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
      },
      {
        id: 24,
        title: "Interstellar",
        poster: "/interstellar-inspired-poster.png",
        rating: 8.6,
        year: 2014,
        genre: "Sci-Fi",
        duration: "169 min",
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      },
    ]

    return NextResponse.json({
      success: true,
      data: movies,
      total: movies.length,
    })
  } catch (error) {
    console.error("Error in top rated movies API:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch top rated movies" }, { status: 500 })
  }
}
