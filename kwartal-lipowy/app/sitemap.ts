import type { MetadataRoute } from 'next';

import { firma } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${firma.domena}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
