// The central badge map (rules BD-02, BD-03, BD-13, GN-03): for every value a badge shows, its intent (colour) and its icon. ONE map for the whole app; no page keeps a map of its own, and no page writes the tooltip by hand.
// A badge explains itself on hover and tap: "<what it is> is <label>" (Status is Active). A new status, category or level is added to BADGE_MAP (and the `bdg.d.<domain>` key), never to a page.
// A label that is only a number, a name or a value the user chose is not a badge (BD-10) and gets no tooltip.
import { fill, t } from './shell.js';
import { esc } from './ui.js';

export const BADGE_MAP = {
  status: { draft: ['neutral', 'edit_note'], pending: ['warning', 'schedule'], in_progress: ['purple', 'autorenew'], active: ['success', 'check_circle'], completed: ['success', 'task_alt'], failed: ['danger', 'error_outline'], expired: ['danger', 'event_busy'], inactive: ['neutral', 'block'], new: ['info', 'local_fire_department'] },
  priority: { high: ['danger', 'keyboard_double_arrow_up'], medium: ['warning', 'drag_handle'], low: ['neutral', 'keyboard_arrow_down'] },
  confidence: { high: ['success', 'check_circle'], medium: ['warning', 'error_outline'], low: ['danger', 'help_outline'] },
};
/** { intent, icon, domain, value } of a value of the map (an unknown value is neutral with the info icon). */
export function badgeProps(domain, value) { const s = BADGE_MAP[domain]?.[value] ?? ['neutral', 'info']; return { intent: s[0], icon: s[1], domain, value }; }
/** The sentence of the tooltip: `tip` as given, else "<domain name> is <label>" from `what` or the domain; nothing when there is no information. */
export function badgeTip({ label, domain, what, tip }) { if (tip) return tip; const w = what ?? (domain ? t('bdg.d.' + domain) : ''); return w ? fill(t('bdg.is'), { what: w, value: label }) : ''; }
/** Badge markup. `domain` + `value` (or `what` / `tip`) make the tooltip; `intent` and `icon` come from the map unless given. */
export function badge({ label, domain, value, what, tip, intent, icon: ic }) {
  const p = domain ? badgeProps(domain, value) : { intent: intent ?? 'neutral', icon: ic ?? 'info' }, sentence = badgeTip({ label, domain, what, tip });
  const b = `<span class="bdg t-soft i-${intent ?? p.intent} bdg-u"><span class="material-icons-outlined ic" data-ic="${esc(ic ?? p.icon)}" aria-hidden="true"></span><span class="bdg-t">${esc(label)}</span></span>`;
  return sentence ? `<span class="tt-wrap">${b}<div role="tooltip" class="tt tt-text tt-top tt-np"><div class="tt-d">${esc(sentence)}</div></div></span>` : b;
}
