import React from "react"
import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GioPrompt - AI Prompt Optimizer',
  description: 'Transform your AI prompts into powerful, optimized instructions for video, text, and image generation',
  generator: 'v0.app',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${vt323.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
