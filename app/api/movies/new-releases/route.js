import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock new releases data
    const newReleases = [
      {
        id: 13,
        title: "Ant-Man and the Wasp: Quantumania",
        poster: "/ant-man-quantumania-inspired-poster.png",
        rating: 6.8,
        year: 2023,
        genre: ["Action", "Comedy"],
        trailer: "https://example.com/antman3-trailer.mp4",
        description: "Scott Lang and Hope Van Dyne are dragged into the Quantum Realm.",
      },
      {
        id: 14,
        title: "Shazam! Fury of the Gods",
        poster: "/shazam-fury-gods-poster.png",
        rating: 6.5,
        year: 2023,
        genre: ["Action", "Comedy"],
        trailer: "https://example.com/shazam2-trailer.mp4",
        description: "Billy Batson and his foster siblings face the Daughters of Atlas.",
      },
      {
        id: 15,
        title: "The Menu",
        poster: "/the-menu-2022-poster.png",
        rating: 7.6,
        year: 2022,
        genre: ["Horror", "Thriller"],
        trailer: "https://example.com/menu-trailer.mp4",
        description: "A young couple travels to a remote island to eat at an exclusive restaurant.",
      },
      {
        id: 16,
        title: "The Batman",
        poster: "/batman-2022-poster.png",
        rating: 8.2,
        year: 2022,
        genre: ["Action", "Crime"],
        trailer: "https://example.com/batman-trailer.mp4",
        description:
          "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
      },
      {
        id: 17,
        title: "Her",
        poster: "/her-ai-romance-movie-poster.png",
        rating: 8.0,
        year: 2013,
        genre: ["Romance", "Sci-Fi"],
        trailer: "https://example.com/her-trailer.mp4",
        description: "A sensitive writer develops an unlikely relationship with an operating system.",
      },
      {
        id: 18,
        title: "Ex Machina",
        poster: "/ex-machina-poster.png",
        rating: 7.7,
        year: 2014,
        genre: ["Sci-Fi", "Thriller"],
        trailer: "https://example.com/exmachina-trailer.mp4",
        description:
          "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence.",
      },
    ]

    return NextResponse.json({
      success: true,
      data: newReleases,
      total: newReleases.length,
    })
  } catch (error) {
    console.error("Error fetching new releases:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch new releases",
      },
      { status: 500 },
    )
  }
}
