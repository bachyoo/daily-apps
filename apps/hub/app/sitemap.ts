import type { MetadataRoute } from 'next';
import appsData from '@/data/apps.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const staticPages = [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/privacy`, lastModified: new Date() },
    { url: `${siteUrl}/terms`, lastModified: new Date() },
  ];
  const appPages = (appsData as { path: string; date: string }[]).map((app) => ({
    url: `${siteUrl}${app.path}`,
    lastModified: new Date(app.date),
  }));
  return [...staticPages, ...appPages];
}
