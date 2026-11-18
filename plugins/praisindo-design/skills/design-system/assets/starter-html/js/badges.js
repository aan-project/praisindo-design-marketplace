// The central badge map (rules BD-02, BD-03, BD-13, GN-03): for every value a badge shows, its intent (colour); the badge has no icon (BD-02, owner 2026-11-18). ONE map for the whole app; no page keeps a map of its own, and no page writes the tooltip by hand.
// A badge explains itself on hover and tap: "<what it is> is <label>" (Status is Active). A new status, category or level is added to BADGE_MAP (and the `bdg.d.<domain>` key), never to a page.
// A label that is only a number, a name or a value the user chose is not a badge (BD-10). Every badge has a tooltip (BD-13, 2.95): with no information it repeats the full label.
import { fill, t } from './shell.js';
import { esc } from './ui.js';

export const BADGE_MAP = {
  status: { draft: 'neutral', pending: 'warning', in_progress: 'purple', active: 'success', completed: 'success', failed: 'danger', expired: 'danger', inactive: 'neutral', new: 'info' },
  priority: { high: 'danger', medium: 'warning', low: 'neutral' },
  confidence: { high: 'success', medium: 'warning', low: 'danger' },
};
/** { intent, domain, value } of a value of the map (an unknown value is neutral). */
export function badgeProps(domain, value) { return { intent: BADGE_MAP[domain]?.[value] ?? 'neutral', domain, value }; }
/** The sentence of the tooltip: `tip` as given, else "<domain name> is <label>" from `what` or the domain; with no information the label itself. */
export function badgeTip({ label, domain, what, tip }) { if (tip) return tip; const w = what ?? (domain ? t('bdg.d.' + domain) : ''); return w ? fill(t('bdg.is'), { what: w, value: label }) : label; }
/** Badge markup. `domain` + `value` (or `what` / `tip`) make the tooltip; `intent` comes from the map unless given. */
export function badge({ label, domain, value, what, tip, intent }) {
  const p = domain ? badgeProps(domain, value) : { intent: intent ?? 'neutral' }, sentence = badgeTip({ label, domain, what, tip });
  const b = `<span class="bdg t-soft i-${intent ?? p.intent} bdg-u"><span class="bdg-t">${esc(label)}</span></span>`;
  return `<span class="tt-wrap">${b}<div role="tooltip" class="tt tt-text tt-top tt-np"><div class="tt-d">${esc(sentence)}</div></div></span>`;
}
