// userName() and the profile card (rules GN-04, UN-01, PC-01..PC-03): wherever the name of a USER of the application is shown, this is the name. It is the trigger of the profile card: it opens on hover after a short delay, on keyboard
// focus and on tap, closes with Escape or a tap outside, and keeps the focus on the trigger. No text decoration, the font of the text around it. A name that is not in the directory stays plain text. Never print a bare user name from a record.
import { productRows, profileProduct, profileRows, profileSide, profileUser } from './profile.config.js';
import { fill, t } from './shell.js';
import { esc } from './ui.js';

const HOVER_IN = 250, HOVER_OUT = 150;
const initials = (n) => String(n || '?').split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
/** The name as the trigger of the card (markup). `name` is escaped. */
export function userName(name) {
  const u = profileUser(name); if (!u) return esc(name);
  return `<span role="button" class="pcx-t" aria-haspopup="dialog" aria-expanded="false" aria-label="${esc(fill(t('pc.open'), { n: name }))}" data-user="${esc(name)}" tabindex="0">${esc(name)}</span>`;
}
/** The name or label of a product as the trigger of the product card (rule UN-03, markup). `name` is escaped. Not in the catalogue: plain text. */
export function productName(name) {
  const p = profileProduct(name); if (!p) return esc(name);
  return `<span role="button" class="pcx-t" aria-haspopup="dialog" aria-expanded="false" aria-label="${esc(fill(t('pc.popen'), { n: p.name }))}" data-product="${esc(p.name)}" tabindex="0">${esc(p.name)}</span>`;
}
const bodyP = (p, id) => `<div class="pcx" role="dialog" aria-modal="false" id="${id}" aria-label="${esc(fill(t('pc.pcard'), { n: p.name }))}"><span class="pcx-f pcx-xl" aria-hidden="true"><span class="plg plg-lg plg-fb" role="img" aria-label="${esc(p.issuer)}">${esc(initials(p.issuer))}</span></span><div class="pcx-n"><span class="fw6">${esc(p.name)}</span><span class="mut">${esc(p.category)}</span></div><dl class="pcx-r">${productRows(p, t).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>${p.href ? `<a class="btn b-soft i-neutral s-md pcx-act" href="${esc(p.href)}">${esc(t('pc.pview'))}</a>` : ''}</div>`;
const sideHtml = (side) => `<section class="pcx-sd" aria-label="${esc(side.title)}"><h3 class="pcx-sh">${esc(side.title)}</h3><ul class="pcx-si">${side.items.map((it) => `<li><div class="pcx-ih"><span class="hp-ic i-brand" aria-hidden="true"><span class="ic">${esc(it.icon)}</span></span><span><span class="fw6">${esc(it.title)}</span>${it.sub ? `<span class="mut">${esc(it.sub)}</span>` : ''}</span></div><dl class="pcx-r pcx-ri">${it.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></li>`).join('')}</ul></section>`;
/** The card of a user (rule PC-06: with `profileSide` it has two columns, the facts on the left and a list of items on the right). */
const body = (u, id) => {
  const side = profileSide(u, t), inner = `<span class="hav pcx-f pcx-xl" aria-hidden="true">${esc(initials(u.name))}</span><div class="pcx-n"><span class="fw6">${esc(u.name)}</span><span class="mut">${esc(u.position)}</span></div><dl class="pcx-r">${profileRows(u, t).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
  return `<div class="pcx${side ? ' pcx-2' : ''}" role="dialog" aria-modal="false" id="${id}" aria-label="${esc(fill(t('pc.card'), { n: u.name }))}">${side ? `<div class="pcx-m">${inner}</div>${sideHtml(side)}` : inner}</div>`;
};
let layer = null, owner = null, timer = 0, ptr = 'mouse';
const cancel = () => { clearTimeout(timer); timer = 0; };
const later = (fn, ms) => { cancel(); timer = setTimeout(fn, ms); };
function close() { cancel(); layer?.remove(); layer = null; owner?.setAttribute('aria-expanded', 'false'); owner = null; }
function openCard(trig) {
  cancel(); if (owner === trig) return; close();
  const prod = trig.dataset.product ? profileProduct(trig.dataset.product) : null, u = prod ?? profileUser(trig.dataset.user); if (!u) return;
  const id = 'pcx' + Math.random().toString(36).slice(2, 7);
  layer = document.createElement('div'); layer.className = 'pcx-w'; layer.innerHTML = prod ? bodyP(prod, id) : body(u, id); document.body.appendChild(layer);
  owner = trig; trig.setAttribute('aria-expanded', 'true'); trig.setAttribute('aria-controls', id);
  const r = trig.getBoundingClientRect(), w = layer.offsetWidth, h = layer.offsetHeight, left = Math.max(8, Math.min(r.left, innerWidth - 8 - w)), top = r.bottom + 8 + h > innerHeight ? Math.max(8, r.top - h - 8) : r.bottom + 8;
  layer.style.left = left + 'px'; layer.style.top = top + 'px'; layer.setAttribute('data-ready', '');
  layer.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') cancel(); }); layer.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') later(close, HOVER_OUT); });
}
let ready = false;
/** Call once at boot: it is delegated, so a name drawn later works too. */
export function initProfileCards() {
  if (ready) return; ready = true;
  const trig = (e) => e.target.closest?.('.pcx-t');
  addEventListener('hashchange', close);   // the card never outlives its page
  document.addEventListener('pointerdown', (e) => { ptr = e.pointerType; if (layer && !layer.contains(e.target) && !trig(e)) close(); }, true);
  document.addEventListener('pointerover', (e) => { const b = trig(e); if (b && e.pointerType === 'mouse') later(() => openCard(b), HOVER_IN); });
  document.addEventListener('pointerout', (e) => { const b = trig(e); if (b && e.pointerType === 'mouse') later(close, HOVER_OUT); });
  document.addEventListener('focusin', (e) => { const b = trig(e); if (b && ptr === 'mouse' && b.matches(':focus-visible')) later(() => openCard(b), HOVER_IN); });
  document.addEventListener('focusout', (e) => { if (trig(e)) later(close, HOVER_OUT); });
  document.addEventListener('click', (e) => { const b = trig(e); if (!b) return; if ((ptr === 'touch' || ptr === 'pen') && owner === b) close(); else openCard(b); ptr = 'mouse'; });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && layer) { e.stopPropagation(); const o = owner; close(); o?.focus({ preventScroll: true }); return; }
    const b = trig(e); if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); b.click(); }
  }, true);
}
