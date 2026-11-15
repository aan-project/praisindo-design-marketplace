// The `branding` route (Admin, mandatory in every application; rules BR-01..BR-08). The draft lives in the page; Save goes through the branding adapter (a REAL save, see references/branding.md);
// the saved brand is applied app-wide by app.js. Logos are uploaded through the adapter when a file is chosen; the draft keeps their URLs until Save.
import { state, t, session, restricted } from '../shell.js';
import { adapter } from '../brand/adapter.js';
import { admDraft, admHexErr, ADMF, draftInvalid, draftOf, draftPatch, logoCheck, LSLOT, SAMPLE_LOGO } from '../brand/brand.js';
import { brandError, loadFont, normalizeBrand } from '../brand/brandStore.js';
import { buildTokens } from '../tokens/buildTokens.js';
import { validHex } from '../tokens/colorEngine.js';
import { BDEF } from '../tokens/palette.js';
import { button, card, drawer, esc, icon, pageHead, toast } from '../ui.js';
import { select, syncSelects } from '../select.js';
import { richSelect, setRich } from '../richselect.js';
import { tooltip } from '../tooltip.js';

const FW = [300, 400, 500, 600];   // the default weight of the text (FW-01): 300 Light, 400 Regular, 500 Medium, 600 Semibold
const SLOT = { logoL: 'logoLight', logoD: 'logoDark', fav: 'favicon' };
const badge = (label, intent, ic) => `<span class="bdg t-soft i-${intent} bdg-u"><span class="material-icons-outlined ic" data-ic="${esc(ic)}" aria-hidden="true"></span><span class="bdg-t">${esc(label)}</span></span>`;

