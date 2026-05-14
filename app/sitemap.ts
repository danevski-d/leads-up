import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://useleadsup.com/',          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: 'https://useleadsup.com/login',     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://useleadsup.com/privacy',   lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: 'https://useleadsup.com/terms',     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: 'https://useleadsup.com/security',  lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
