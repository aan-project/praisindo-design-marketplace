// The text of the hover tooltip of a Badge (rule BD-13, owner decision 2026-10-30): what the badge is for, e.g. "Status is Active", "Risk profile is Moderate".
// A badge of a domain of the central map says "<domain name> is <label>" (keys `bdg.d.<domain>`, template `bdg.is`); a fixed single-value badge has its own sentence (`bdg.fx.<key>`);
// a badge outside the map passes `what` (the name of what it shows) or `tip` (the whole sentence). No information, no tooltip.
import { fill } from '../i18n/fill';
import type { BadgeDomain } from './badgeIcons';

export interface BadgeTipInput { label: string; domain?: BadgeDomain; value?: string; what?: string; tip?: string }

export function badgeTip(t: (key: string) => string, p: BadgeTipInput): string {
  if (p.tip) return p.tip;
  if (p.domain === 'fixed' && p.value) { const k = 'bdg.fx.' + p.value, s = t(k); if (s !== k) return s; }
  const what = p.what ?? (p.domain && p.domain !== 'fixed' ? t('bdg.d.' + p.domain) : '');
  return what ? fill(t('bdg.is'), { what, value: p.label }) : '';
}
