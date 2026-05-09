import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://interfaithpeacebridge.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/mission', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/approach', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/traditions', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/teachings', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/sacred-texts', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/truth', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/peace', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/peace-initiatives', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/sufi-teachings', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/sacred-texts-explorer', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/share-quotes', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/assessment', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/join', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/login', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/register', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  const entries = staticPages.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))

  return entries
}
