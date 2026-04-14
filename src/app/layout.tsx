import type { Metadata, Viewport } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'SEO Guru - SEO Analysis Dashboard',
  description: 'Track and optimize multiple websites with comprehensive SEO analysis',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'SEO Guru' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d6efd',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <ServiceWorkerRegister />
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold" href="/">
              <i className="bi bi-graph-up-arrow me-2"></i>SEO Guru
            </a>
            <span className="navbar-text text-white-50 small d-none d-md-block">
              SEO Analysis Dashboard
            </span>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-dark text-white-50 text-center py-3 mt-5">
          <small>SEO Guru &copy; {new Date().getFullYear()} - Comprehensive SEO Analysis</small>
        </footer>
      </body>
    </html>
  );
}
