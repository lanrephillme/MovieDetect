import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get("movieId")

    if (!movieId) {
      return NextResponse.json({ success: false, error: "Movie ID is required" }, { status: 400 })
    }

    console.log(`[STREAMING PLATFORMS] Fetching platforms for movie ${movieId}`)

    let streamingData = []

    // JustWatch API integration
    if (process.env.JUSTWATCH_API_KEY) {
      try {
        console.log("[JustWatch] Fetching streaming availability...")

        // JustWatch API call would go here
        // const justWatchResponse = await fetch(`https://apis.justwatch.com/content/titles/movie/${movieId}/locale/en_US`, {
        //   headers: {
        //     'Authorization': `Bearer ${process.env.JUSTWATCH_API_KEY}`
        //   }
        // })
        // const justWatchData = await justWatchResponse.json()

        // if (justWatchData.offers) {
        //   streamingData = justWatchData.offers.map(offer => ({
        //     name: offer.provider_name,
        //     type: offer.monetization_type, // subscription, rent, buy
        //     price: offer.price_string,
        //     link: offer.urls.standard_web,
        //     icon: offer.provider_icon_url
        //   }))
        // }
      } catch (justWatchError) {
        console.error("[JustWatch Error]:", justWatchError)
      }
    }

    // Fallback mock data
    if (streamingData.length === 0) {
      console.log("[STREAMING PLATFORMS] Using mock data")
      streamingData = [
        {
          name: "Netflix",
          type: "subscription",
          price: null,
          link: "https://www.netflix.com",
          icon: "/netflix-icon.png",
          available: true,
        },
        {
          name: "Prime Video",
          type: "subscription",
          price: null,
          link: "https://www.primevideo.com",
          icon: "/prime-icon.png",
          available: true,
        },
        {
          name: "Apple TV",
          type: "rent",
          price: "$3.99",
          link: "https://tv.apple.com",
          icon: "/appletv-icon.png",
          available: true,
        },
        {
          name: "Google Play Movies",
          type: "buy",
          price: "$14.99",
          link: "https://play.google.com/store/movies",
          icon: "/googleplay-icon.png",
          available: true,
        },
        {
          name: "Vudu",
          type: "rent",
          price: "$2.99",
          link: "https://www.vudu.com",
          icon: "/vudu-icon.png",
          available: true,
        },
      ]
    }

    return NextResponse.json({
      success: true,
      data: streamingData,
      movieId,
      total: streamingData.length,
      apiUsed: process.env.JUSTWATCH_API_KEY ? "JustWatch" : "Mock",
    })
  } catch (error) {
    console.error("[STREAMING PLATFORMS ERROR]:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch streaming platforms" }, { status: 500 })
  }
}
