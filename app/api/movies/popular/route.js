import { NextResponse } from "next/server"

export async function GET() {
  try {
    const movies = [
      {
        id: 7,
        title: "Avatar: The Way of Water",
        poster: "/way-of-water-inspired-poster.png",
        rating: 7.6,
        year: 2022,
        genre: "Sci-Fi",
        duration: "192 min",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
      },
      {
        id: 8,
        title: "Black Panther: Wakanda Forever",
        poster: "/wakanda-forever-poster.png",
        rating: 6.7,
        year: 2022,
        genre: "Action",
        duration: "161 min",
        description:
          "The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T'Challa.",
      },
      {
        id: 9,
        title: "Everything Everywhere All at Once",
        poster: "/eeaao-poster.png",
        rating: 7.8,
        year: 2022,
        genre: "Sci-Fi",
        duration: "139 min",
        description:
          "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence.",
      },
      {
        id: 10,
        title: "The Batman",
        poster: "/batman-2022-poster.png",
        rating: 7.8,
        year: 2022,
        genre: "Action",
        duration: "176 min",
        description:
          "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
      },
      {
        id: 11,
        title: "Glass Onion: A Knives Out Mystery",
        poster: "/glass-onion-poster.png",
        rating: 7.2,
        year: 2022,
        genre: "Mystery",
        duration: "139 min",
        description:
          "Detective Benoit Blanc travels to Greece to peel back the layers of a mystery involving a new cast of colorful suspects.",
      },
      {
        id: 12,
        title: "Ant-Man and the Wasp: Quantumania",
        poster: "/ant-man-quantumania-inspired-poster.png",
        rating: 6.1,
        year: 2023,
        genre: "Action",
        duration: "124 min",
        description:
          "Scott Lang and Hope Van Dyne are dragged into the Quantum Realm, along with Hope's parents and Scott's daughter Cassie.",
      },
    ]

    return NextResponse.json({
      success: true,
      data: movies,
      total: movies.length,
    })
  } catch (error) {
    console.error("Error in popular movies API:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch popular movies" }, { status: 500 })
  }
}
