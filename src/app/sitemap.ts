import { MetadataRoute } from 'next';
import { URLS } from '@/lib/constants/urls.constant';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: URLS.VELOG_DASHBOARD, lastModified: new Date(), changeFrequency: 'monthly' },
    { url: URLS.VELOG_DASHBOARD + '/main', lastModified: new Date(), changeFrequency: 'monthly' },
    {
      url: URLS.VELOG_DASHBOARD + '/leaderboards',
      lastModified: new Date(),
      changeFrequency: 'monthly',
    },
  ];
}
