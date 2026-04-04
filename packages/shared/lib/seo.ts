import type { Metadata } from 'next';

interface AppMetadataOptions {
  appName: string;
  description: string;
  path?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export function generateAppMetadata({ appName, description, path = '/' }: AppMetadataOptions): Metadata {
  const title = `${appName} | Daily Apps`;
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    openGraph: { title, description, url, siteName: 'Daily Apps', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: url },
  };
}
