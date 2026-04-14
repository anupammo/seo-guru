import { SEOAnalysis } from './types';

export async function analyzeSite(url: string): Promise<SEOAnalysis> {
  const response = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error('Failed to analyze site');
  }
  return response.json();
}
