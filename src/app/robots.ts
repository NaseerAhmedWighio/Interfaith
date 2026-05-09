import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://interfaithpeacebridge.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
