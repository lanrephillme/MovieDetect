import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { movieId, searchType, confidenceScore, feedback, email } = await request.json()

    if (!movieId || !feedback?.trim()) {
      return NextResponse.json({ success: false, error: "Movie ID and feedback are required" }, { status: 400 })
    }

    console.log("Feedback received:", {
      movieId,
      searchType,
      confidenceScore,
      feedback,
      email,
    })

    // TODO: Save feedback to database
    // Example: await db.feedback.create({ movieId, searchType, confidenceScore, feedback, email, timestamp: new Date() })

    // Mock email sending if email provided
    if (email && process.env.SENDGRID_API_KEY) {
      console.log(`[FEEDBACK] Would send confirmation email to ${email}`)
      // SendGrid integration would go here
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 })
  }
}
