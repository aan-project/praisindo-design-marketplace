// REFERENCE EXAMPLES (not product pages): list, form, detail and dialogs, the patterns of references/rules-tabel.md, rules-form.md, rules-kartu.md and rules-dialog.md.
// The markup is generated from the React starter (features/examples, the rule ids are listed in the header of each React file) into pages/examples/<page>.<lang>.html:
// <template data-main="..."> holds a state of the page (the form has default = vertical layout, invalid, h1 to h4 = the steps of the horizontal layout, DK-24; data-ex-main switches to a state), <template data-ov="..."> an overlay (drawer, dialog, menu) opened by the trigger marked data-ex="...".
// This module only swaps those states so that the patterns can be seen and tried; the React files are the reference for the behaviour (validation, formatting, storage).
import { logActivity } from '../activityLog.js';
import { userName } from '../profile.js';
import { lang, state, t } from '../shell.js';

const cache = {};
const load = (page, l) => cache[page + l] || (cache[page + l] = fetch(new URL(`../../pages/examples/${page}.${l}.html`, import.meta.url)).then((r) => r.text()));
let off = () => {};

function mount(main, page, html, first) {
  const doc = document.createElement('div'); doc.innerHTML = html;
  const tpl = (kind, name) => doc.querySelector(`template[data-${kind}="${name}"]`)?.innerHTML ?? '';
  let ov = null, opener = null;
  const closeOv = () => {
    if (!ov) return; const gone = ov, dw = gone.querySelector('.drawer'); ov = null;
    if (dw && document.documentElement.dataset.motion === 'on') { gone.inert = true; gone.querySelectorAll('.scrim, .drawer').forEach((n) => n.classList.add('dw-out')); dw.addEventListener('animationend', () => gone.remove(), { once: true }); setTimeout(() => gone.remove(), 600); }   // MO-10: a drawer leaves to the right
    else gone.remove();
    opener?.focus?.();
  };
  const openOv = (name, from) => {
    const h = tpl('ov', name); if (!h) return false;
    if (!ov) opener = from;
    ov?.remove(); ov = document.createElement('div'); ov.innerHTML = h; document.body.appendChild(ov);
    const pop = ov.querySelector('.pop');
    if (pop && from) {   // an action menu opens at its trigger, above it when there is no room below (rule MN-01)
      const r = from.getBoundingClientRect(), hgt = pop.offsetHeight || 160;
      pop.style.position = 'fixed'; pop.style.top = (r.bottom + 4 + hgt > innerHeight ? Math.max(8, r.top - hgt - 4) : r.bottom + 4) + 'px'; pop.style.right = (innerWidth - r.right) + 'px';
      pop.querySelector('button:not([disabled])')?.focus();
    } else (ov.querySelector('.drawer, [role="alertdialog"], .mdl') || ov.firstElementChild)?.focus?.();
    return true;
  };
  const show = (name) => { closeOv(); main.innerHTML = tpl('main', name) || tpl('main', 'default'); main.querySelectorAll('[data-user-name]').forEach((el) => { el.outerHTML = userName(el.dataset.userName); }); };   // a user name is the profile-card trigger (rule GN-04)
  show(first);

  const click = (e) => {
    const el = e.target.closest('[data-ex], button, a, .scrim'); if (!el) return;
    const mv = el.closest('[data-ex-main]');   // the layout toggle, the steps and Back / Next of the stepper form (DK-24): another state of the page
    if (mv) { e.preventDefault(); show(mv.dataset.exMain); return; }
    const sc = el.closest('[data-ex-scroll]');   // the vertical Wizard scrolls to the card of its group
    if (sc) { e.preventDefault(); document.getElementById('fs-sec-' + sc.dataset.exScroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (el.matches('[data-ex]')) { e.preventDefault(); if (!openOv(el.dataset.ex, el) && page === 'form' && el.dataset.ex === 'save') show('invalid'); else if (page === 'form' && el.dataset.ex === 'save') logActivity({ category: 'create', action: t('act.create'), targetType: t('act.supplier') }); return; }
    if (ov && ov.contains(el) && (el.matches('.scrim') || el.matches('button') && !el.closest('.dtabs, .tabs, label'))) { closeOv(); return; }
  };
  const change = (e) => {
    const box = e.target.closest('[data-ex-sel]'); if (!box || page !== 'list') return;
    const any = box.checked || [...main.querySelectorAll('td.ck input')].some((x) => x.checked);
    if (any && !main.querySelector('.bulk')) show('selected'); else if (!any) show('default');
  };
  const key = (e) => {
    if (e.key === 'Escape' && ov) { closeOv(); return; }
    const pop = ov?.querySelector('.pop'); if (!pop || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const items = [...pop.querySelectorAll('button:not([disabled])')], i = items.indexOf(document.activeElement);
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[n]?.focus(); e.preventDefault();
  };
  document.addEventListener('click', click); main.addEventListener('change', change); document.addEventListener('keydown', key);
  return () => { closeOv(); document.removeEventListener('click', click); main.removeEventListener('change', change); document.removeEventListener('keydown', key); };
}

const render = (page) => async (main) => {
  off(); off = () => {};
  const route = state.page.route, arg = state.page.arg;
  main.innerHTML = '';
  const html = await load(page, lang());
  if (state.page.route !== route) return;
  off = mount(main, page, html, page === 'list' && ['empty', 'error', 'loading'].includes(arg) ? arg : 'default');
};
export const renderExList = render('list');
export const renderExForm = render('form');
export const renderExDetail = render('detail');
export const renderExDialogs = render('dialogs');
