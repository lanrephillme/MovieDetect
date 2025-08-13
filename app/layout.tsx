import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "react-hot-toast"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "MovieDetect - AI-Powered Movie Discovery",
    template: "%s | MovieDetect",
  },
  description:
    "Find any movie using AI. Describe scenes, upload images, hum soundtracks, or record video clips. Our advanced AI delivers precise results instantly.",
  keywords: ["movie search", "AI movie finder", "movie discovery", "film search", "movie identification"],
  authors: [{ name: "MovieDetect Team" }],
  creator: "MovieDetect",
  publisher: "MovieDetect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MovieDetect - AI-Powered Movie Discovery",
    description: "Find any movie using AI. Describe scenes, upload images, hum soundtracks, or record video clips.",
    siteName: "MovieDetect",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MovieDetect - AI-Powered Movie Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieDetect - AI-Powered Movie Discovery",
    description: "Find any movie using AI. Describe scenes, upload images, hum soundtracks, or record video clips.",
    images: ["/og-image.jpg"],
    creator: "@moviedetect",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <div id="root">{children}</div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              border: "1px solid #374151",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#f9fafb",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#f9fafb",
              },
            },
          }}
        />
      </body>
    </html>
  )
}
