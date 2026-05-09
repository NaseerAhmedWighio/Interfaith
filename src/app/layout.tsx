import type { Metadata } from 'next'
import './globals.css'
import { GoogleAnalytics, GoogleTagManager } from '@/components/GoogleAnalytics'

const siteName = 'Interfaith Peace Bridge'
const siteDescription = 'Uniting humanity through divine love, Sufi wisdom, and interfaith understanding'
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://interfaithpeacebridge.org'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'interfaith', 'peace', 'Sufi', 'divine love', 'sacred texts',
    'comparative religion', 'spirituality', 'unity', 'faith dialogue',
    'religious harmony', 'peace bridge', 'interfaith understanding',
  ],
  authors: [{ name: 'Interfaith Peace Bridge' }],
  creator: 'Interfaith Peace Bridge',
  publisher: 'Interfaith Peace Bridge',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <GoogleTagManager />
        {children}
      </body>
    </html>
  )
}
