import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEO Guru - SEO Analysis Dashboard',
    short_name: 'SEO Guru',
    description: 'Track and optimize multiple websites with comprehensive SEO analysis',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d1117',
    theme_color: '#0d6efd',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
