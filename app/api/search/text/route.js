import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { query, type } = await request.json()

    if (!query) {
      return NextResponse.json({ success: false, error: "Search query is required" }, { status: 400 })
    }

    console.log(`[TEXT SEARCH] Processing query: "${query}" of type: ${type}`)

    // TMDb API integration for text search
    const tmdbApiKey = process.env.TMDB_API_KEY
    let tmdbResults = []

    if (tmdbApiKey) {
      try {
        // Search TMDb for movies
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`,
        )
        const tmdbData = await tmdbResponse.json()

        if (tmdbData.results) {
          tmdbResults = tmdbData.results.slice(0, 10).map((movie) => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            rating: movie.vote_average,
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
            backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
            genre: [], // Would need additional API call to get genres
            synopsis: movie.overview,
            confidence: Math.floor(Math.random() * 20) + 80, // Mock confidence score
            matchReason: type === "actor" ? "Actor name match" : "Title and description match",
          }))
        }
      } catch (tmdbError) {
        console.error("[TMDb API Error]:", tmdbError)
      }
    }

    // If no TMDb results or no API key, use fallback data
    if (tmdbResults.length === 0) {
      console.log("[TEXT SEARCH] Using fallback mock data")

      const mockResults = [
        {
          id: 1,
          title: "The Dark Knight",
          year: 2008,
          rating: 9.0,
          poster: "/dark-knight-poster.png",
          backdrop: "/dark-knight-backdrop.jpg",
          genre: ["Action", "Crime", "Drama"],
          synopsis:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
          confidence: 95,
          matchReason: "Title and character description match",
        },
        {
          id: 2,
          title: "Inception",
          year: 2010,
          rating: 8.8,
          poster: "/inception-movie-poster.png",
          backdrop: "/inception-backdrop.jpg",
          genre: ["Action", "Sci-Fi", "Thriller"],
          synopsis:
            "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          confidence: 87,
          matchReason: "Plot and theme similarity",
        },
        {
          id: 3,
          title: "Interstellar",
          year: 2014,
          rating: 8.6,
          poster: "/interstellar-inspired-poster.png",
          backdrop: "/interstellar-space.png",
          genre: ["Adventure", "Drama", "Sci-Fi"],
          synopsis:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          confidence: 82,
          matchReason: "Genre and thematic elements match",
        },
      ]

      // Filter based on query
      tmdbResults = mockResults.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.synopsis.toLowerCase().includes(query.toLowerCase()) ||
          movie.genre.some((g) => g.toLowerCase().includes(query.toLowerCase())),
      )
    }

    // Custom AI API integration for scene description matching
    if (type === "scene" && process.env.CUSTOM_AI_API_KEY) {
      try {
        console.log("[CUSTOM AI] Processing scene description")
        // Custom AI API call would go here
        // const aiResponse = await fetch('your-custom-ai-endpoint', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${process.env.CUSTOM_AI_API_KEY}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ description: query })
        // })
      } catch (aiError) {
        console.error("[Custom AI API Error]:", aiError)
      }
    }

    return NextResponse.json({
      success: true,
      data: tmdbResults,
      query,
      searchType: "text",
      total: tmdbResults.length,
      apiUsed: tmdbApiKey ? "TMDb" : "Mock Data",
    })
  } catch (error) {
    console.error("[TEXT SEARCH ERROR]:", error)
    return NextResponse.json({ success: false, error: "Failed to perform text search" }, { status: 500 })
  }
}
