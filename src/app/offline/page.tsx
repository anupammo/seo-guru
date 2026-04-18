export default function OfflinePage() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 text-center">
            <div className="card-body p-5">
              <div className="display-4 text-warning mb-3">
                <i className="bi bi-wifi-off"></i>
              </div>
              <h1 className="h3 fw-bold mb-3">You&apos;re offline</h1>
              <p className="text-muted mb-4">
                SEO Guru is unavailable right now, but previously cached content can still be viewed.
              </p>
              <a href="/" className="btn btn-primary">
                <i className="bi bi-arrow-clockwise me-2"></i>
                Try again
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
