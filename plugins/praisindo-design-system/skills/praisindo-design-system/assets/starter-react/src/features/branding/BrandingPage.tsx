// The `branding` route (Admin, mandatory in every application; rules BR-01..BR-08). The draft lives in the page; Save goes through the branding adapter (a real save, see references/branding.md)
// and the saved brand is applied app-wide by PrefsProvider. Logos are uploaded through the adapter when a file is chosen; the draft keeps their URLs until Save.
import { useCallback, useEffect, useRef, useState } from 'react';
import { brandAdapter, usePrefs } from '../../app/providers/PrefsProvider';
import { useSession } from '../../app/session';
import { useToast } from '../../app/providers/ToastProvider';
import { loadFont } from '../../branding/brandStore';
import { draftInvalid, draftOf, draftPatch, logoCheck, SAMPLE_LOGO, type BrandDraft, type LogoSlot } from '../../branding/brand';
import { BDEF } from '../../design-system/tokens/palette';
import { BrandingHead, BrandingView, LogoDrawer, type DraftAlert } from './BrandingView';

interface LogoState { slot: LogoSlot; err: string; up: boolean; staged: string | undefined; name: string }
const SLOT = { logoL: 'logoLight', logoD: 'logoDark', fav: 'favicon' } as const;

export function BrandingPage() {
  const { t, brand, saveBrand, resetBrand } = usePrefs(), { sess } = useSession(), { toast } = useToast();
  const [A, setA] = useState<BrandDraft>(() => draftOf(brand)), [alert, setAlert] = useState<DraftAlert | null>(null), [busy, setBusy] = useState(false), [lg, setLg] = useState<LogoState | null>(null);
  const live = useRef({ A, lg }); live.current = { A, lg };
  const alive = useRef(true); useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { setA(draftOf(brand)); }, [brand.appName]);   // the brand arrived from the server after the first render
  useEffect(() => { const close = () => setLg(null); window.addEventListener('hashchange', close); return () => window.removeEventListener('hashchange', close); }, []);
  const canEdit = sess.admin;
  const text = (k: 'name' | 'primary' | 'secondary', v: string) => setA((a) => ({ ...a, [k]: v, nameErr: k === 'name' && v.trim() ? false : a.nameErr }));

  const save = useCallback(async () => {
    const d = live.current.A;
    setAlert(null); setA((a) => ({ ...a, nameErr: !d.name.trim() }));
    if (draftInvalid(d)) { setAlert({ i: 'danger', m: 'adm.fixErr' }); return; }
    setBusy(true);
    const p = draftPatch(d), r = await saveBrand({ ...brand, ...p } as typeof brand);
    if (!alive.current) return;
    setBusy(false);
    if (!r.ok) { setAlert({ i: 'danger', m: r.error === 'contrast' ? 'adm.errContrast' : 'adm.savefail', retry: r.error !== 'contrast' }); return; }
    toast(t('adm.saved'));
  }, [brand, saveBrand, toast, t]);

  const reset = async () => { if (!canEdit) return; await resetBrand(); setA(draftOf(BDEF)); setAlert(null); toast(t('adm.saved')); };
  const font = (v: string) => { setA((a) => ({ ...a, font: v })); setAlert(null); loadFont(document, v); };

  const onFile = async (f: File) => {
    const l = live.current.lg; if (!l) return;
    const bad = logoCheck(l.slot, f.name, f.size);
    if (bad) { setLg({ ...l, err: bad }); return; }
    setLg({ ...l, err: '', up: true });
    try {
      const url = await brandAdapter.uploadLogo(SLOT[l.slot], f);
      if (alive.current) setLg((x) => (x ? { ...x, up: false, staged: url, name: f.name } : x));
    } catch (e) { if (alive.current) setLg((x) => (x ? { ...x, up: false, err: e instanceof Error && e.message === 'adm.fsize' ? 'adm.fsize' : 'adm.upfail' } : x)); }
  };
  const apply = () => { if (lg && lg.staged !== undefined) { const k = lg.slot, v = lg.staged; setA((a) => ({ ...a, [k]: v })); } setLg(null); };

  return (
    <>
      <BrandingHead />
      <BrandingView A={A} brand={brand} alert={alert} busy={busy} canEdit={canEdit} onText={text} onFont={font} onFw={(v) => setA((a) => ({ ...a, fw: v }))} onDmode={(v) => setA((a) => ({ ...a, dmode: v }))} onDlang={(v) => setA((a) => ({ ...a, dlang: v }))} onPmode={(v) => setA((a) => ({ ...a, pmode: v }))}
        onLogo={(slot) => setLg({ slot, err: '', up: false, staged: undefined, name: '' })} onReset={reset} onSave={save} onRetry={save} />
      {lg ? <LogoDrawer slot={lg.slot} cur={A[lg.slot]} staged={lg.staged} name={lg.name} err={lg.err} up={lg.up} hasPending={false}
        onChoose={() => document.getElementById('lg-file')?.click()} onFile={onFile} onSample={() => setLg({ ...lg, err: '', staged: SAMPLE_LOGO, name: 'sample-logo.svg' })}
        onRemove={() => setLg({ ...lg, staged: '', err: '', name: '' })} onRetry={() => undefined} onApply={apply} onClose={() => setLg(null)} /> : null}
    </>);
}
