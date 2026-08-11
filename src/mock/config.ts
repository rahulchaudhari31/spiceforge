// src/mock/config.ts
// Demo mode detection. When VITE_DEMO_MODE is "true" (or unset), the app runs
// fully offline against an in-browser mock API. Set VITE_DEMO_MODE=false to
// use the real Laravel backend instead.

export const isDemoMode = (): boolean => {
  const mode = import.meta.env.VITE_DEMO_MODE;
  if (mode === undefined || mode === '') {
    return true;
  }
  return mode === 'true' || mode === '1';
};

export const DEMO_MODE = isDemoMode();

export const DEMO_BASE_URL = '/api';
