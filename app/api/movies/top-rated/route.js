import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock top rated movies data
    const topRatedMovies = [
      {
        id: 19,
        title: "The Dark Knight",
        poster: "/dark-knight-poster.png",
        rating: 9.0,
        year: 2008,
        genre: ["Action", "Crime"],
        trailer: "https://example.com/darkknight-trailer.mp4",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
      },
      {
        id: 20,
        title: "Pulp Fiction",
        poster: "/pulp-fiction-poster.png",
        rating: 8.9,
        year: 1994,
        genre: ["Crime", "Drama"],
        trailer: "https://example.com/pulpfiction-trailer.mp4",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.",
      },
      {
        id: 21,
        title: "Inception",
        poster: "/inception-movie-poster.png",
        rating: 8.8,
        year: 2010,
        genre: ["Sci-Fi", "Thriller"],
        trailer: "https://example.com/inception-trailer.mp4",
        description: "A thief who steals corporate secrets through dream-sharing technology.",
      },
      {
        id: 22,
        title: "The Matrix",
        poster: "/matrix-movie-poster.png",
        rating: 8.7,
        year: 1999,
        genre: ["Sci-Fi", "Action"],
        trailer: "https://example.com/matrix-trailer.mp4",
        description: "A computer programmer is led to fight an underground war against powerful computers.",
      },
      {
        id: 23,
        title: "Goodfellas",
        poster: "/goodfellas-poster.png",
        rating: 8.7,
        year: 1990,
        genre: ["Crime", "Drama"],
        trailer: "https://example.com/goodfellas-trailer.mp4",
        description: "The story of Henry Hill and his life in the mob.",
      },
      {
        id: 24,
        title: "Interstellar",
        poster: "/interstellar-inspired-poster.png",
        rating: 8.6,
        year: 2014,
        genre: ["Sci-Fi", "Drama"],
        trailer: "https://example.com/interstellar-trailer.mp4",
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      },
    ]

    return NextResponse.json({
      success: true,
      data: topRatedMovies,
      total: topRatedMovies.length,
    })
  } catch (error) {
    console.error("Error fetching top rated movies:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch top rated movies",
      },
      { status: 500 },
    )
  }
}
