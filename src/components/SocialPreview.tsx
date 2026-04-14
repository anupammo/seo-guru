'use client';

interface Props {
  social: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    twitterCard?: string;
    twitterTitle?: string;
  };
  url: string;
}

export default function SocialPreview({ social, url }: Props) {
  const domain = new URL(url).hostname;
  return (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-facebook me-2"></i>Facebook / Open Graph Preview
          </div>
          <div className="card-body">
            {social.ogImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={social.ogImage}
                alt="OG Preview"
                className="img-fluid rounded mb-3"
                style={{ maxHeight: 200, objectFit: 'cover', width: '100%' }}
              />
            )}
            <div className="bg-light rounded p-3">
              <small className="text-uppercase text-muted">{domain}</small>
              <p className="mb-1 fw-semibold">{social.ogTitle || 'No OG Title'}</p>
              <small className="text-muted">{social.ogDescription || 'No OG Description'}</small>
            </div>
          </div>
          <div className="card-footer small text-muted">
            <div><strong>og:title:</strong> {social.ogTitle || <span className="text-danger">Missing</span>}</div>
            <div><strong>og:description:</strong> {social.ogDescription?.substring(0, 60) || <span className="text-danger">Missing</span>}</div>
            <div><strong>og:image:</strong> {social.ogImage ? <span className="text-success">Present</span> : <span className="text-danger">Missing</span>}</div>
            <div><strong>og:url:</strong> {social.ogUrl || <span className="text-warning">Not set</span>}</div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-header" style={{ background: '#1da1f2', color: 'white' }}>
            <i className="bi bi-twitter me-2"></i>Twitter Card Preview
          </div>
          <div className="card-body">
            <div className="bg-light rounded p-3">
              <p className="mb-1 fw-semibold">{social.twitterTitle || social.ogTitle || 'No Twitter Title'}</p>
              <small className="text-muted">{domain}</small>
            </div>
          </div>
          <div className="card-footer small text-muted">
            <div><strong>twitter:card:</strong> {social.twitterCard || <span className="text-danger">Missing</span>}</div>
            <div><strong>twitter:title:</strong> {social.twitterTitle || <span className="text-warning">Not set (using og:title)</span>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
