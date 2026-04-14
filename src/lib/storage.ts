import { Website } from './types';

const STORAGE_KEY = 'seo_guru_websites';

export const DEFAULT_WEBSITES: Website[] = [
  { id: '1', url: 'https://wheelguru.in', name: 'WheelGuru', addedAt: new Date().toISOString() },
  { id: '2', url: 'https://nivesguru.in', name: 'NivesGuru', addedAt: new Date().toISOString() },
  { id: '3', url: 'https://sundarban-tour.com', name: 'Sundarban Tour', addedAt: new Date().toISOString() },
  { id: '4', url: 'https://anupammondal.in', name: 'Anupam Mondal', addedAt: new Date().toISOString() },
  { id: '5', url: 'https://pstourism.in', name: 'PS Tourism', addedAt: new Date().toISOString() },
];

export function getWebsites(): Website[] {
  if (typeof window === 'undefined') return DEFAULT_WEBSITES;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WEBSITES));
    return DEFAULT_WEBSITES;
  }
  return JSON.parse(stored);
}

export function saveWebsites(websites: Website[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
}

export function addWebsite(website: Omit<Website, 'id' | 'addedAt'>): Website {
  const websites = getWebsites();
  const newSite: Website = {
    ...website,
    id: Date.now().toString(),
    addedAt: new Date().toISOString(),
  };
  saveWebsites([...websites, newSite]);
  return newSite;
}

export function removeWebsite(id: string): void {
  const websites = getWebsites();
  saveWebsites(websites.filter(w => w.id !== id));
}

export function updateWebsite(id: string, updates: Partial<Website>): void {
  const websites = getWebsites();
  saveWebsites(websites.map(w => w.id === id ? { ...w, ...updates } : w));
}
