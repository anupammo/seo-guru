'use client';
import { useState } from 'react';

interface Props {
  links: {
    internal: Array<{ url: string; text: string }>;
    external: Array<{ url: string; text: string }>;
    broken: Array<{ url: string; text: string }>;
    noText: Array<{ url: string; text: string }>;
  };
}

type TabKey = 'internal' | 'external' | 'broken' | 'notext';

export default function LinkAnalysis({ links }: Props) {
  const [tab, setTab] = useState<TabKey>('internal');

  const current =
    tab === 'internal' ? links.internal :
    tab === 'external' ? links.external :
    tab === 'broken' ? links.broken :
    links.noText;

  const tabConfig: Array<{ label: string; count: number; icon: string; color: string; key: TabKey }> = [
    { label: 'Internal Links', count: links.internal.length, icon: 'bi-link', color: 'primary', key: 'internal' },
    { label: 'External Links', count: links.external.length, icon: 'bi-box-arrow-up-right', color: 'info', key: 'external' },
    { label: 'Broken Links', count: links.broken.length, icon: 'bi-link-45deg', color: 'danger', key: 'broken' },
    { label: 'No Text Links', count: links.noText.length, icon: 'bi-exclamation-triangle', color: 'warning', key: 'notext' },
  ];

  return (
    <div>
      <div className="row g-3 mb-4">
        {tabConfig.map(item => (
          <div key={item.key} className="col-6 col-md-3">
            <div
              className={`card text-center shadow-sm border-${item.color} ${tab === item.key ? `border-${item.color} bg-${item.color} bg-opacity-10` : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setTab(item.key)}
            >
              <div className="card-body py-3">
                <i className={`bi ${item.icon} fs-3 text-${item.color}`}></i>
                <div className={`fs-3 fw-bold text-${item.color}`}>{item.count}</div>
                <small className="text-muted">{item.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm">
        <div className="card-header">
          <strong>
            {tab === 'internal' ? 'Internal' : tab === 'external' ? 'External' : tab === 'broken' ? 'Broken' : 'No Text'} Links
          </strong>
        </div>
        <div className="card-body p-0">
          {current.length === 0 ? (
            <p className="text-muted text-center py-4">No links in this category</p>
          ) : (
            <div className="list-group list-group-flush" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {current.map((link, i) => (
                <div key={i} className="list-group-item list-group-item-action">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-2">
                      <p className="mb-0 small fw-semibold text-truncate">
                        {link.text || <em className="text-muted">No text</em>}
                      </p>
                      <small className="text-muted text-truncate d-block">{link.url}</small>
                    </div>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
