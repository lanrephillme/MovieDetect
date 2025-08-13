import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { query, type } = await request.json()

    if (!query?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query is required",
        },
        { status: 400 },
      )
    }

    let searchResults = []

    if (type === "actor") {
      // TODO: Integrate with TMDb Person Search API
      // const tmdbResponse = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`)
      // const tmdbData = await tmdbResponse.json()
      //
      // if (tmdbData.results?.length > 0) {
      //   const personId = tmdbData.results[0].id
      //   const creditsResponse = await fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?api_key=${process.env.TMDB_API_KEY}`)
      //   const creditsData = await creditsResponse.json()
      //   searchResults = creditsData.cast || []
      // }

      // Mock actor search results
      searchResults = [
        {
          id: 201,
          title: "La La Land",
          poster: "/placeholder.svg",
          rating: 8.0,
          year: 2016,
          genre: ["Romance", "Musical"],
          synopsis: "A jazz musician and an aspiring actress fall in love while pursuing their dreams in Los Angeles.",
          confidence: 95,
          matchReason: `Found movies featuring "${query}" in the cast`,
        },
        {
          id: 202,
          title: "Blade Runner 2049",
          poster: "/blade-runner-2049-poster.png",
          rating: 8.0,
          year: 2017,
          genre: ["Sci-Fi", "Thriller"],
          synopsis: "A young blade runner's discovery leads him to track down former blade runner Rick Deckard.",
          confidence: 92,
          matchReason: `"${query}" plays a leading role in this film`,
        },
      ]
    } else {
      // Scene description search using NLP
      // TODO: Integrate with Custom AI API for scene description matching
      // const aiResponse = await fetch(`${process.env.CUSTOM_AI_API_URL}/scene-search`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.CUSTOM_AI_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     description: query,
      //     limit: 10
      //   })
      // })
      // const aiData = await aiResponse.json()

      // TODO: Cross-reference AI results with TMDb for complete movie data
      // const moviePromises = aiData.matches.map(match =>
      //   fetch(`https://api.themoviedb.org/3/movie/${match.tmdbId}?api_key=${process.env.TMDB_API_KEY}`)
      // )
      // const movieResponses = await Promise.all(moviePromises)

      // Mock scene description search results
      searchResults = [
        {
          id: 301,
          title: "The Dark Knight",
          poster: "/dark-knight-poster.png",
          rating: 9.0,
          year: 2008,
          genre: ["Action", "Crime"],
          synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
          confidence: 88,
          matchReason: "Scene description matches the interrogation room sequence",
        },
        {
          id: 302,
          title: "Inception",
          poster: "/inception-movie-poster.png",
          rating: 8.8,
          year: 2010,
          genre: ["Sci-Fi", "Thriller"],
          synopsis: "A thief who steals corporate secrets through dream-sharing technology.",
          confidence: 82,
          matchReason: "Description matches the spinning top ending scene",
        },
      ]
    }

    // Filter results based on confidence threshold
    const filteredResults = searchResults.filter((result) => result.confidence >= 50)

    return NextResponse.json({
      success: true,
      data: filteredResults,
      query,
      type,
      total: filteredResults.length,
      searchMethod: type === "actor" ? "TMDb Person Search" : "AI Scene Description Matching",
    })
  } catch (error) {
    console.error("Error in text search:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Search failed. Please try again with different terms.",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
