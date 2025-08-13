import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { movieId, searchType, confidenceScore, feedback, email } = await request.json()

    if (!movieId || !feedback?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Movie ID and feedback are required",
        },
        { status: 400 },
      )
    }

    console.log(`[FEEDBACK] Movie ${movieId} - Search: ${searchType} - Confidence: ${confidenceScore}%`)
    console.log(`[FEEDBACK] User feedback: ${feedback}`)
    if (email) console.log(`[FEEDBACK] Contact email: ${email}`)

    // TODO: Save feedback to database
    // await db.feedback.create({
    //   data: {
    //     movieId: parseInt(movieId),
    //     searchType,
    //     confidenceScore,
    //     feedback: feedback.trim(),
    //     email: email?.trim() || null,
    //     createdAt: new Date(),
    //     ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    //   }
    // })

    // TODO: Send notification email if configured
    if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
      try {
        const sgMail = require("@sendgrid/mail")
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
          to: process.env.FROM_EMAIL,
          from: process.env.FROM_EMAIL,
          subject: `MovieDetect Feedback - Movie ID ${movieId}`,
          html: `
            <h2>New User Feedback</h2>
            <p><strong>Movie ID:</strong> ${movieId}</p>
            <p><strong>Search Type:</strong> ${searchType || "Unknown"}</p>
            <p><strong>AI Confidence:</strong> ${confidenceScore || "N/A"}%</p>
            <p><strong>User Email:</strong> ${email || "Not provided"}</p>
            <p><strong>Feedback:</strong></p>
            <blockquote>${feedback}</blockquote>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          `,
        }

        await sgMail.send(msg)
        console.log("[FEEDBACK] Notification email sent")
      } catch (emailError) {
        console.error("[FEEDBACK] Failed to send notification email:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback! We'll use it to improve our search results.",
      data: {
        feedbackId: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save feedback. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get("movieId")
    const limit = Number.parseInt(searchParams.get("limit")) || 10

    // TODO: Get feedback from database
    // const feedback = await db.feedback.findMany({
    //   where: movieId ? { movieId: parseInt(movieId) } : {},
    //   orderBy: { createdAt: 'desc' },
    //   take: limit,
    //   select: {
    //     id: true,
    //     movieId: true,
    //     searchType: true,
    //     confidenceScore: true,
    //     feedback: true,
    //     createdAt: true
    //   }
    // })

    // Mock feedback data
    const mockFeedback = [
      {
        id: 1,
        movieId: movieId ? Number.parseInt(movieId) : 1,
        searchType: "image",
        confidenceScore: 85,
        feedback: "Perfect match! Found exactly what I was looking for.",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        movieId: movieId ? Number.parseInt(movieId) : 2,
        searchType: "voice",
        confidenceScore: 72,
        feedback: "Close but not quite right. The AI understood my description well though.",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockFeedback,
      total: mockFeedback.length,
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch feedback",
      },
      { status: 500 },
    )
  }
}
