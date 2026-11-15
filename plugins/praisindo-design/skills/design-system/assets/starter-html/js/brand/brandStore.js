// Brand runtime for the Praisindo Design System starter (skill v2.111.0): load / save through the branding contract, normalise, apply to the document.
// Swap `adapter` for a real HTTP implementation of the contract in references/branding.md. The localStorage adapter below is a TEMPORARY one: say so on the Branding page.
import { buildTokens } from '../tokens/buildTokens.js';
import { contrastW, validHex } from '../tokens/colorEngine.js';
import { BDEF } from '../tokens/palette.js';
export const FONTS = ['Figtree', 'Inter', 'Plus Jakarta Sans', 'Poppins', 'Roboto'];
const KEY = 'app.brand'; // use your own namespace; user preferences use other keys (rule BR-07)
/** Keep only known fields with valid values; anything wrong falls back to the default. */
export function normalizeBrand(raw) {
    const o = (raw && typeof raw === 'object' ? raw : {});
    const str = (v, d) => (typeof v === 'string' ? v : d);
    const hex = (v, d) => (typeof v === 'string' && validHex(v) ? v.toLowerCase() : d);
    return {
        appName: str(o.appName, BDEF.appName).trim() || BDEF.appName,
        primary: hex(o.primary, BDEF.primary), secondary: hex(o.secondary, BDEF.secondary),
        logoLight: str(o.logoLight, ''), logoDark: str(o.logoDark, ''), favicon: str(o.favicon, ''),
        font: FONTS.includes(str(o.font, '')) ? str(o.font, '') : BDEF.font,
        fontWeight: [300, 400, 500, 600].includes(Number(o.fontWeight)) ? Number(o.fontWeight) : 400,   // the default weight of the text (FW-01); 400 changes nothing
        defaultMode: o.defaultMode === 'dark' ? 'dark' : 'light', defaultLang: o.defaultLang === 'id' ? 'id' : 'en',
    };
}
/** Same checks as the Branding form: a name and two valid colours; the primary needs 3:1 against white. */
export function brandError(b) {
    if (!b.appName.trim())
        return 'name';
    if (!validHex(b.primary) || !validHex(b.secondary))
        return 'color';
    if (contrastW(b.primary) < 3)
        return 'contrast';
    return '';
}
/** TEMPORARY adapter (front-end only projects). Logos are data URLs, 1 MB limit. Replace with the HTTP contract when a server exists. */
export const localAdapter = {
    async getBrand() { try {
        return normalizeBrand(JSON.parse(localStorage.getItem(KEY) || '{}'));
    }
    catch {
        return { ...BDEF };
    } },
    async saveBrand(b) { const n = normalizeBrand(b); localStorage.setItem(KEY, JSON.stringify(n)); return n; },
    async uploadLogo(_slot, file) {
        if (file.size > 1048576)
            throw new Error('adm.fsize');
        return await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => rej(new Error('adm.upfail')); r.readAsDataURL(file); });
    },
    async removeLogo() { },
};
/** Synchronous read for the first paint (avoids a flash of the default colours). */
export function cachedBrand() { try {
    return normalizeBrand(JSON.parse(localStorage.getItem(KEY) || '{}'));
}
catch {
    return { ...BDEF };
} }
export const fontHref = (f) => `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`;
/** The favicon, or a generated mark from the initial of the application name. */
export function faviconHref(b) {
    if (b.favicon)
        return b.favicon;
    const ch = (b.appName.trim().charAt(0) || 'A').toUpperCase().replace(/[<&]/g, '');
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${b.primary}"/><text x="16" y="22" font-size="18" font-family="Arial" font-weight="700" text-anchor="middle" fill="#fff">${ch}</text></svg>`);
}
export function loadFont(doc, f) {
    if (!f || f === 'Figtree' || doc.getElementById('ff-' + f))
        return;
    const l = doc.createElement('link');
    l.id = 'ff-' + f;
    l.rel = 'stylesheet';
    l.href = fontHref(f);
    doc.head.appendChild(l);
}
/** Write the tokens, theme, language, title, favicon and font into the document. Call it in a layout effect, before children read CSS variables. */
export function applyBrand(doc, brand, mode, lang, fs = 'regular') {
    let tok = doc.getElementById('tok');
    if (!tok) {
        tok = doc.createElement('style');
        tok.id = 'tok';
        doc.head.appendChild(tok);
    }
    tok.textContent = buildTokens(brand, ':root', fs);
    doc.documentElement.dataset.theme = mode;
    doc.documentElement.lang = lang;
    doc.title = brand.appName;
    let ic = doc.getElementById('favl');
    if (!ic) {
        ic = doc.createElement('link');
        ic.id = 'favl';
        ic.rel = 'icon';
        doc.head.appendChild(ic);
    }
    ic.href = faviconHref(brand);
    loadFont(doc, brand.font);
}
