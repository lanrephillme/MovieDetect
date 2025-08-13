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

        // TODO: Replace with actual JustWatch API call
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

    // Mock streaming platforms data
    if (streamingData.length === 0) {
      console.log("[STREAMING PLATFORMS] Using mock data")
      streamingData = [
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
        { name: "Hulu", icon: "/hulu-icon.png", link: "https://hulu.com", type: "subscription" },
      ]
    }

    return NextResponse.json({
      success: true,
      platforms: streamingData,
    })
  } catch (error) {
    console.error("Error fetching streaming platforms:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch streaming platforms" }, { status: 500 })
  }
}
