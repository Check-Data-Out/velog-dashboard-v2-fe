import { MetadataRoute } from 'next';
import { URLS } from '@/lib/constants/urls.constant';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: URLS.VELOG_DASHBOARD + '/sitemap.xml' };
}
