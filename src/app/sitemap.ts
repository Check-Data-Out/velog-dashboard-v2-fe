import { MetadataRoute } from 'next';
import { BASE } from './layout';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'monthly' },
    {
      url: BASE + '/main',
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    {
      url: BASE + '/leaderboards',
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
    {
      url: BASE + '/compare',
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
  ];
}
