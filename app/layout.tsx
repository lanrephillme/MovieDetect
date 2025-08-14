import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MovieDetect - AI-Powered Movie Discovery",
  description:
    "Discover movies and TV shows using advanced AI search with text, voice, images, videos, audio, and face recognition.",
  keywords: "movies, TV shows, AI search, movie discovery, entertainment, streaming",
  authors: [{ name: "MovieDetect Team" }],
  openGraph: {
    title: "MovieDetect - AI-Powered Movie Discovery",
    description: "Discover movies and TV shows using advanced AI search",
    type: "website",
    url: "https://moviedetect.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieDetect - AI-Powered Movie Discovery",
    description: "Discover movies and TV shows using advanced AI search",
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
