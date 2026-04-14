export interface Website {
  id: string;
  url: string;
  name: string;
  addedAt: string;
  lastAnalyzed?: string;
  lastScore?: number;
}

export interface SEOCheck {
  id: string;
  category: string;
  name: string;
  status: 'good' | 'warning' | 'error' | 'info';
  score: number;
  maxScore: number;
  message: string;
  recommendation?: string;
  details?: string;
}

export interface SEOAnalysis {
  url: string;
  analyzedAt: string;
  overallScore: number;
  pageTitle?: string;
  metaDescription?: string;
  checks: SEOCheck[];
  links: {
    internal: Array<{ url: string; text: string; status?: number }>;
    external: Array<{ url: string; text: string }>;
    broken: Array<{ url: string; text: string }>;
    noText: Array<{ url: string; text: string }>;
  };
  images: {
    total: number;
    missingAlt: Array<{ src: string; alt: string }>;
    missingSizes: Array<{ src: string }>;
    optimizationOpportunities: string[];
  };
  social: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    twitterCard?: string;
    twitterTitle?: string;
  };
  schema: {
    detected: boolean;
    types: string[];
  };
  performance: {
    pagespeedUrl: string;
    richResultsUrl: string;
    facebookDebugUrl: string;
    linkedinInspectorUrl: string;
  };
}
