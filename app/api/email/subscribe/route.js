import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Please enter a valid email address" }, { status: 400 })
    }

    // In a real app, you would save to database and send welcome email
    // For now, we'll simulate a successful subscription
    const subscriber = {
      id: Date.now(),
      email,
      name: name || "",
      subscribedDate: new Date().toISOString(),
      status: "active",
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: subscriber,
    })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ success: false, error: "Failed to subscribe to newsletter" }, { status: 500 })
  }
}
