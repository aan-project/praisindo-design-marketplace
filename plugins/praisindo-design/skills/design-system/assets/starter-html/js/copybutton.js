// CopyButton (rule CB-01): the icon button that copies a value the user has to carry somewhere else (a password, a one-time code, a phone or WhatsApp number, an email, an account or virtual-account number, an amount, an ID).
// It sits right after the value (the value stays readable text). One click copies `value`, the icon is a check for two seconds and a toast says that the value was copied; when the browser refuses, the toast says so (danger).
// Use: `${esc(value)} ${copyButton({ value, label: t('cp.pw') })}`. The click is handled once for the whole page.
import { esc, icon, toast } from './ui.js';
import { fill, t } from './shell.js';

/** Clipboard copy with a fallback (hidden textarea + execCommand) for a page that is not a secure context. Resolves to whether it worked. */
export async function copyText(text) {
  try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; } } catch { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch { return false; }
}
/** An icon-only link Button (type link, intent neutral). `label` names the value ("password"); `size` is sm (inline after a text) or md (a field-size line). */
export const copyButton = ({ value, label, size = 'sm' }) => {
  const name = fill(t('cp.aria'), { n: label });
  return `<button type="button" class="btn b-link i-neutral s-${size} io" data-copy="${esc(value)}" data-copy-label="${esc(label)}" aria-label="${esc(name)}" title="${esc(name)}">${icon('content_copy')}</button>`;
};
const timers = new WeakMap();
document.addEventListener('click', (e) => {
  const b = e.target.closest?.('[data-copy]'); if (!b) return;
  copyText(b.dataset.copy).then((ok) => {
    if (!ok) { toast(t('cp.fail'), 'danger'); return; }
    const ic = b.querySelector('.ic'); if (ic) ic.textContent = 'check';
    toast(fill(t('cp.done'), { n: b.dataset.copyLabel }));
    clearTimeout(timers.get(b)); timers.set(b, setTimeout(() => { if (ic) ic.textContent = 'content_copy'; }, 2000));
  });
});
