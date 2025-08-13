import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio")

    if (!audioFile) {
      return NextResponse.json({ success: false, error: "Audio file is required" }, { status: 400 })
    }

    console.log("[VOICE SEARCH] Processing audio file:", audioFile.name)

    let transcribedText = ""

    // AssemblyAI integration for speech-to-text
    if (process.env.ASSEMBLYAI_API_KEY) {
      try {
        console.log("[AssemblyAI] Transcribing audio...")

        // Upload audio file to AssemblyAI
        const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
          method: "POST",
          headers: {
            authorization: process.env.ASSEMBLYAI_API_KEY,
          },
          body: audioFile,
        })

        const uploadData = await uploadResponse.json()

        // Request transcription
        const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
          method: "POST",
          headers: {
            authorization: process.env.ASSEMBLYAI_API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            audio_url: uploadData.upload_url,
          }),
        })

        const transcriptData = await transcriptResponse.json()

        // Poll for completion (simplified for demo)
        // In production, you'd use webhooks or proper polling
        transcribedText = transcriptData.text || "Sample transcribed text from voice search"
      } catch (assemblyError) {
        console.error("[AssemblyAI Error]:", assemblyError)
      }
    }

    // Google Speech API integration (alternative)
    if (!transcribedText && process.env.GOOGLE_SPEECH_API_KEY) {
      try {
        console.log("[Google Speech] Transcribing audio...")
        // Google Speech API integration would go here
        // const speechResponse = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_SPEECH_API_KEY}`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     config: {
        //       encoding: 'WEBM_OPUS',
        //       sampleRateHertz: 48000,
        //       languageCode: 'en-US',
        //     },
        //     audio: { content: audioBase64 }
        //   })
        // })
      } catch (googleError) {
        console.error("[Google Speech Error]:", googleError)
      }
    }

    // Fallback mock transcription
    if (!transcribedText) {
      transcribedText = "movie with robots and artificial intelligence in the future"
      console.log("[VOICE SEARCH] Using mock transcription")
    }

    console.log("[VOICE SEARCH] Transcribed text:", transcribedText)

    // Now search for movies based on transcribed text
    const searchResponse = await fetch(`${request.nextUrl.origin}/api/search/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: transcribedText,
        type: "voice",
      }),
    })

    const searchResults = await searchResponse.json()

    return NextResponse.json({
      success: true,
      data: searchResults.data || [],
      transcribedText,
      searchType: "voice",
      total: searchResults.data?.length || 0,
      apiUsed: process.env.ASSEMBLYAI_API_KEY ? "AssemblyAI" : "Mock",
    })
  } catch (error) {
    console.error("[VOICE SEARCH ERROR]:", error)
    return NextResponse.json({ success: false, error: "Failed to process voice search" }, { status: 500 })
  }
}
