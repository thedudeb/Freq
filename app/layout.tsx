import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Freq - Voice Chat on Farcaster',
  description: 'Send and receive voice messages on Farcaster. Your walkie-talkie for the decentralized web.',
  keywords: 'farcaster, voice, chat, walkie-talkie, decentralized, mini-app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Freq'
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    title: 'Freq - Voice Chat on Farcaster',
    description: 'Send and receive voice messages on Farcaster. Your walkie-talkie for the decentralized web.',
    url: 'https://freq-bcxg8x5e2-thedude-da236722.vercel.app',
    siteName: 'Freq',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Freq App Icon'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freq - Voice Chat on Farcaster',
    description: 'Send and receive voice messages on Farcaster. Your walkie-talkie for the decentralized web.',
    images: ['/icon-512.png']
  },
  other: {
    'farcaster:mini-app': 'true',
    'farcaster:domain': 'freq.voice',
    'farcaster:version': '1.0.0'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#8b5cf6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen`}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
} 