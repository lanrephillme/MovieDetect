import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MovieDetect - AI-Powered Movie Discovery",
  description:
    "Discover movies and TV shows using AI-powered search with text, voice, image, video, audio, and face recognition.",
  keywords: "movies, TV shows, AI search, movie discovery, streaming, entertainment",
  authors: [{ name: "MovieDetect Team" }],
  openGraph: {
    title: "MovieDetect - AI-Powered Movie Discovery",
    description: "Discover movies and TV shows using AI-powered search",
    type: "website",
    url: "https://moviedetect.com",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
