import { MetadataRoute } from 'next';
import { BASE } from './layout';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: BASE + '/sitemap.xml',
  };
}
