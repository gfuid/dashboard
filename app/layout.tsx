import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DataViz Pro - CSV to Visual Dashboard",
  description: "Transform your CSV data into beautiful, interactive visualizations with 4K export capability",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0891b2",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
