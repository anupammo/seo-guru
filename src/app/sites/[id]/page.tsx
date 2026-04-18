'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Website, SEOAnalysis } from '@/lib/types';
import { getWebsites, updateWebsite } from '@/lib/storage';
import { analyzeSite } from '@/lib/seoAnalyzer';
import SEOChecklist from '@/components/SEOChecklist';
import SocialPreview from '@/components/SocialPreview';
import LinkAnalysis from '@/components/LinkAnalysis';
import ImageAnalysis from '@/components/ImageAnalysis';
import ExternalTools from '@/components/ExternalTools';

type TabName = 'checks' | 'social' | 'links' | 'images' | 'tools';

const tabLabels: Record<TabName, string> = {
  checks: 'SEO Checks',
  social: 'Social',
  links: 'Links',
  images: 'Images',
  tools: 'Tools',
};

export default function SiteReport() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [site, setSite] = useState<Website | null>(null);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabName>('checks');

  useEffect(() => {
    const sites = getWebsites();
    const found = sites.find(s => s.id === id);
    if (!found) { router.push('/'); return; }
    setSite(found);
    const cached = sessionStorage.getItem(`analysis_${id}`);
    if (cached) {
      setAnalysis(JSON.parse(cached));
    } else {
      runAnalysis(found);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const runAnalysis = async (s: Website) => {
    setLoading(true);
    setError('');
    try {
      const result = await analyzeSite(s.url);
      setAnalysis(result);
      sessionStorage.setItem(`analysis_${s.id}`, JSON.stringify(result));
      updateWebsite(s.id, { lastScore: result.overallScore, lastAnalyzed: result.analyzedAt });
    } catch {
      setError('Failed to analyze site. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#198754';
    if (score >= 60) return '#0d6efd';
    if (score >= 40) return '#ffc107';
    return '#dc3545';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  if (!site) return null;

  return (
    <div className="container-fluid px-3 px-md-4 py-4 py-lg-5">
      <div className="section-heading mb-4">
        <div>
          <span className="eyebrow"><i className="bi bi-gem me-2"></i>Premium site report</span>
          <h1 className="h3 fw-bold mt-2 mb-1">{site.name}</h1>
          <p className="text-muted mb-0">Deep SEO insights with a refined mobile-friendly report layout.</p>
        </div>
      </div>

      {/* Header */}
      <div className="d-flex align-items-center mb-4 gap-3 flex-wrap no-print">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => router.push('/')}>
          <i className="bi bi-arrow-left me-2"></i>Dashboard
        </button>
        <div className="flex-grow-1">
          <h2 className="h4 mb-0 fw-bold">{site.name}</h2>
          <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none small">
            <i className="bi bi-box-arrow-up-right me-1"></i>{site.url}
          </a>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={() => site && runAnalysis(site)} disabled={loading}>
            {loading
              ? <span className="spinner-border spinner-border-sm me-2"></span>
              : <i className="bi bi-arrow-clockwise me-2"></i>}
            Re-analyze
          </button>
          <button className="btn btn-outline-secondary btn-sm no-print" onClick={() => window.print()}>
            <i className="bi bi-printer me-2"></i>Print
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading && !analysis && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-muted">Analyzing {site.url}...</p>
        </div>
      )}

      {analysis && (
        <>
          {/* Score Summary */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card shadow-sm text-center h-100">
                <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white mb-3"
                    style={{
                      width: 120,
                      height: 120,
                      background: getScoreColor(analysis.overallScore),
                      fontSize: '2.5rem',
                      fontWeight: 700,
                    }}
                  >
                    {analysis.overallScore}
                  </div>
                  <h4 className="fw-bold mb-1">{getScoreLabel(analysis.overallScore)}</h4>
                  <p className="text-muted mb-0">Overall SEO Score</p>
                  <div className="progress w-100 mt-3" style={{ height: 8 }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${analysis.overallScore}%`,
                        background: getScoreColor(analysis.overallScore),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-8">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title fw-bold mb-3">
                    <i className="bi bi-info-circle me-2 text-primary"></i>Page Info
                  </h6>
                  <table className="table table-sm table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: '120px' }}>Title</td>
                        <td className="fw-semibold">{analysis.pageTitle || <span className="text-danger">Not found</span>}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Description</td>
                        <td className="text-truncate" style={{ maxWidth: '300px' }}>
                          {analysis.metaDescription || <span className="text-danger">Not found</span>}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted">Analyzed</td>
                        <td>{new Date(analysis.analyzedAt).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">Checks</td>
                        <td>
                          <span className="badge bg-success me-1">{analysis.checks.filter(c => c.status === 'good').length} Good</span>
                          <span className="badge bg-warning text-dark me-1">{analysis.checks.filter(c => c.status === 'warning').length} Warnings</span>
                          <span className="badge bg-danger">{analysis.checks.filter(c => c.status === 'error').length} Errors</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Category scores */}
          <div className="row g-3 mb-4">
            {(['On-Page SEO', 'Content', 'Technical SEO', 'Links', 'Images', 'Social Media', 'Schema'] as const).map(cat => {
              const catChecks = analysis.checks.filter(c => c.category === cat);
              if (!catChecks.length) return null;
              const catScore = Math.round(
                (catChecks.reduce((s, c) => s + c.score, 0) / catChecks.reduce((s, c) => s + c.maxScore, 0)) * 100
              );
              const color = catScore >= 80 ? 'success' : catScore >= 60 ? 'primary' : catScore >= 40 ? 'warning' : 'danger';
              return (
                <div key={cat} className="col-6 col-md-3 col-lg-auto flex-grow-1">
                  <div className="card shadow-sm h-100 text-center">
                    <div className="card-body py-3">
                      <div className={`fs-3 fw-bold text-${color}`}>{catScore}</div>
                      <div className="small text-muted">{cat}</div>
                      <div className="progress mt-2" style={{ height: 4 }}>
                        <div className={`progress-bar bg-${color}`} style={{ width: `${catScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4 no-print premium-tabs">
            {(Object.keys(tabLabels) as TabName[]).map(tab => (
              <li key={tab} className="nav-item">
                <button
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tabLabels[tab]}
                </button>
              </li>
            ))}
          </ul>

          <div>
            {activeTab === 'checks' && <SEOChecklist checks={analysis.checks} />}
            {activeTab === 'social' && <SocialPreview social={analysis.social} url={site.url} />}
            {activeTab === 'links' && <LinkAnalysis links={analysis.links} />}
            {activeTab === 'images' && <ImageAnalysis images={analysis.images} />}
            {activeTab === 'tools' && <ExternalTools performance={analysis.performance} />}
          </div>
        </>
      )}
    </div>
  );
}
