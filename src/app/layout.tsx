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
    google: 'google16ee278a46bf3b9b',
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
  const siteLogo = `${siteUrl}/logo.png`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
        logo: siteLogo,
        description: siteDescription,
        sameAs: [
          `${siteUrl}/about`,
          `${siteUrl}/mission`,
        ],
      },
    ],
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <GoogleTagManager />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
