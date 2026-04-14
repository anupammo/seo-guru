'use client';
import { useState } from 'react';

interface Props {
  onAdd: (url: string, name: string) => void;
  onClose: () => void;
}

export default function AddSiteModal({ onAdd, onClose }: Props) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    try {
      new URL(finalUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }
    if (!name.trim()) {
      setError('Please enter a site name');
      return;
    }
    onAdd(finalUrl, name.trim());
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className="bi bi-plus-circle me-2 text-primary"></i>Add Website</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label fw-semibold">Website URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://example.com"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Site Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="My Website"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-plus me-2"></i>Add Website
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
