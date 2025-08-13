import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock AI recommendations with confidence scores
    const recommendations = [
      {
        id: 25,
        title: "Blade Runner 2049",
        poster: "/blade-runner-2049-poster.png",
        rating: 8.0,
        year: 2017,
        genre: ["Sci-Fi", "Thriller"],
        trailer: "https://example.com/bladerunner2049-trailer.mp4",
        description:
          "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
        aiConfidence: 95,
        matchReason: "Based on your love for sci-fi thrillers",
      },
      {
        id: 26,
        title: "Her",
        poster: "/her-ai-romance-movie-poster.png",
        rating: 8.0,
        year: 2013,
        genre: ["Romance", "Sci-Fi"],
        trailer: "https://example.com/her-trailer.mp4",
        description: "A sensitive writer develops an unlikely relationship with an operating system.",
        aiConfidence: 88,
        matchReason: "Perfect match for AI and emotional storytelling",
      },
      {
        id: 27,
        title: "Ex Machina",
        poster: "/ex-machina-poster.png",
        rating: 7.7,
        year: 2014,
        genre: ["Sci-Fi", "Thriller"],
        trailer: "https://example.com/exmachina-trailer.mp4",
        description:
          "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence.",
        aiConfidence: 92,
        matchReason: "AI themes similar to your recent searches",
      },
      {
        id: 28,
        title: "Arrival",
        poster: "/classic-film-poster.png",
        rating: 7.9,
        year: 2016,
        genre: ["Sci-Fi", "Drama"],
        trailer: "https://example.com/arrival-trailer.mp4",
        description:
          "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
        aiConfidence: 85,
        matchReason: "Intelligent sci-fi matching your preferences",
      },
      {
        id: 29,
        title: "The Prestige",
        poster: "/generic-gangster-movie-poster.png",
        rating: 8.5,
        year: 2006,
        genre: ["Mystery", "Thriller"],
        trailer: "https://example.com/prestige-trailer.mp4",
        description:
          "Two stage magicians engage in competitive one-upmanship in an attempt to create the ultimate stage illusion.",
        aiConfidence: 78,
        matchReason: "Complex narratives you typically enjoy",
      },
      {
        id: 30,
        title: "Minority Report",
        poster: "/generic-fighter-jet-poster.png",
        rating: 7.6,
        year: 2002,
        genre: ["Sci-Fi", "Action"],
        trailer: "https://example.com/minorityreport-trailer.mp4",
        description:
          "In a future where a special police unit is able to arrest murderers before they commit their crimes.",
        aiConfidence: 82,
        matchReason: "Futuristic themes align with your interests",
      },
    ]

    return NextResponse.json({
      success: true,
      data: recommendations,
      total: recommendations.length,
    })
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch recommendations",
      },
      { status: 500 },
    )
  }
}
