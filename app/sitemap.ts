import { MetadataRoute } from 'next'
import { getCars } from '@/lib/cars'

const SITE = 'https://unitymotor.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Never let a blob/network hiccup fail the whole sitemap build.
  const cars = await getCars().catch(() => [])

  const carUrls: MetadataRoute.Sitemap = cars
    .filter((c) => !c.sold)
    .map((c) => ({
      url: `${SITE}/cars/${c.slug}`,
      lastModified: new Date(c.createdAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${SITE}/cars`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE}/#services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE}/#about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE}/#pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${SITE}/#booking`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    ...carUrls,
  ]
}
