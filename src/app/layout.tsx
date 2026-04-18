import type { Metadata, Viewport } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'SEO Guru - SEO Analysis Dashboard',
  description: 'Track and optimize multiple websites with comprehensive SEO analysis',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'SEO Guru' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7c3aed',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="premium-body">
        <ServiceWorkerRegister />
        <div className="app-shell">
          <div className="app-bg-orb orb-1"></div>
          <div className="app-bg-orb orb-2"></div>
          <div className="app-bg-orb orb-3"></div>

          <nav className="navbar premium-navbar sticky-top">
            <div className="container-fluid px-3 px-md-4">
              <a className="premium-brand" href="/">
                <span className="brand-icon">
                  <i className="bi bi-stars"></i>
                </span>
                <span className="brand-copy">
                  <strong>SEO Guru</strong>
                  <small>Premium growth dashboard</small>
                </span>
              </a>
              <span className="premium-pill d-none d-md-inline-flex">
                <i className="bi bi-phone me-2"></i>PWA Ready
              </span>
            </div>
          </nav>

          <main className="app-main">{children}</main>

          <footer className="premium-footer">
            <small>SEO Guru &copy; {new Date().getFullYear()} • Premium SEO experience</small>
          </footer>
        </div>
      </body>
    </html>
  );
}
