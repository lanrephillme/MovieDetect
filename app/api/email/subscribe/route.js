import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 },
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // In a real app, you would:
    // 1. Save to database
    // 2. Send welcome email via SendGrid
    // 3. Add to mailing list

    console.log(`New subscription: ${email}${name ? ` (${name})` : ""}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: {
        email,
        name: name || null,
        subscribedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to subscribe to newsletter",
      },
      { status: 500 },
    )
  }
}
