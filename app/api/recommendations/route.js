import { NextResponse } from "next/server"

export async function GET() {
  try {
    const movies = [
      {
        id: 25,
        title: "Oppenheimer",
        poster: "/images/posters/oppenheimer-poster.png",
        rating: 8.4,
        year: 2023,
        genre: "Biography",
        duration: "180 min",
        description:
          "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        aiConfidence: 95,
        matchReason: "Based on your interest in biographical dramas and Christopher Nolan films",
      },
      {
        id: 26,
        title: "Top Gun: Maverick",
        poster: "/generic-fighter-jet-poster.png",
        rating: 8.3,
        year: 2022,
        genre: "Action",
        duration: "130 min",
        description:
          "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
        aiConfidence: 88,
        matchReason: "Recommended for fans of high-octane action and Tom Cruise films",
      },
      {
        id: 27,
        title: "The Godfather",
        poster: "/generic-gangster-movie-poster.png",
        rating: 9.2,
        year: 1972,
        genre: "Crime",
        duration: "175 min",
        description:
          "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        aiConfidence: 92,
        matchReason: "Perfect match for classic crime drama enthusiasts",
      },
      {
        id: 28,
        title: "Jurassic Park",
        poster: "/dinosaur-sci-fi-poster.png",
        rating: 8.1,
        year: 1993,
        genre: "Adventure",
        duration: "127 min",
        description:
          "A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
        aiConfidence: 85,
        matchReason: "Suggested based on your love for sci-fi adventure classics",
      },
      {
        id: 29,
        title: "Casablanca",
        poster: "/classic-film-poster.png",
        rating: 8.5,
        year: 1942,
        genre: "Romance",
        duration: "102 min",
        description:
          "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.",
        aiConfidence: 78,
        matchReason: "Recommended for classic Hollywood romance lovers",
      },
      {
        id: 30,
        title: "Mad Max: Fury Road",
        poster: "/placeholder.svg?height=400&width=300&text=Mad+Max",
        rating: 8.1,
        year: 2015,
        genre: "Action",
        duration: "120 min",
        description:
          "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
        aiConfidence: 89,
        matchReason: "High-energy action recommendation based on your viewing history",
      },
    ]

    return NextResponse.json({
      success: true,
      data: movies,
      total: movies.length,
    })
  } catch (error) {
    console.error("Error in recommendations API:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch recommendations" }, { status: 500 })
  }
}
