'use client';

interface Props {
  performance: {
    pagespeedUrl: string;
    richResultsUrl: string;
    facebookDebugUrl: string;
    linkedinInspectorUrl: string;
  };
}

export default function ExternalTools({ performance }: Props) {
  const tools = [
    {
      name: 'Google PageSpeed Insights',
      description: 'Analyze page performance and loading speed',
      icon: 'bi-speedometer2',
      color: 'primary',
      url: performance.pagespeedUrl,
    },
    {
      name: 'Google Rich Results Test',
      description: 'Test structured data and rich snippets',
      icon: 'bi-google',
      color: 'success',
      url: performance.richResultsUrl,
    },
    {
      name: 'Facebook Sharing Debugger',
      description: 'Preview how your page looks on Facebook',
      icon: 'bi-facebook',
      color: 'info',
      url: performance.facebookDebugUrl,
    },
    {
      name: 'LinkedIn Post Inspector',
      description: 'Preview LinkedIn post appearance',
      icon: 'bi-linkedin',
      color: 'primary',
      url: performance.linkedinInspectorUrl,
    },
  ];

  return (
    <div className="row g-4">
      {tools.map(tool => (
        <div key={tool.name} className="col-12 col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex align-items-start">
              <div className={`rounded-3 p-3 bg-${tool.color} bg-opacity-10 me-3`}>
                <i className={`bi ${tool.icon} fs-3 text-${tool.color}`}></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">{tool.name}</h6>
                <p className="text-muted small mb-3">{tool.description}</p>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className={`btn btn-${tool.color} btn-sm`}>
                  <i className="bi bi-box-arrow-up-right me-2"></i>Open Tool
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
