// Ported from the prototype: buildTokens(b, scope). The only change is that the prototype's
// global `prefs.fs` is an explicit parameter (`fs`, default 'regular'), so the function stays pure.
import { A, BDEF, CY, DK, DK_INTENT, FS, G, IB, N, PU, R, type Brand, type DkIntentToken, type Ramp } from './palette.ts';
import { darkIntent, ramp } from './colorEngine.ts';

export type FontSize = 'small' | 'regular' | 'large';

export function buildTokens(b: Brand = BDEF, scope: string = ':root', fs: FontSize | string = 'regular'): string {
  const L: Record<string, string> = {}, D: Record<string, string> = {};
  const set = (k: string, l: string, d?: string): void => { L[k] = l; D[k] = d === undefined ? l : d; };
  set('color-background-neutral-page', N[50], DK.page); set('color-background-neutral-default', N[0], DK.card);
  set('color-surface-neutral-primary', N[0], DK.card); set('color-surface-neutral-secondary', '#f7f7f7', DK.raised); set('color-surface-neutral-tertiary', N[300], DK.line);
  set('color-text-primary', N[900], DK.text); set('color-text-faint', N[300], DK.s1); set('color-text-muted', N[400], DK.s2); set('color-text-tertiary', N[500], DK.s3); set('color-text-secondary', N[600], DK.s4);
  set('color-text-white', '#ffffff'); set('color-text-black', '#121212', DK.card);
  set('color-surface-static-white', '#ffffff');   /* a surface that stays white in dark mode: the box of a logo that is a JPG on white (rule PD-07) */
  set('color-border-neutral-subtle', N[100], DK.lineS); set('color-border-neutral-default', N[200], DK.line); set('color-border-neutral-strong', N[300], DK.lineX);
  set('color-scrim', 'rgba(0,0,0,.45)', 'rgba(0,0,0,.65)');
  const IN: Record<string, Ramp> = { brand: ramp(b.primary), secondary: ramp(b.secondary || '#7e57c2'), danger: R, success: G, warning: A, info: IB, purple: PU, cyan: CY };
  let cls = '';
  Object.keys(IN).forEach((x) => {
    const P = IN[x], w = x === 'warning';
    set(`color-surface-${x}-subtle-1`, P[50], (x === 'danger' || x === 'warning') && P[950] ? P[950] : P[900]);
    set(`color-surface-${x}-default`, w ? P[600] : P[500]);
    set(`color-surface-${x}-strong-1`, P[700], w ? P[500] : P[300]);
    set(`color-surface-${x}-strong-2`, P[900], P[50]);
    set(`color-foreground-${x}-default`, P[500]);
    set(`color-foreground-${x}-strong`, x === 'cyan' ? P[900] : P[700], P[100]);
    set(`color-border-${x}-subtle`, P[50], P[900]);
    set(`color-border-${x}-default`, P[200], P[700]);
    set(`color-border-${x}-strong`, P[500]);
    // Dark intent tokens: values written in palette.ts (DK_INTENT) are used verbatim; every other dark intent token is derived by the contrast engine (darkIntent: text >= 4.5:1 on the dark card,
    // fill >= 4.5:1 against white for the intents that carry white text). Owner decision 2026-10-23 (rule CL-01, revised in 1.72): the light ramp slots are NOT manual dark values.
    {
      const base = x === 'warning' ? P[600] : P[500];
      const dk = darkIntent(base, ['brand', 'secondary', 'danger', 'info', 'purple'].includes(x));
      D[`color-surface-${x}-subtle-1`] = dk.sub; D[`color-surface-${x}-default`] = dk.fill; D[`color-foreground-${x}-default`] = dk.fg; D[`color-foreground-${x}-strong`] = dk.strong;
      D[`color-border-${x}-subtle`] = dk.bSub; D[`color-border-${x}-default`] = dk.bDef; D[`color-border-${x}-strong`] = dk.fg;
      const manual = DK_INTENT[x] ?? {};
      for (const k of Object.keys(manual) as DkIntentToken[]) { const v = manual[k]; if (v) D[`color-${k.split('-')[0]}-${x}-${k.split('-').slice(1).join('-')}`] = v; }
    }
    cls += `.i-${x}{--int-def:var(--color-surface-${x}-default);--int-hov:var(--color-surface-${x}-strong-1);--int-prs:var(--color-surface-${x}-strong-2);--int-sub:var(--color-surface-${x}-subtle-1);--int-fg:var(--color-foreground-${x}-strong);--int-bd:var(--color-border-${x}-default);--int-on:var(--color-text-${w ? 'black' : 'white'})}`;
  });
  cls += '.i-neutral{--int-def:var(--color-surface-neutral-tertiary);--int-hov:var(--color-border-neutral-strong);--int-prs:var(--color-border-neutral-strong);--int-sub:var(--color-surface-neutral-secondary);--int-fg:var(--color-text-secondary);--int-bd:var(--color-border-neutral-default);--int-on:var(--color-text-primary)}';
  const dump = (o: Record<string, string>): string => Object.keys(o).map((k) => `--${k}:${o[k]};`).join('');
  const f = (FS as Record<string, (typeof FS)['regular']>)[fs] || FS.regular;
  const font = `'${b.font}','Figtree',system-ui,sans-serif`;
  // rule TH-12: the 2% letter-spacing of the body (--ls, 01-base.css) belongs to Figtree; any other brand font is set without it (the output for Figtree is unchanged)
  // html:root outranks the :root of the stylesheet, which a lazily loaded chunk may insert after these tokens
  const other = (b.font || 'Figtree') !== 'Figtree', ls = other ? 'html:root{--ls:0}' : '', lsScope = other ? ';--ls:0;letter-spacing:0' : '';
  // the default weight (DS 2.71, 2.72): every font-weight of the style files is `calc(N + var(--fw-shift,0))`; the output for 400 is unchanged
  const fw = b.fontWeight && b.fontWeight !== 400 ? `;--fw-shift:${b.fontWeight - 400}` : '';
  return scope !== ':root'
    ? `${scope}{${dump(L)}--ff:${font}${fw}${lsScope}}${scope}[data-theme="dark"]{${dump(D)}}`
    : `:root{${dump(L)}--ff:${font}${fw};--fs-xs:${f.xs}px;--fs-sm:${f.sm}px;--fs-md:${f.md}px;--fs-lg:${f.lg}px;--fs-h-xl:${f.h1}px;--fs-h-lg:${f.h2}px;--fs-h-md:${f.h3}px;--fs-h-sm:${f.h4}px}[data-theme="dark"]{${dump(D)}}${cls}${ls}`;
}
