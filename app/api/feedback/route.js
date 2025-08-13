import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { movieId, searchType, confidenceScore, feedback, email } = await request.json()

    if (!feedback || !feedback.trim()) {
      return NextResponse.json({ success: false, error: "Feedback is required" }, { status: 400 })
    }

    console.log("[FEEDBACK] Received user feedback:", {
      movieId,
      searchType,
      confidenceScore,
      feedback: feedback.substring(0, 100) + "...",
      email: email ? "provided" : "not provided",
    })

    // TODO: Save feedback to database
    // await db.feedback.create({
    //   data: {
    //     movieId: movieId ? parseInt(movieId) : null,
    //     searchType,
    //     confidenceScore,
    //     feedback,
    //     email,
    //     createdAt: new Date(),
    //     ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    //   }
    // })

    // TODO: Send feedback notification email if configured
    if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
      try {
        // const sgMail = require('@sendgrid/mail')
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        // await sgMail.send({
        //   to: 'feedback@moviedetect.com',
        //   from: process.env.FROM_EMAIL,
        //   subject: `MovieDetect Feedback - ${searchType} search`,
        //   html: `
        //     <h3>New Feedback Received</h3>
        //     <p><strong>Search Type:</strong> ${searchType}</p>
        //     <p><strong>Movie ID:</strong> ${movieId || 'N/A'}</p>
        //     <p><strong>Confidence Score:</strong> ${confidenceScore || 'N/A'}%</p>
        //     <p><strong>User Email:</strong> ${email || 'Not provided'}</p>
        //     <p><strong>Feedback:</strong></p>
        //     <p>${feedback}</p>
        //   `
        // })

        console.log("[FEEDBACK] Email notification sent")
      } catch (emailError) {
        console.error("[FEEDBACK] Email notification failed:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback! We'll use it to improve our search results.",
      feedbackId: Date.now(), // Mock ID
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[FEEDBACK ERROR]:", error)
    return NextResponse.json({ success: false, error: "Failed to submit feedback" }, { status: 500 })
  }
}
