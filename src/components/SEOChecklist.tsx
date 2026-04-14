'use client';
import { SEOCheck } from '@/lib/types';

interface Props { checks: SEOCheck[]; }

const categories = ['On-Page SEO', 'Content', 'Technical SEO', 'Links', 'Images', 'Social Media', 'Schema'];

const statusIcon: Record<string, string> = {
  good: 'bi-check-circle-fill text-success',
  warning: 'bi-exclamation-triangle-fill text-warning',
  error: 'bi-x-circle-fill text-danger',
  info: 'bi-info-circle-fill text-info'
};

export default function SEOChecklist({ checks }: Props) {
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = checks.filter(c => c.category === cat);
    return acc;
  }, {} as Record<string, SEOCheck[]>);

  return (
    <div className="accordion" id="seoAccordion">
      {categories.map((cat, idx) => {
        const catChecks = grouped[cat] || [];
        if (!catChecks.length) return null;
        const good = catChecks.filter(c => c.status === 'good').length;
        const errors = catChecks.filter(c => c.status === 'error').length;
        const warnings = catChecks.filter(c => c.status === 'warning').length;
        const isOpen = idx === 0;
        return (
          <div className="accordion-item border mb-2 rounded shadow-sm" key={cat}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${isOpen ? '' : 'collapsed'} fw-semibold`}
                type="button"
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const target = btn.closest('.accordion-item')?.querySelector('.accordion-collapse');
                  if (target) {
                    target.classList.toggle('show');
                    btn.classList.toggle('collapsed');
                  }
                }}
              >
                <span className="me-3">{cat}</span>
                <span className="ms-auto d-flex gap-1 me-3">
                  {good > 0 && <span className="badge bg-success">{good}</span>}
                  {warnings > 0 && <span className="badge bg-warning text-dark">{warnings}</span>}
                  {errors > 0 && <span className="badge bg-danger">{errors}</span>}
                </span>
              </button>
            </h2>
            <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
              <div className="accordion-body p-0">
                {catChecks.map(check => (
                  <div key={check.id} className={`check-item ${check.status} d-flex align-items-start p-3 border-bottom`}>
                    <i className={`bi ${statusIcon[check.status]} me-3 mt-1 flex-shrink-0`}></i>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <strong className="small">{check.name}</strong>
                        <span className="small text-muted ms-2">{check.score}/{check.maxScore} pts</span>
                      </div>
                      <p className="small text-muted mb-1">{check.message}</p>
                      {check.recommendation && (
                        <p className="small mb-0">
                          <i className="bi bi-lightbulb me-1 text-warning"></i>
                          {check.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
