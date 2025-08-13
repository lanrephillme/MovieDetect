import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email } = await request.json()

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

    // In a real app, you would save to database and send welcome email
    console.log(`New email subscription: ${email}`)

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: {
        email,
        subscribedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error subscribing email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to subscribe to newsletter",
      },
      { status: 500 },
    )
  }
}
