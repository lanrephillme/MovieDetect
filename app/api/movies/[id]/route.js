import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const { id } = params

    // TODO: Replace with actual TMDb API call
    // const tmdbResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits,videos,similar`)
    // const tmdbData = await tmdbResponse.json()

    // Mock data for demo - replace with actual API integration
    const mockMovie = {
      id: Number.parseInt(id),
      title: "Blade Runner 2049",
      year: 2017,
      duration: 164,
      genre: ["Sci-Fi", "Thriller", "Drama"],
      synopsis:
        "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
      poster: "/blade-runner-2049-poster.png",
      backdrop: "/blade-runner-2049-cityscape.png",
      trailer: "/placeholder-trailer.mp4",
      ratings: {
        tmdb: 8.0,
        imdb: 8.0,
        rottenTomatoes: 88,
        userAverage: 8.2,
      },
      streamingPlatforms: [
        { name: "Netflix", icon: "/netflix-icon.png", link: "https://netflix.com", type: "subscription" },
        { name: "Prime Video", icon: "/prime-icon.png", link: "https://primevideo.com", type: "subscription" },
        { name: "Apple TV", icon: "/appletv-icon.png", link: "https://tv.apple.com", type: "rent", price: "$3.99" },
        {
          name: "Google Play",
          icon: "/googleplay-icon.png",
          link: "https://play.google.com",
          type: "buy",
          price: "$14.99",
        },
      ],
      cast: [
        { name: "Ryan Gosling", character: "K", image: "/cast-1.jpg" },
        { name: "Harrison Ford", character: "Rick Deckard", image: "/cast-2.jpg" },
        { name: "Ana de Armas", character: "Joi", image: "/cast-3.jpg" },
        { name: "Jared Leto", character: "Niander Wallace", image: "/cast-4.jpg" },
      ],
      reviews: [
        {
          source: "IMDb",
          author: "MovieCritic2023",
          content:
            "A visually stunning sequel that honors the original while creating something entirely new. The cinematography is breathtaking.",
          rating: 9,
          date: "2023-10-15",
        },
        {
          source: "Rotten Tomatoes",
          author: "Critics Consensus",
          content:
            "Blade Runner 2049 is a rare sequel that enhances its predecessor while standing as a remarkable achievement in its own right.",
          rating: 8.8,
          date: "2023-10-10",
        },
        {
          source: "User Review",
          author: "SciFiFan",
          content:
            "Denis Villeneuve has crafted a masterpiece. Every frame is a work of art, and the story respects the legacy while pushing boundaries.",
          rating: 10,
          date: "2023-10-12",
        },
      ],
      similarMovies: [
        { id: 2, title: "The Matrix", poster: "/matrix-movie-poster.png", rating: 8.7, year: 1999 },
        { id: 3, title: "Interstellar", poster: "/interstellar-inspired-poster.png", rating: 8.6, year: 2014 },
        { id: 4, title: "Ex Machina", poster: "/ex-machina-poster.png", rating: 7.7, year: 2014 },
        { id: 5, title: "Her", poster: "/her-ai-romance-movie-poster.png", rating: 8.0, year: 2013 },
        { id: 6, title: "Arrival", poster: "/placeholder.svg", rating: 7.9, year: 2016 },
        { id: 7, title: "Ghost in the Shell", poster: "/placeholder.svg", rating: 7.3, year: 2017 },
      ],
      isInWatchlist: false,
      userRating: 0,
    }

    return NextResponse.json({
      success: true,
      movie: mockMovie,
    })
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch movie details" }, { status: 500 })
  }
}
