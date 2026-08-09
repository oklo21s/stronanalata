import type { MetadataRoute } from 'next';

import { firma } from '@/lib/content';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `https://${firma.domena}/sitemap.xml`,
  };
}
