// The REAL Branding adapter: the HTTP contract of references/branding.md. Use it instead of `localAdapter` in app/providers/PrefsProvider.tsx once the application has a server:
//   import { httpAdapter } from '../../../optional/adapters/brandHttp';  export const brandAdapter = httpAdapter('/api');
// Server side: GET/PUT /api/branding (JSON Brand), POST /api/branding/logo (multipart: slot, file -> { url }), DELETE /api/branding/logo/:slot. Only an administrator may write (the server decides, not the page).
import type { BrandAdapter } from '../../src/branding/brandStore';
import type { Brand } from '../../src/design-system/tokens/palette';

async function json<T>(r: Response): Promise<T> {
  if (!r.ok) throw new Error(r.status === 413 ? 'adm.fsize' : r.status === 415 ? 'adm.ftype' : 'adm.savefail');
  return (await r.json()) as T;
}
export const httpAdapter = (base = '/api', init: RequestInit = { credentials: 'same-origin' }): BrandAdapter => ({
  getBrand: () => fetch(`${base}/branding`, init).then((r) => json<Brand>(r)),
  saveBrand: (b) => fetch(`${base}/branding`, { ...init, method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then((r) => json<Brand>(r)),
  async uploadLogo(slot, file) {
    const f = new FormData(); f.append('slot', slot); f.append('file', file);
    return (await fetch(`${base}/branding/logo`, { ...init, method: 'POST', body: f }).then((r) => json<{ url: string }>(r))).url;
  },
  async removeLogo(slot) { const r = await fetch(`${base}/branding/logo/${slot}`, { ...init, method: 'DELETE' }); if (!r.ok) throw new Error('adm.savefail'); },
});
