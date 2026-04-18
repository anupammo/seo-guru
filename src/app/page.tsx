'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Website } from '@/lib/types';
import { getWebsites, addWebsite, removeWebsite, updateWebsite } from '@/lib/storage';
import SiteCard from '@/components/SiteCard';
import AddSiteModal from '@/components/AddSiteModal';

export default function Dashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setWebsites(getWebsites());
    setIsOnline(window.navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAddSite = (url: string, name: string) => {
    const newSite = addWebsite({ url, name });
    setWebsites(prev => [...prev, newSite]);
    setShowModal(false);
  };

  const handleRemoveSite = (id: string) => {
    removeWebsite(id);
    setWebsites(prev => prev.filter(w => w.id !== id));
  };

  const handleUpdateSite = (id: string, updates: Partial<Website>) => {
    updateWebsite(id, updates);
    setWebsites(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4 py-lg-5 dashboard-shell">
      <section className="hero-panel mb-4 mb-lg-5">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-7">
            <span className="eyebrow">
              <i className="bi bi-stars me-2"></i>2026 premium SEO workspace
            </span>
            <h1 className="hero-title mt-3">Beautiful analytics for modern brands and agencies</h1>
            <p className="hero-subtitle mb-4">
              Monitor websites, run instant audits, and present results with a polished mobile-first dashboard experience.
            </p>

            <div className="hero-chip-list mb-4">
              <span className="hero-chip"><i className="bi bi-phone me-2"></i>Mobile App Feel</span>
              <span className="hero-chip"><i className="bi bi-lightning-charge me-2"></i>Fast SEO Checks</span>
              <span className="hero-chip"><i className="bi bi-shield-check me-2"></i>PWA Installed</span>
            </div>

            <div className="d-flex flex-wrap gap-2 hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Add Website
              </button>
              <span className="premium-soft-badge">
                <i className="bi bi-bar-chart-line me-2"></i>{websites.length} active project{websites.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="hero-visual">
              <Image
                src="/premium-hero.svg"
                alt="Premium SEO dashboard illustration"
                className="img-fluid premium-illustration"
                width={720}
                height={540}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {!isOnline && (
        <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-wifi-off me-2"></i>
          <span>You&apos;re offline. Previously loaded pages remain available.</span>
        </div>
      )}

      <div className="section-heading mb-3">
        <div>
          <h2 className="h4 fw-bold mb-1">Your websites</h2>
          <p className="text-muted mb-0">Track rankings, content health, and technical SEO in one place.</p>
        </div>
      </div>

      {websites.length === 0 ? (
        <div className="card border-0 p-2 p-md-3">
          <div className="card-body text-center py-5">
            <div className="display-3 mb-3 text-info">
              <i className="bi bi-window-stack"></i>
            </div>
            <h3 className="h4 fw-bold mb-2">Start with your first website</h3>
            <p className="text-muted mb-4">Create a polished SEO workspace in seconds and analyze performance with a premium dashboard.</p>
            <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>Add Website
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {websites.map(site => (
            <div key={site.id} className="col-12 col-md-6 col-xl-4">
              <SiteCard
                site={site}
                onRemove={() => handleRemoveSite(site.id)}
                onUpdate={(updates) => handleUpdateSite(site.id, updates)}
              />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddSiteModal
          onAdd={handleAddSite}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
