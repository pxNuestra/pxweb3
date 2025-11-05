import { MetadataRoute } from 'next'
import config from '@/data/config'

// sementara kosong biar nggak error build
// nanti bisa diganti dengan data asli blog kamu
const allBlogs: {
  path: string
  draft?: boolean
  lastmod?: string
  date?: string
}[] = []

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = config.siteURL

  const blogRoutes: MetadataRoute.Sitemap = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}${post.path}`,
      lastModified: post.lastmod || post.date || new Date().toISOString(),
      priority: 0.7,
    }))

  const routes: MetadataRoute.Sitemap = ['blog', 'projects', 'guestbook', 'about'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: 'daily' as const,
  }))

  const indexRoute: MetadataRoute.Sitemap[number] = {
    url: siteUrl,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'never',
  }

  return [indexRoute, ...routes, ...blogRoutes]
}
