'use client';
import { useState, useEffect } from 'react';
import { Website } from '@/lib/types';
import { getWebsites, addWebsite, removeWebsite, updateWebsite } from '@/lib/storage';
import SiteCard from '@/components/SiteCard';
import AddSiteModal from '@/components/AddSiteModal';

export default function Dashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setWebsites(getWebsites());
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
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 fw-bold">
            <i className="bi bi-speedometer2 me-2 text-primary"></i>
            SEO Dashboard
          </h1>
          <p className="text-muted mb-0">{websites.length} website(s) tracked</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Add Website
        </button>
      </div>

      {websites.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-globe display-1 text-muted"></i>
          <h4 className="mt-3 text-muted">No websites added yet</h4>
          <p className="text-muted">Add your first website to start analyzing SEO</p>
          <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>Add Website
          </button>
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