export function renderBranding(main, { onSaved }) {
  const brand = state.brand;
  main.innerHTML = pageHead([['#/home', t('nav.home')], ['#/branding', t('nav.branding')]], t('nav.branding'), t('adm.sub'));
  if (!session.admin) { main.innerHTML = restricted(); return; }
  let A = draftOf(brand), busy = false, alertHtml = '';
  const sec = (h, inner) => `<div class="sec"><h3 class="grpt">${esc(t(h))}</h3><div style="display:flex;flex-direction:column;gap:16px">${inner}</div></div>`;
  const input = (id, label, hint = '') => `<div class="fld"><label for="${id}">${esc(label)}<span class="req" aria-hidden="true">*</span><span class="sr-only"> (${esc(t('ui.required'))})</span>${hint ? tooltip({ text: hint, label: hint }) : ''}</label><div class="inp s-md"><input id="${id}" type="text" aria-required="true" spellcheck="false" autocomplete="off">${id === 'adm-name' ? '' : '<span class="csw" data-sw aria-hidden="true"></span>'}</div><span class="hlp" id="${id}-err" role="alert" hidden></span></div>`;
  const lrow = (k, lab) => `<div class="lrow" data-row="${k}"><div class="th"${k === 'logoD' ? ' data-theme="dark"' : ''}></div><div style="flex:1;min-width:0"><span class="fw6">${esc(t(lab))}</span><div class="mut" data-state></div></div>${button({ label: t('adm.manage'), icon: 'upload', type: 'outlined', intent: 'neutral', size: 'sm', attrs: `data-logo="${k}"` })}</div>`;
  const sel = (id, label, opts, hint = '') => select({ id, label, opts, hint, val: opts[0]?.[0] });
  const form = `<div style="display:flex;flex-direction:column;gap:24px"><div id="adm-alert"></div>
    ${sec('adm.sec.brand', input('adm-name', t('adm.name')) + input('adm-primary', t('adm.color'), t('adm.colorH')) + input('adm-secondary', t('adm.secondary')) + lrow('logoL', 'adm.logoL') + lrow('logoD', 'adm.logoD') + lrow('fav', 'adm.fav') + `<p class="mut adm-lnote" id="adm-lnote"></p>`)}
    ${sec('adm.sec.type', sel('adm-font', t('adm.fontFam'), ADMF.map((f) => [f, f])) + richSelect({ id: 'adm-fw', label: t('adm.fontW'), hint: t('adm.fontWH'), opts: FW.map((w) => ({ v: String(w), label: String(w), soft: t('adm.fw.' + w) })), val: '400' }))}
    ${sec('adm.sec.theme', sel('adm-dmode', t('adm.dmode'), [['light', t('prefs.light')], ['dark', t('prefs.dark')]], t('adm.dmodeH')))}
    ${sec('adm.sec.lang', sel('adm-dlang', t('adm.dlang'), [['en', 'English'], ['id', 'Bahasa Indonesia']], t('adm.dlangH')))}</div>`;
  const foot = `${button({ label: t('adm.reset'), type: 'outlined', intent: 'neutral', id: 'adm-reset' })}${button({ label: t('adm.save'), id: 'adm-save' })}`;
  main.insertAdjacentHTML('beforeend', `<div style="display:flex;flex-direction:column;gap:16px"><div class="admg">${card(t('adm.brandT'), form, foot)}${card(t('adm.pv.t'), `<p class="mut">${esc(t('adm.pv.d'))}</p><div id="bpwrap" style="display:flex;flex-direction:column;gap:12px"></div>`)}</div>
    <section class="card"><div class="ch"><h2>${esc(t('dsc.title'))}</h2></div><div class="cb"><p class="mut">${esc(t('adm.global'))}</p></div></section></div>`);
  const $ = (s) => main.querySelector(s);
  const bars = [34, 52, 41, 68, 57, 80].map((h, i) => `<rect x="${10 + i * 34}" y="${96 - h}" width="22" height="${h}" rx="3" fill="var(--color-surface-brand-default)"/>`).join('');
  function preview() {
    const dk = A.pmode === 'dark', lg = (dk && A.logoD) || A.logoL, nm = A.name || '—', full = !!lg, hi = badge(t('adm.pv.hi'), 'danger', 'keyboard_double_arrow_up'), md = badge(t('adm.pv.md'), 'warning', 'drag_handle');
    $('#bpwrap').innerHTML = `<style id="bpcss">${buildTokens(admDraft(A, brand), '.bp')}</style><div class="rw">${button({ label: t('adm.pv.light'), type: A.pmode === 'light' ? 'soft' : 'outlined', intent: A.pmode === 'light' ? 'brand' : 'neutral', size: 'sm', attrs: 'data-pm="light"' })}${button({ label: t('adm.pv.dark'), type: dk ? 'soft' : 'outlined', intent: dk ? 'brand' : 'neutral', size: 'sm', attrs: 'data-pm="dark"' })}</div>
      <div class="bp" data-theme="${A.pmode}"><div class="bp-app"><aside class="bp-sb"><div class="bp-brand${full ? ' full' : ''}">${lg ? `<img src="${esc(lg)}" alt="${full ? esc(nm) : ''}">` : `<span class="mono" style="width:24px;height:24px">${esc(nm.charAt(0).toUpperCase())}</span>`}${full ? '' : `<span class="bp-name">${esc(nm)}</span>`}</div><div class="bp-nav on">${esc(t('adm.pv.nav1'))}</div><div class="bp-nav">${esc(t('adm.pv.nav2'))}</div><div class="bp-nav">${esc(t('adm.pv.nav3'))}</div></aside>
      <div><header class="bp-hd"><span class="fw6">${esc(t('adm.pv.page'))}</span><span class="av">AW</span></header><div class="bp-body"><div class="rw"><span class="btn b-fill i-brand s-md">${esc(t('adm.pv.btn1'))}</span><span class="btn b-fill i-secondary s-md">${esc(t('adm.pv.btn2'))}</span><span class="btn b-outlined i-neutral s-md">${esc(t('adm.pv.btn3'))}</span></div>
      <div class="inp s-md"><input placeholder="${esc(t('adm.pv.inp'))}" tabindex="-1" aria-hidden="true"></div><div class="rw">${badge(t('adm.pv.st1'), 'success', 'check_circle')}${badge(t('adm.pv.st2'), 'info', 'local_fire_department')}${hi}${md}</div>
      <div class="bp-card"><table><thead><tr><th>${esc(t('adm.pv.th1'))}</th><th>${esc(t('adm.pv.th2'))}</th><th>${esc(t('adm.pv.th3'))}</th></tr></thead><tbody><tr><td>Alex Morgan</td><td>${hi}</td><td>${badge(t('adm.pv.st1'), 'success', 'check_circle')}</td></tr><tr><td>Sam Rivera</td><td>${md}</td><td>${badge(t('adm.pv.st2'), 'info', 'local_fire_department')}</td></tr></tbody></table></div>
      <div class="bp-card"><span class="fw6">${esc(t('adm.pv.chart'))}</span><svg viewBox="0 0 220 100" width="100%" height="100" role="img" aria-label="${esc(t('adm.pv.chart'))}">${bars}<polyline fill="none" stroke="var(--color-surface-secondary-default)" stroke-width="3" points="21,70 55,56 89,62 123,36 157,44 191,18"/></svg></div></div></div></div></div>`;
  }
  function refresh() {
    for (const [k, id] of [['primary', 'adm-primary'], ['secondary', 'adm-secondary']]) {
      const e = admHexErr(A, k), el = $('#' + id + '-err'); el.hidden = !e; el.textContent = e ? t(e) : '';
      $('#' + id).closest('.inp').classList.toggle('err', !!e); $('#' + id).setAttribute('aria-invalid', String(!!e)); const sw = $('#' + id).parentElement.querySelector('[data-sw]'); sw.style.background = validHex(A[k]) ? A[k] : '';
    }
    const ne = $('#adm-name-err'); ne.hidden = !A.nameErr; ne.textContent = A.nameErr ? t('adm.errName') : ''; $('#adm-name').closest('.inp').classList.toggle('err', A.nameErr);
    for (const k of ['logoL', 'logoD', 'fav']) {
      const row = $(`[data-row="${k}"]`), v = A[k]; row.querySelector('.th').innerHTML = v ? `<img src="${esc(v)}" alt="">` : icon(k === 'fav' ? 'tab' : 'image');
      row.querySelector('[data-state]').textContent = v ? t('adm.set') : t('adm.none'); row.querySelector('[data-logo]').innerHTML = `${icon('upload')}${esc(v ? t('adm.replace') : t('adm.manage'))}`;
    }
    $('#adm-lnote').textContent = t('adm.logoNote') + (A.logoL && !A.fav ? ' ' + t('adm.favTip') : '');
    $('#adm-save').disabled = busy; $('#adm-save').textContent = busy ? t('adm.saving') : t('adm.save'); preview();
    $('#adm-alert').innerHTML = alertHtml;
  }
  const alert = (m, intent = 'danger') => { alertHtml = `<div class="al i-${intent}" role="alert">${icon(intent === 'danger' ? 'error_outline' : 'warning_amber')}<span>${esc(t(m))}</span></div>`; };
  $('#adm-name').value = A.name; $('#adm-primary').value = A.primary; $('#adm-secondary').value = A.secondary; $('#adm-font').value = A.font; $('#adm-dlang').value = A.dlang; $('#adm-dmode').value = A.dmode; setRich(main, 'adm-fw', A.fw); syncSelects(main); refresh();
  main.addEventListener('input', (e) => {
    const m = { 'adm-name': 'name', 'adm-primary': 'primary', 'adm-secondary': 'secondary' }[e.target.id]; if (!m) return;
    A = { ...A, [m]: e.target.value, nameErr: m === 'name' && e.target.value.trim() ? false : A.nameErr }; refresh();
  });
  main.addEventListener('change', (e) => { if (e.target.id === 'adm-font') { A = { ...A, font: e.target.value }; alertHtml = ''; loadFont(document, A.font); refresh(); } if (e.target.id === 'adm-dlang') { A = { ...A, dlang: e.target.value }; refresh(); } if (e.target.id === 'adm-dmode') { A = { ...A, dmode: e.target.value }; refresh(); } });
  main.addEventListener('richchange', (e) => { if (e.detail.id === 'adm-fw') { A = { ...A, fw: e.detail.value }; refresh(); } });
  main.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.pm) { A = { ...A, pmode: b.dataset.pm }; refresh(); }
    else if (b.dataset.logo) logoDrawer(b.dataset.logo);
    else if (b.id === 'adm-reset') { await save({ ...BDEF }, true); A = draftOf(BDEF); main.querySelector('#adm-name').value = A.name; main.querySelector('#adm-primary').value = A.primary; main.querySelector('#adm-secondary').value = A.secondary; main.querySelector('#adm-font').value = A.font; main.querySelector('#adm-dlang').value = A.dlang; main.querySelector('#adm-dmode').value = A.dmode; setRich(main, 'adm-fw', A.fw); syncSelects(main); refresh(); }
    else if (b.id === 'adm-save') {
      A = { ...A, nameErr: !A.name.trim() }; alertHtml = '';
      if (draftInvalid(A)) { alert('adm.fixErr'); refresh(); return; }
      busy = true; refresh(); await save({ ...brand, ...draftPatch(A) });
    }
  });
  async function save(b) {
    const n = normalizeBrand(b), err = brandError(n);
    try {
      if (err) { alert(err === 'contrast' ? 'adm.errContrast' : 'adm.fixErr'); return; }
      const saved = normalizeBrand(await adapter().saveBrand(n)); alertHtml = ''; onSaved(saved); toast(t('adm.saved'));
    } catch { alert('adm.savefail'); } finally { busy = false; refresh(); }
  }
  function logoDrawer(slot) {
    let staged, name = '', err = '', up = false;
    const fav = slot === 'fav', cur = () => (staged !== undefined ? staged : A[slot]);
    const body = () => `<div class="al i-info" role="alert">${icon('info')}<span>${esc(t('lg.note'))}</span></div><div class="sec"><span class="fw6">${esc(t('lg.cur'))}</span><div class="bp-prev"${slot === 'logoD' ? ' data-theme="dark"' : ''}>${cur() ? `<img src="${esc(cur())}" alt="">` : `<span>${esc(t('lg.none'))}</span>`}</div><span class="mut">${esc(up ? t('adm.uploading') : staged === '' ? t('lg.removed') : staged !== undefined ? t('lg.staged') + (name ? ' · ' + name : '') : '')}</span></div>${err ? `<div role="alert"><div class="al i-danger">${icon('error_outline')}<span>${esc(t(err))}</span></div></div>` : ''}<div class="sec"><div class="rw"><input type="file" id="lg-file" hidden accept="${fav ? '.png,.svg,.webp,.ico,image/x-icon' : '.png,.svg,.webp,image/png,image/svg+xml,image/webp'}">${button({ label: cur() ? t('lg.replace') : t('lg.choose'), icon: 'upload', type: 'outlined', intent: 'neutral', attrs: `data-choose${up ? ' disabled' : ''}` })}${button({ label: t('adm.sample'), type: 'link', attrs: 'data-sample' })}${button({ label: t('lg.remove'), icon: 'delete_outline', type: 'transparent', intent: 'danger', attrs: `data-remove${up || !cur() ? ' disabled' : ''}` })}</div><span class="mut">${esc(t(fav ? 'lg.hintF' : 'lg.hint'))}</span></div>`;
    const footer = () => `${button({ label: t('fnd.cancel'), type: 'transparent', intent: 'neutral', attrs: 'data-cancel' })}${button({ label: t('lg.apply'), attrs: `data-apply${up || staged === undefined ? ' disabled' : ''}` })}`;
    const d = drawer({ title: t(LSLOT[slot]), bodyHtml: body(), footerHtml: footer(), closeLabel: t('lg.close') });
    const paint = () => { d.el.querySelector('.db').innerHTML = body(); d.el.querySelector('.df').innerHTML = footer(); };
    d.el.addEventListener('click', async (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-choose')) d.el.querySelector('#lg-file').click();
      else if (b.hasAttribute('data-sample')) { staged = SAMPLE_LOGO; name = 'sample-logo.svg'; err = ''; paint(); }
      else if (b.hasAttribute('data-remove')) { staged = ''; name = ''; err = ''; paint(); }
      else if (b.hasAttribute('data-cancel')) d.close();
      else if (b.hasAttribute('data-apply')) { if (staged !== undefined) A = { ...A, [slot]: staged }; d.close(); refresh(); }
    });
    d.el.addEventListener('change', async (e) => {
      const f = e.target.files?.[0]; if (!f) return; const bad = logoCheck(slot, f.name, f.size);
      if (bad) { err = bad; paint(); return; }
      err = ''; up = true; paint();
      try { staged = await adapter().uploadLogo(SLOT[slot], f); name = f.name; } catch (x) { err = x && x.message === 'adm.fsize' ? 'adm.fsize' : 'adm.upfail'; }
      up = false; paint();
    });
  }
}
