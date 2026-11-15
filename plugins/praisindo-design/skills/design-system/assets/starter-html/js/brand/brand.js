// Branding draft (prototype ADMF / admInit / admHexErr / admDraft / lgUpload checks / the patch that admSave hands to setBrand). Pure.
import { contrastW, validHex } from '../tokens/colorEngine.js';
import { BDEF } from '../tokens/palette.js';
export const ADMF = ['Figtree', 'Inter', 'Plus Jakarta Sans', 'Poppins', 'Roboto'];
export const SAMPLE_LOGO = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="#0056b3"/><path d="M14 30l8-12 6 8 6-10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
export const LSLOT = { logoL: 'lg.t.light', logoD: 'lg.t.dark', fav: 'lg.t.fav' };
/** prototype admInit: the draft starts from the saved brand. */
export const draftOf = (b) => ({
    name: b.appName, primary: b.primary, secondary: b.secondary, logoL: b.logoLight || '', logoD: b.logoDark || '', fav: b.favicon || '',
    font: b.font || 'Figtree', fw: String(b.fontWeight ?? 400), dmode: b.defaultMode, dlang: b.defaultLang, pmode: 'light', nameErr: false,
});
/** i18n key of the colour error, or ''. The primary colour also needs a contrast of at least 3 against white. */
export const admHexErr = (A, k) => !validHex(A[k]) ? 'adm.errColor' : (k === 'primary' && contrastW(A[k]) < 3) ? 'adm.errContrast' : '';
/** prototype admDraft: what the live preview is built from (an invalid colour falls back to the saved one). */
export const admDraft = (A, b) => ({ ...BDEF, primary: validHex(A.primary) ? A.primary : b.primary, secondary: validHex(A.secondary) ? A.secondary : b.secondary, font: A.font, fontWeight: Number(A.fw) || 400 });
/** prototype admSave validation: a name and two valid colours. */
export const draftInvalid = (A) => !A.name.trim() || !!admHexErr(A, 'primary') || !!admHexErr(A, 'secondary');
/** The patch admSave passes to setBrand. */
export const draftPatch = (A) => ({
    appName: A.name.trim(), primary: A.primary, secondary: A.secondary, font: A.font, fontWeight: Number(A.fw) || 400, logoLight: A.logoL, logoDark: A.logoD, favicon: A.fav, defaultMode: A.dmode, defaultLang: A.dlang,
});
/** prototype lgUpload checks: allowed extension (the favicon also takes .ico) and at most 1 MB. */
export function logoCheck(slot, fileName, size) {
    const ext = (fileName.split('.').pop() || '').toLowerCase(), ok = slot === 'fav' ? ['png', 'svg', 'webp', 'ico'] : ['png', 'svg', 'webp'];
    if (!ok.includes(ext))
        return 'adm.ftype';
    if (size > 1048576)
        return 'adm.fsize';
    return '';
}
