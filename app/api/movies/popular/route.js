import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock popular movies data
    const popularMovies = [
      {
        id: 7,
        title: "Avatar: The Way of Water",
        poster: "/way-of-water-inspired-poster.png",
        rating: 7.8,
        year: 2022,
        genre: ["Sci-Fi", "Adventure"],
        trailer: "https://example.com/avatar2-trailer.mp4",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
      },
      {
        id: 8,
        title: "Black Panther: Wakanda Forever",
        poster: "/wakanda-forever-poster.png",
        rating: 7.3,
        year: 2022,
        genre: ["Action", "Drama"],
        trailer: "https://example.com/wakanda-trailer.mp4",
        description: "The people of Wakanda fight to protect their home from intervening world powers.",
      },
      {
        id: 9,
        title: "The Super Mario Bros. Movie",
        poster: "/super-mario-movie-poster.png",
        rating: 7.1,
        year: 2023,
        genre: ["Animation", "Family"],
        trailer: "https://example.com/mario-trailer.mp4",
        description: "A plumber named Mario travels through an underground labyrinth with his brother Luigi.",
      },
      {
        id: 10,
        title: "Cocaine Bear",
        poster: "/cocaine-bear-comedy-poster.png",
        rating: 6.0,
        year: 2023,
        genre: ["Comedy", "Thriller"],
        trailer: "https://example.com/cocainebear-trailer.mp4",
        description: "An oddball group of cops, criminals, tourists and teens converge on a Georgia forest.",
      },
      {
        id: 11,
        title: "Everything Everywhere All at Once",
        poster: "/eeaao-poster.png",
        rating: 8.1,
        year: 2022,
        genre: ["Sci-Fi", "Comedy"],
        trailer: "https://example.com/eeaao-trailer.mp4",
        description: "A middle-aged Chinese immigrant is swept up into an insane adventure.",
      },
      {
        id: 12,
        title: "Glass Onion: A Knives Out Mystery",
        poster: "/glass-onion-poster.png",
        rating: 7.2,
        year: 2022,
        genre: ["Mystery", "Comedy"],
        trailer: "https://example.com/glassonion-trailer.mp4",
        description: "Detective Benoit Blanc travels to Greece to peel back the layers of a mystery.",
      },
    ]

    return NextResponse.json({
      success: true,
      data: popularMovies,
      total: popularMovies.length,
    })
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch popular movies",
      },
      { status: 500 },
    )
  }
}
