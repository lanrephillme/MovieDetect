import { NextResponse } from "next/server"

export async function GET() {
  try {
    const movies = [
      {
        id: 13,
        title: "Cocaine Bear",
        poster: "/cocaine-bear-comedy-poster.png",
        rating: 5.9,
        year: 2023,
        genre: "Comedy",
        duration: "95 min",
        description:
          "An oddball group of cops, criminals, tourists and teens converge on a Georgia forest where a huge black bear goes on a murderous rampage after unintentionally ingesting cocaine.",
      },
      {
        id: 14,
        title: "Shazam! Fury of the Gods",
        poster: "/shazam-fury-gods-poster.png",
        rating: 5.9,
        year: 2023,
        genre: "Action",
        duration: "130 min",
        description:
          "The film continues the story of teenage Billy Batson who, upon reciting the magic word 'SHAZAM!' is transformed into his adult Super Hero alter ego, Shazam.",
      },
      {
        id: 15,
        title: "The Menu",
        poster: "/the-menu-2022-poster.png",
        rating: 7.2,
        year: 2022,
        genre: "Thriller",
        duration: "107 min",
        description:
          "A young couple travels to a remote island to eat at an exclusive restaurant where the chef has prepared a lavish menu, with some shocking surprises.",
      },
      {
        id: 16,
        title: "Her",
        poster: "/her-ai-romance-movie-poster.png",
        rating: 8.0,
        year: 2013,
        genre: "Romance",
        duration: "126 min",
        description:
          "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
      },
      {
        id: 17,
        title: "Ex Machina",
        poster: "/ex-machina-poster.png",
        rating: 7.7,
        year: 2014,
        genre: "Sci-Fi",
        duration: "108 min",
        description:
          "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.",
      },
      {
        id: 18,
        title: "Blade Runner 2049",
        poster: "/blade-runner-2049-poster.png",
        rating: 8.0,
        year: 2017,
        genre: "Sci-Fi",
        duration: "164 min",
        description:
          "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
      },
    ]

    return NextResponse.json({
      success: true,
      data: movies,
      total: movies.length,
    })
  } catch (error) {
    console.error("Error in new releases API:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch new releases" }, { status: 500 })
  }
}
