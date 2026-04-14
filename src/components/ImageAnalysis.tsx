'use client';

interface Props {
  images: {
    total: number;
    missingAlt: Array<{ src: string; alt: string }>;
    missingSizes: Array<{ src: string }>;
    optimizationOpportunities: string[];
  };
}

export default function ImageAnalysis({ images }: Props) {
  const goodImages = images.total - images.missingAlt.length;
  const stats = [
    { label: 'Total Images', value: images.total, icon: 'bi-images', color: 'primary' },
    { label: 'With Alt Text', value: goodImages, icon: 'bi-check-circle', color: 'success' },
    { label: 'Missing Alt', value: images.missingAlt.length, icon: 'bi-exclamation-circle', color: 'danger' },
    { label: 'Missing Sizes', value: images.missingSizes.length, icon: 'bi-aspect-ratio', color: 'warning' },
  ];

  return (
    <div>
      <div className="row g-3 mb-4">
        {stats.map(item => (
          <div key={item.label} className="col-6 col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <i className={`bi ${item.icon} fs-3 text-${item.color}`}></i>
                <div className={`fs-3 fw-bold text-${item.color}`}>{item.value}</div>
                <small className="text-muted">{item.label}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.optimizationOpportunities.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header">
            <i className="bi bi-lightbulb me-2 text-warning"></i>Optimization Opportunities
          </div>
          <ul className="list-group list-group-flush">
            {images.optimizationOpportunities.map((tip, i) => (
              <li key={i} className="list-group-item">
                <i className="bi bi-arrow-right me-2 text-primary"></i>{tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {images.missingAlt.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-header text-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>Images Missing Alt Text
          </div>
          <div className="list-group list-group-flush" style={{ maxHeight: 300, overflowY: 'auto' }}>
            {images.missingAlt.map((img, i) => (
              <div key={i} className="list-group-item">
                <small className="text-muted text-truncate d-block">{img.src}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
