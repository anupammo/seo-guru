'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    let isRefreshing = false;

    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.update().catch(() => undefined);

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (isRefreshing) {
          return;
        }

        isRefreshing = true;
        window.location.reload();
      });
    }).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  }, []);

  return null;
}
