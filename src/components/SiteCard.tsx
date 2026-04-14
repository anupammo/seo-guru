'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Website } from '@/lib/types';
import { analyzeSite } from '@/lib/seoAnalyzer';

interface Props {
  site: Website;
  onRemove: () => void;
  onUpdate: (updates: Partial<Website>) => void;
}

function getScoreClass(score: number) {
  if (score >= 80) return 'bg-score-excellent text-white';
  if (score >= 60) return 'bg-score-good text-white';
  if (score >= 40) return 'bg-score-fair text-white';
  return 'bg-score-poor text-white';
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
}

export default function SiteCard({ site, onRemove, onUpdate }: Props) {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnalyzing(true);
    setError('');
    try {
      const result = await analyzeSite(site.url);
      onUpdate({ lastScore: result.overallScore, lastAnalyzed: result.analyzedAt });
      sessionStorage.setItem(`analysis_${site.id}`, JSON.stringify(result));
    } catch {
      setError('Analysis failed. Check URL.');
    } finally {
      setAnalyzing(false);
    }
  };

  const score = site.lastScore;

  return (
    <div className="card h-100 site-card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1 me-2">
            <h5 className="card-title mb-1 fw-semibold">{site.name}</h5>
            <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-muted small text-decoration-none">
              <i className="bi bi-box-arrow-up-right me-1"></i>{site.url.replace(/^https?:\/\//, '')}
            </a>
          </div>
          {score !== undefined ? (
            <div className={`score-circle rounded-circle d-flex align-items-center justify-content-center ${getScoreClass(score)}`}
              style={{ width: 64, height: 64, fontSize: '1.2rem', minWidth: 64 }}>
              {score}
            </div>
          ) : (
            <div className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-muted"
              style={{ width: 64, height: 64, minWidth: 64 }}>
              <i className="bi bi-question-lg fs-4"></i>
            </div>
          )}
        </div>

        {score !== undefined && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted">SEO Score</small>
              <small className={score >= 80 ? 'text-success' : score >= 60 ? 'text-primary' : score >= 40 ? 'text-warning' : 'text-danger'}>
                {getScoreLabel(score)}
              </small>
            </div>
            <div className="progress" style={{ height: 6 }}>
              <div
                className={`progress-bar ${score >= 80 ? 'bg-success' : score >= 60 ? 'bg-primary' : score >= 40 ? 'bg-warning' : 'bg-danger'}`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        )}

        {site.lastAnalyzed && (
          <p className="text-muted small mb-3">
            <i className="bi bi-clock me-1"></i>
            Last analyzed: {new Date(site.lastAnalyzed).toLocaleDateString()}
          </p>
        )}

        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
      </div>

      <div className="card-footer bg-transparent border-0 pb-3 pt-0 px-3">
        <div className="d-grid gap-2">
          <div className="btn-group">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Analyzing...</>
              ) : (
                <><i className="bi bi-search me-2"></i>Analyze</>
              )}
            </button>
            {score !== undefined && (
              <Link href={`/sites/${site.id}`} className="btn btn-outline-primary btn-sm">
                <i className="bi bi-bar-chart-line me-1"></i>Report
              </Link>
            )}
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={onRemove}>
            <i className="bi bi-trash me-2"></i>Remove
          </button>
        </div>
      </div>
    </div>
  );
}
