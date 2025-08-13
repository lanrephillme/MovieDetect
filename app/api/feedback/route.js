import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { movieId, searchType, confidenceScore, feedback, email } = await request.json()

    if (!movieId || !feedback?.trim()) {
      return NextResponse.json({ success: false, error: "Movie ID and feedback are required" }, { status: 400 })
    }

    console.log(`[FEEDBACK] Received feedback for movie ${movieId}:`, {
      searchType,
      confidenceScore,
      feedback: feedback.substring(0, 100) + "...",
      email: email ? "provided" : "not provided",
    })

    // In a real app, you would:
    // 1. Store feedback in database
    // 2. Send notification to admin/ML team
    // 3. Use feedback to improve search algorithms
    // 4. Send confirmation email if email provided

    const feedbackRecord = {
      id: Date.now(),
      movieId,
      searchType,
      confidenceScore,
      feedback,
      email,
      timestamp: new Date().toISOString(),
      status: "received",
    }

    // Mock email sending if email provided
    if (email && process.env.SENDGRID_API_KEY) {
      console.log(`[FEEDBACK] Would send confirmation email to ${email}`)
      // SendGrid integration would go here
    }

    return NextResponse.json({
      success: true,
      data: feedbackRecord,
      message: "Thank you for your feedback! We'll use it to improve our search results.",
    })
  } catch (error) {
    console.error("[FEEDBACK ERROR]:", error)
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 })
  }
}
