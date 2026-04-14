import { NextRequest, NextResponse } from 'next/server';
import { SEOAnalysis, SEOCheck } from '@/lib/types';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SEOGuru/1.0 (+https://seo-guru.app)' },
      signal: AbortSignal.timeout(15000),
    });
    const html = await response.text();
    const analysis = analyzeHTML(url, html);
    return NextResponse.json(analysis);
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError';
    const message = isTimeout
      ? 'Request timed out after 15 seconds. The website may be slow or unreachable.'
      : 'Failed to fetch URL. Please verify the URL is accessible and try again.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function analyzeHTML(url: string, html: string): SEOAnalysis {
  const checks: SEOCheck[] = [];

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : '';

  const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/gis) || [];
  const h1Count = h1Matches.length;
  const h1Text = h1Count > 0 ? (h1Matches[0] ?? '').replace(/<[^>]*>/g, '').trim() : '';

  const h2Matches = html.match(/<h2[^>]*>.*?<\/h2>/gis) || [];
  const h2Count = h2Matches.length;

  const h3Matches = html.match(/<h3[^>]*>.*?<\/h3>/gis) || [];

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
    html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
  const viewport = viewportMatch ? viewportMatch[1].trim() : '';

  const schemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const schemaTypes: string[] = [];
  schemaMatches.forEach(schema => {
    const typeMatch = schema.match(/"@type"\s*:\s*"([^"]+)"/);
    if (typeMatch) schemaTypes.push(typeMatch[1]);
  });

  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i);
  const ogTitle = ogTitleMatch ? ogTitleMatch[1] : '';

  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["']/i);
  const ogDesc = ogDescMatch ? ogDescMatch[1] : '';

  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i);
  const ogImage = ogImageMatch ? ogImageMatch[1] : '';

  const ogUrlMatch = html.match(/<meta[^>]*property=["']og:url["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:url["']/i);
  const ogUrl = ogUrlMatch ? ogUrlMatch[1] : '';

  const twitterCardMatch = html.match(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:card["']/i);
  const twitterCard = twitterCardMatch ? twitterCardMatch[1] : '';

  const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:title["']/i);
  const twitterTitle = twitterTitleMatch ? twitterTitleMatch[1] : '';

  const hasGA = html.includes('google-analytics.com') || html.includes('googletagmanager.com') ||
    html.includes('gtag(') || html.includes('_gaq.push') || html.includes('UA-') || html.includes('G-');

  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']robots["']/i);
  const robots = robotsMatch ? robotsMatch[1] : '';
  const isNoIndex = robots.toLowerCase().includes('noindex');

  const linkMatches = html.match(/<a[^>]*href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi) || [];
  const baseUrl = new URL(url);
  const internalLinks: Array<{ url: string; text: string; status?: number }> = [];
  const externalLinks: Array<{ url: string; text: string }> = [];
  const noTextLinks: Array<{ url: string; text: string }> = [];

  linkMatches.forEach(link => {
    const hrefMatch = link.match(/href=["']([^"']*?)["']/i);
    const textContent = link.replace(/<[^>]*>/g, '').trim();
    if (!hrefMatch) return;
    let href = hrefMatch[1];
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
    if (href.startsWith('#')) return;
    if (href.startsWith('/')) href = `${baseUrl.origin}${href}`;

    try {
      const linkUrl = new URL(href);
      if (linkUrl.hostname === baseUrl.hostname) {
        internalLinks.push({ url: href, text: textContent });
      } else {
        externalLinks.push({ url: href, text: textContent });
      }
      if (!textContent && !link.match(/alt=["'][^"']+["']/i)) {
        noTextLinks.push({ url: href, text: textContent });
      }
    } catch { /* ignore invalid URLs */ }
  });

  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  const missingAlt: Array<{ src: string; alt: string }> = [];
  const missingSizes: Array<{ src: string }> = [];

  imgMatches.forEach(img => {
    const srcMatch = img.match(/src=["']([^"']*)["']/i);
    const altMatch = img.match(/alt=["']([^"']*)["']/i);
    const widthMatch = img.match(/width=["']([^"']*)["']/i);
    const heightMatch = img.match(/height=["']([^"']*)["']/i);
    const src = srcMatch ? srcMatch[1] : 'unknown';
    const alt = altMatch ? altMatch[1] : '';

    if (!altMatch || alt === '') {
      missingAlt.push({ src, alt: '' });
    }
    if (!widthMatch || !heightMatch) {
      missingSizes.push({ src });
    }
  });

  const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textContent.split(' ').filter(w => w.length > 2).length;

  const hasSSL = url.startsWith('https://');

  const urlObj = new URL(url);
  const hasGoodUrl = !urlObj.pathname.includes('?') && urlObj.pathname.length < 100;

  const hasSitemapLink = html.includes('sitemap') || html.includes('sitemap.xml');

  // 1. Title tag
  checks.push({
    id: 'title-exists',
    category: 'On-Page SEO',
    name: 'Title Tag',
    status: title ? (title.length >= 50 && title.length <= 60 ? 'good' : 'warning') : 'error',
    score: title ? (title.length >= 50 && title.length <= 60 ? 10 : 6) : 0,
    maxScore: 10,
    message: title ? `Title: "${title}" (${title.length} chars)` : 'No title tag found',
    recommendation: !title ? 'Add a descriptive title tag' :
      (title.length < 50 ? 'Title is too short (aim for 50-60 chars)' :
        title.length > 60 ? 'Title is too long (aim for 50-60 chars)' : 'Title length is optimal'),
  });

  // 2. Meta description
  checks.push({
    id: 'meta-description',
    category: 'On-Page SEO',
    name: 'Meta Description',
    status: metaDesc ? (metaDesc.length >= 120 && metaDesc.length <= 160 ? 'good' : 'warning') : 'error',
    score: metaDesc ? (metaDesc.length >= 120 && metaDesc.length <= 160 ? 10 : 6) : 0,
    maxScore: 10,
    message: metaDesc ? `Description: "${metaDesc.substring(0, 80)}..." (${metaDesc.length} chars)` : 'No meta description found',
    recommendation: !metaDesc ? 'Add a meta description (120-160 chars)' :
      (metaDesc.length < 120 ? 'Description is too short (aim for 120-160 chars)' :
        metaDesc.length > 160 ? 'Description is too long (aim for 120-160 chars)' : 'Meta description is optimal'),
  });

  // 3. H1 tag
  checks.push({
    id: 'h1-tag',
    category: 'Content',
    name: 'H1 Heading',
    status: h1Count === 1 ? 'good' : (h1Count === 0 ? 'error' : 'warning'),
    score: h1Count === 1 ? 8 : (h1Count === 0 ? 0 : 4),
    maxScore: 8,
    message: h1Count === 0 ? 'No H1 tag found' :
      h1Count === 1 ? `H1: "${h1Text.substring(0, 50)}"` : `${h1Count} H1 tags found (should have only 1)`,
    recommendation: h1Count === 0 ? 'Add exactly one H1 tag' :
      h1Count > 1 ? 'Use only one H1 tag per page' : 'Good - one H1 tag present',
  });

  // 4. H2 tags
  checks.push({
    id: 'h2-tags',
    category: 'Content',
    name: 'H2 Headings',
    status: h2Count >= 2 ? 'good' : (h2Count === 1 ? 'warning' : 'error'),
    score: h2Count >= 2 ? 6 : (h2Count === 1 ? 3 : 0),
    maxScore: 6,
    message: `${h2Count} H2 heading(s) found`,
    recommendation: h2Count < 2 ? 'Add multiple H2 headings to structure content' : 'Good heading structure',
  });

  // 5. Content length
  checks.push({
    id: 'content-length',
    category: 'Content',
    name: 'Content Length',
    status: wordCount >= 500 ? 'good' : (wordCount >= 300 ? 'warning' : 'error'),
    score: wordCount >= 500 ? 8 : (wordCount >= 300 ? 4 : 2),
    maxScore: 8,
    message: `~${wordCount} words detected`,
    recommendation: wordCount < 500 ? 'Add more content (aim for 500+ words)' : 'Content length is good',
  });

  // 6. Images alt text
  checks.push({
    id: 'images-alt',
    category: 'Images',
    name: 'Image Alt Text',
    status: missingAlt.length === 0 ? 'good' : (missingAlt.length <= 2 ? 'warning' : 'error'),
    score: missingAlt.length === 0 ? 8 : Math.max(0, 8 - missingAlt.length * 2),
    maxScore: 8,
    message: missingAlt.length === 0 ? 'All images have alt text' : `${missingAlt.length} image(s) missing alt text`,
    recommendation: missingAlt.length > 0 ? 'Add descriptive alt text to all images' : 'Good - all images have alt text',
  });

  // 7. Internal links
  checks.push({
    id: 'internal-links',
    category: 'Links',
    name: 'Internal Links',
    status: internalLinks.length >= 3 ? 'good' : (internalLinks.length >= 1 ? 'warning' : 'error'),
    score: internalLinks.length >= 3 ? 6 : (internalLinks.length >= 1 ? 3 : 0),
    maxScore: 6,
    message: `${internalLinks.length} internal link(s) found`,
    recommendation: internalLinks.length < 3 ? 'Add more internal links to improve navigation' : 'Good internal linking',
  });

  // 8. External links
  checks.push({
    id: 'external-links',
    category: 'Links',
    name: 'External Links',
    status: externalLinks.length > 0 ? 'good' : 'warning',
    score: externalLinks.length > 0 ? 4 : 2,
    maxScore: 4,
    message: `${externalLinks.length} external link(s) found`,
    recommendation: externalLinks.length === 0 ? 'Consider adding relevant external links' : 'External links present',
  });

  // 9. Discernible link names
  checks.push({
    id: 'link-text',
    category: 'Links',
    name: 'Discernible Link Text',
    status: noTextLinks.length === 0 ? 'good' : 'warning',
    score: noTextLinks.length === 0 ? 4 : Math.max(0, 4 - noTextLinks.length),
    maxScore: 4,
    message: noTextLinks.length === 0 ? 'All links have descriptive text' : `${noTextLinks.length} link(s) missing text`,
    recommendation: noTextLinks.length > 0 ? 'Add descriptive text to all links' : 'Good link accessibility',
  });

  // 10. Mobile viewport
  checks.push({
    id: 'viewport',
    category: 'Technical SEO',
    name: 'Mobile Viewport',
    status: viewport ? 'good' : 'error',
    score: viewport ? 8 : 0,
    maxScore: 8,
    message: viewport ? `Viewport: "${viewport}"` : 'No viewport meta tag found',
    recommendation: !viewport ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1">' : 'Mobile viewport is configured',
  });

  // 11. Canonical URL
  checks.push({
    id: 'canonical',
    category: 'Technical SEO',
    name: 'Canonical URL',
    status: canonical ? 'good' : 'warning',
    score: canonical ? 6 : 2,
    maxScore: 6,
    message: canonical ? `Canonical: ${canonical}` : 'No canonical URL found',
    recommendation: !canonical ? 'Add a canonical URL tag to prevent duplicate content issues' : 'Canonical URL is set',
  });

  // 12. SSL/HTTPS
  checks.push({
    id: 'ssl',
    category: 'Technical SEO',
    name: 'SSL / HTTPS',
    status: hasSSL ? 'good' : 'error',
    score: hasSSL ? 8 : 0,
    maxScore: 8,
    message: hasSSL ? 'Site is using HTTPS' : 'Site is not using HTTPS',
    recommendation: !hasSSL ? 'Enable HTTPS/SSL on your website' : 'HTTPS is enabled',
  });

  // 13. Schema Markup
  checks.push({
    id: 'schema-markup',
    category: 'Schema',
    name: 'Schema Markup',
    status: schemaMatches.length > 0 ? 'good' : 'warning',
    score: schemaMatches.length > 0 ? 8 : 2,
    maxScore: 8,
    message: schemaMatches.length > 0 ? `Schema found: ${schemaTypes.join(', ') || 'unknown types'}` : 'No schema markup detected',
    recommendation: schemaMatches.length === 0 ? 'Add JSON-LD schema markup for rich results' : 'Schema markup is present',
  });

  // 14. Open Graph
  checks.push({
    id: 'og-tags',
    category: 'Social Media',
    name: 'Open Graph Tags',
    status: ogTitle && ogDesc && ogImage ? 'good' : (ogTitle ? 'warning' : 'error'),
    score: (ogTitle ? 3 : 0) + (ogDesc ? 3 : 0) + (ogImage ? 2 : 0),
    maxScore: 8,
    message: ogTitle ? `OG Title: "${ogTitle.substring(0, 40)}"` : 'No Open Graph tags found',
    recommendation: !ogTitle ? 'Add og:title, og:description, og:image tags' :
      !ogImage ? 'Add og:image for better social sharing' : 'Open Graph tags are complete',
  });

  // 15. Twitter Card
  checks.push({
    id: 'twitter-card',
    category: 'Social Media',
    name: 'Twitter Card',
    status: twitterCard ? 'good' : 'warning',
    score: twitterCard ? 6 : 2,
    maxScore: 6,
    message: twitterCard ? `Twitter Card: ${twitterCard}` : 'No Twitter Card tags found',
    recommendation: !twitterCard ? 'Add twitter:card and twitter:title meta tags' : 'Twitter Card is configured',
  });

  // 16. Google Analytics
  checks.push({
    id: 'google-analytics',
    category: 'Technical SEO',
    name: 'Google Analytics',
    status: hasGA ? 'good' : 'warning',
    score: hasGA ? 6 : 2,
    maxScore: 6,
    message: hasGA ? 'Google Analytics / GTM detected' : 'No analytics tracking detected',
    recommendation: !hasGA ? 'Install Google Analytics or Google Tag Manager' : 'Analytics tracking is installed',
  });

  // 17. Robots meta
  checks.push({
    id: 'robots-meta',
    category: 'Technical SEO',
    name: 'Robots Directive',
    status: isNoIndex ? 'error' : 'good',
    score: isNoIndex ? 0 : 6,
    maxScore: 6,
    message: robots ? `Robots: "${robots}"` : 'No robots meta tag (default: index, follow)',
    recommendation: isNoIndex ? 'Remove noindex directive to allow search engines to index this page' : 'Page is indexable',
  });

  // 18. Image sizes
  checks.push({
    id: 'image-sizes',
    category: 'Images',
    name: 'Image Dimensions',
    status: missingSizes.length === 0 ? 'good' : (missingSizes.length <= 3 ? 'warning' : 'error'),
    score: missingSizes.length === 0 ? 4 : Math.max(0, 4 - Math.floor(missingSizes.length / 2)),
    maxScore: 4,
    message: missingSizes.length === 0 ? 'All images have width/height attributes' : `${missingSizes.length} image(s) missing size attributes`,
    recommendation: missingSizes.length > 0 ? 'Add width and height attributes to all images to prevent layout shifts' : 'Image dimensions are specified',
  });

  // 19. URL structure
  checks.push({
    id: 'url-structure',
    category: 'Technical SEO',
    name: 'URL Structure',
    status: hasGoodUrl ? 'good' : 'warning',
    score: hasGoodUrl ? 4 : 2,
    maxScore: 4,
    message: `URL: ${url}`,
    recommendation: !hasGoodUrl ? 'Use clean, descriptive URLs without excessive parameters' : 'URL structure is clean',
  });

  // 20. Sitemap reference
  checks.push({
    id: 'sitemap',
    category: 'Technical SEO',
    name: 'Sitemap',
    status: hasSitemapLink ? 'good' : 'warning',
    score: hasSitemapLink ? 4 : 1,
    maxScore: 4,
    message: hasSitemapLink ? 'Sitemap reference found' : 'No sitemap reference in HTML',
    recommendation: !hasSitemapLink ? 'Create and submit a sitemap.xml to search engines' : 'Sitemap is referenced',
  });

  // 21. H3 structure
  checks.push({
    id: 'heading-structure',
    category: 'Content',
    name: 'Heading Hierarchy',
    status: (h1Count === 1 && h2Count > 0) ? 'good' : 'warning',
    score: (h1Count === 1 && h2Count > 0 && h3Matches.length > 0) ? 6 : (h1Count === 1 && h2Count > 0 ? 4 : 2),
    maxScore: 6,
    message: `Headings: H1×${h1Count}, H2×${h2Count}, H3×${h3Matches.length}`,
    recommendation: h1Count !== 1 ? 'Use exactly one H1, followed by H2 and H3 headings' :
      h2Count === 0 ? 'Add H2 headings to structure content' : 'Good heading hierarchy',
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxScore, 0);
  const overallScore = Math.round((totalScore / maxScore) * 100);

  const encodedUrl = encodeURIComponent(url);

  return {
    url,
    analyzedAt: new Date().toISOString(),
    overallScore,
    pageTitle: title,
    metaDescription: metaDesc,
    checks,
    links: {
      internal: internalLinks.slice(0, 30),
      external: externalLinks.slice(0, 20),
      broken: [],
      noText: noTextLinks,
    },
    images: {
      total: imgMatches.length,
      missingAlt,
      missingSizes,
      optimizationOpportunities: [
        imgMatches.length > 10 ? 'Consider lazy loading for images below the fold' : '',
        missingSizes.length > 0 ? 'Add width/height attributes to prevent Cumulative Layout Shift (CLS)' : '',
        missingAlt.length > 0 ? 'Add descriptive alt text for accessibility and SEO' : '',
      ].filter(Boolean),
    },
    social: {
      ogTitle,
      ogDescription: ogDesc,
      ogImage,
      ogUrl,
      twitterCard,
      twitterTitle,
    },
    schema: {
      detected: schemaMatches.length > 0,
      types: schemaTypes,
    },
    performance: {
      pagespeedUrl: `https://pagespeed.web.dev/report?url=${encodedUrl}`,
      richResultsUrl: `https://search.google.com/test/rich-results?url=${encodedUrl}`,
      facebookDebugUrl: `https://developers.facebook.com/tools/debug/?q=${encodedUrl}`,
      linkedinInspectorUrl: `https://www.linkedin.com/post-inspector/inspect/${encodedUrl}`,
    },
  };
}
