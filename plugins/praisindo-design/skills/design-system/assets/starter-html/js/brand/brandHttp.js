// The REAL Branding adapter (contract in references/branding.md). In js/app.js: `import { httpAdapter } from './brand/brandHttp.js'; setAdapter(httpAdapter('/api'));`
const json = async (r) => { if (!r.ok) throw new Error(r.status === 413 ? 'adm.fsize' : r.status === 415 ? 'adm.ftype' : 'adm.savefail'); return r.json(); };
export const httpAdapter = (base = '/api', init = { credentials: 'same-origin' }) => ({
  getBrand: () => fetch(`${base}/branding`, init).then(json),
  saveBrand: (b) => fetch(`${base}/branding`, { ...init, method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(json),
  async uploadLogo(slot, file) { const f = new FormData(); f.append('slot', slot); f.append('file', file); return (await fetch(`${base}/branding/logo`, { ...init, method: 'POST', body: f }).then(json)).url; },
  async removeLogo(slot) { const r = await fetch(`${base}/branding/logo/${slot}`, { ...init, method: 'DELETE' }); if (!r.ok) throw new Error('adm.savefail'); },
});
