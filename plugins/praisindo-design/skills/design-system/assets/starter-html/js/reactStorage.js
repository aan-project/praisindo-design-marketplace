// The ONLY module allowed to touch Web Storage for product data (like the React starter's lib/reactStorage.ts): one namespace, JSON, try/catch. Branding and preferences have their own modules (brandStore.js, prefs.js).
const NS = 'app.';   // change to your own namespace
const area = () => { try { return window.localStorage; } catch { return null; } };
export const readJSON = (name, fallback) => { const s = area(); if (!s) return fallback; try { const raw = s.getItem(NS + name); return raw == null ? fallback : JSON.parse(raw); } catch { return fallback; } };
export const writeJSON = (name, value) => { const s = area(); if (!s) return false; try { s.setItem(NS + name, JSON.stringify(value)); return true; } catch { return false; } };
