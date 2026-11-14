// The Design System page (mandatory in every application). The sections are the design system itself, generated from the React starter (pages/design.en.html / design.id.html: live markup of every
// component with the real classes, so it follows the current theme, font size and brand). This file adds the behaviour: contents list, scroll-spy, search, copyable swatches, a few demo toggles.
// A project's OWN components are added to the "This project" section (docs/design-system/new-components.md) and never to the standard sections.
import { state, t, lang } from '../shell.js';
import { drawer, esc, toast, watchDetailLists } from '../ui.js';

const cache = {};
async function load(l) { return cache[l] || (cache[l] = fetch(new URL(`../../pages/design.${l}.html`, import.meta.url)).then((r) => r.text())); }
const terms = (q) => String(q || '').trim().toLowerCase().split(/\s+/).filter(Boolean);   // the words of the search in the change history
let stopSpy = () => {};

export async function renderDesign(main) {
  stopSpy();
  main.innerHTML = '';
  const html = await load(lang());
  if (state.page.route !== 'design') return;
  main.innerHTML = html;
  const root = main.querySelector('.ds');
  watchDetailLists(root);   // the Detail list demo with layout auto (rule DL-02)
  // the page was captured with the starter's colours: refresh the hex of every swatch from the live tokens (brand, theme)
  const live = getComputedStyle(document.documentElement);
  root.querySelectorAll('button.dssw').forEach((b) => {
    const name = b.querySelector('.fw6')?.textContent, hexEl = b.querySelector('.mut'), v = name ? live.getPropertyValue('--color-' + name).trim().toLowerCase() : '';
    if (v && hexEl && /^#[0-9a-f]{6}$/.test(v)) { const old = hexEl.textContent; hexEl.textContent = v; b.title = b.title.replace(old, v); b.setAttribute('aria-label', (b.getAttribute('aria-label') || '').replace(old, v)); }
  });
  const secs = [...root.querySelectorAll('section.dss')], toc = [...root.querySelectorAll('.dstoc button[data-id]')];
  const isId = lang() === 'id', B = (en, id) => (isId ? id : en);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROOM = 76, LOCK_MS = 900;   // the small hero (60px) can be on screen when a click scrolls up (rule DS-15)
  let lock = 0;
  const mark = (id) => toc.forEach((b) => { const on = b.dataset.id === id; b.classList.toggle('on', on); if (on) b.setAttribute('aria-current', 'location'); else b.removeAttribute('aria-current'); });
  /** Scrolls to the page `id`; the spy is silent while the scroll runs. The address names the page (#/design/<id>) without a new history entry. */
  const scrollTo = (id, smooth) => {
    lock = Date.now() + LOCK_MS; mark(id);
    setTimeout(() => dispatchEvent(new Event('scroll')), LOCK_MS + 50);   // run the spy once when the lock ends
    const el = document.getElementById('ds-' + id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - ROOM - (document.querySelector('.topbar')?.offsetHeight ?? 0), behavior: smooth && !reduced() ? 'smooth' : 'auto' });
  };
  const go = (id, smooth = true) => { history.replaceState(null, '', '#/design/' + id); state.page = { ...state.page, arg: id }; scrollTo(id, smooth); };
  root.addEventListener('click', (e) => {
    const b = e.target.closest('.dstoc button[data-id]');
    if (b) { go(b.dataset.id); return; }
    if (e.target.closest('.dstop')) { window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }); root.querySelector('#dsq')?.focus({ preventScroll: true }); return; }
    const sw = e.target.closest('button[title^="Copy"], button[title^="Salin"]');
    if (sw) {
      const m = /#[0-9a-f]{6}/i.exec(sw.title);
      if (m) navigator.clipboard?.writeText(m[0]).then(() => toast(t('ds.copied').replace('{h}', m[0])), () => toast(t('ds.copyFail').replace('{h}', m[0]), 'danger'));
      return;
    }
    const seg = e.target.closest('.sgc-o');
    if (seg && !seg.disabled) {
      const g = seg.closest('.sgc'), all = [...g.querySelectorAll('.sgc-o')];
      g.style.setProperty('--seg-to', all.indexOf(seg));
      all.forEach((o) => { const on = o === seg; o.classList.toggle('on', on); o.setAttribute('aria-checked', String(on)); });
    }
  });
  // the page in view: the last one whose top passed the small hero (at the bottom of the page, the last one)
  const spy = () => {
    if (Date.now() < lock) return;
    let cur = 0; const tops = secs.map((s) => s.getBoundingClientRect().top);
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = secs.length - 1; else tops.forEach((y, i) => { if (y - 140 <= 0) cur = i; });
    if (secs[cur]) mark(secs[cur].dataset.ds);
  };
  // the large hero in the flow, or the small one fixed at the top: shown when scrolling up, hidden when scrolling down (rule DS-15)
  const wrap = root.querySelector('.dshero-wrap'), hero = root.querySelector('.dshero'), topBtn = root.querySelector('.dstop');
  let lastY = scrollY, acc = 0;
  const place = () => {
    if (!wrap || !hero) return;
    const r = wrap.getBoundingClientRect(), dy = scrollY - lastY;
    root.style.setProperty('--hero-l', `${Math.round(r.left)}px`); root.style.setProperty('--hero-w', `${Math.round(r.width)}px`);
    acc = Math.sign(dy) === Math.sign(acc) ? acc + dy : dy;
    const cls = r.bottom > 0 ? 'top' : acc <= -48 ? 'mini' : acc >= 8 ? 'hide' : (hero.classList.contains('top') ? 'hide' : hero.classList.contains('mini') ? 'mini' : 'hide');
    if (r.bottom > 0) acc = 0;
    hero.classList.remove('top', 'hide', 'mini'); hero.classList.add(cls);
    lastY = scrollY;
  };
  // one read per frame (never in every scroll event): reading the geometry of every section on each event forces a layout and makes the scroll stutter
  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; spy(); place(); topBtn?.classList.toggle('on', scrollY > 600); }); };
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', place);
  stopSpy = () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', place); if (raf) cancelAnimationFrame(raf); };
  spy(); place();
  // the address names a page: open the page there (an unknown id opens the first page)
  const first = toc[0]?.dataset.id, want = state.page.arg;
  if (want) setTimeout(() => go(toc.some((b) => b.dataset.id === want) ? want : first, false), 0);   // not requestAnimationFrame: a hidden tab never runs it

  // ---- search (rules DS-22 and DS-27): the pages by name or alias, then the names of the code (components, classes, tokens) read from the page itself ----
  const q = root.querySelector('#dsq'), box = root.querySelector('.dsq'), main2 = root.querySelector('#dsmain');
  const norm = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const pages = toc.map((b) => ({ id: b.dataset.id, g: b.dataset.g, name: b.textContent, alt: b.dataset.alt || '', alias: (b.dataset.alias || '').split('|').filter(Boolean), kind: b.closest('.dsn-l')?.previousElementSibling?.classList.contains('dsn-s') ? b.closest('.dsn-l').previousElementSibling.textContent : (b.closest('.dsn')?.querySelector('.dsn-t')?.textContent ?? '') }));
  const searchPages = (text) => {
    const n = norm(text), out = []; if (!n) return out;
    for (const p of pages) {
      let s = -1, alias;
      for (const nm of [norm(p.name), norm(p.alt)]) { if (nm === n) s = Math.max(s, 100); else if (nm.startsWith(n)) s = Math.max(s, 80); else if (nm.split(' ').some((w) => w.startsWith(n))) s = Math.max(s, 60); else if (nm.includes(n)) s = Math.max(s, 40); }
      if (s < 0) for (const a of p.alias) { const na = norm(a); if (na === n) { s = 30; alias = a; break; } if (na.startsWith(n) || na.split(' ').some((w) => w.startsWith(n))) { s = Math.max(s, 20); alias = a; } else if (na.includes(n)) { s = Math.max(s, 10); alias = a; } }
      if (s >= 0) out.push({ p, alias, s });
    }
    return out.sort((a, b) => b.s - a.s);
  };
  const tokenPage = (name) => {
    const n = name.replace(/^--/, '');
    if (/^color-|^int-/.test(n)) return 'colors'; if (/^(fs|lh|ls|ff|fw)(-|$)/.test(n)) return 'type'; if (/^(r|page-pad)(-|$)/.test(n)) return 'space'; if (/^(dur|ease)(-|$)/.test(n)) return 'motion';
    if (/^card-gap/.test(n)) return 'card'; if (/^drawer-pad/.test(n)) return 'drawer'; if (/^dlg-/.test(n)) return 'modal'; if (/^(tbl-|frozen-)/.test(n)) return 'table'; if (/^seg-/.test(n)) return 'segmented';
    if (/^ring-/.test(n)) return 'widgets'; if (/^tt-/.test(n)) return 'tooltip'; if (/^kb-/.test(n)) return 'kanban'; return 'colors';
  };
  let idx = null;
  const buildIndex = () => {
    const classes = new Map(), comps = new Map(), tokens = new Set(), DOC = /^(ds|dss$|dsx$|dsl$|dsv$)/;
    const bump = (m, name, page) => { const p = m.get(name) ?? m.set(name, new Map()).get(name); p.set(page, (p.get(page) ?? 0) + 1); };
    for (const s of secs) {
      const id = s.dataset.ds, body = s.querySelector('.cb'); if (!body) continue;
      body.querySelectorAll('*').forEach((el) => { for (const c of el.classList) if (c.length > 1 && !DOC.test(c)) bump(classes, c, id); });
      body.querySelectorAll('.dsx > .dsl').forEach((l) => { const tx = l.textContent ?? '', tail = tx.includes(' · ') ? tx.slice(tx.lastIndexOf(' · ') + 3) : ''; for (const m of tail.matchAll(/\b([A-Z][A-Za-z0-9]{2,})\b/g)) bump(comps, m[1], id); });
      body.querySelectorAll('.dsapi tbody td:first-child').forEach((td) => { const m = /^\s*([A-Z][A-Za-z0-9]{2,})\b/.exec(td.textContent ?? ''); if (m) bump(comps, m[1], id); });
    }
    const walk = (rules) => { for (const r of rules ?? []) { const st = r.style; if (st) for (let i = 0; i < st.length; i++) if (st.item(i).startsWith('--')) tokens.add(st.item(i)); walk(r.cssRules); } };
    for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch { /* a sheet of another origin */ } }
    document.querySelectorAll('style').forEach((st) => { for (const m of (st.textContent ?? '').matchAll(/(?<![\w-])(--[a-z][\w-]*)\s*:/g)) tokens.add(m[1]); });
    return { classes, comps, tokens: [...tokens].sort() };
  };
  const rank = (name, n) => { const x = name.toLowerCase().replace(/^(\.|--)/, ''); return x === n ? 0 : x.startsWith(n) ? 1 : x.includes(n) ? 2 : -1; };
  const bestPage = (m) => [...m].sort((a, b) => b[1] - a[1])[0][0];
  const byRank = (a, b) => a.rank - b.rank || b.pages - a.pages || a.name.length - b.name.length || (a.name < b.name ? -1 : 1);
  const searchCode = (text) => {
    const n = text.trim().toLowerCase().replace(/^(\.|--)/, ''); if (n.length < 2) return { comp: [], class: [], token: [] };
    idx ||= buildIndex();
    const from = (m, kind) => { const o = []; for (const [name, pg] of m) { const r = rank(name, n); if (r >= 0) o.push({ kind, name, page: bestPage(pg), pages: pg.size, rank: r }); } return o.sort(byRank); };
    const token = []; for (const name of idx.tokens) { const r = rank(name, n); if (r >= 0) token.push({ kind: 'token', name, page: tokenPage(name), pages: 1, rank: r }); }
    return { comp: from(idx.comps, 'comp'), class: from(idx.classes, 'class'), token: token.sort(byRank) };
  };
  const nameOf = (id) => pages.find((p) => p.id === id)?.name ?? id;
  const mk = (name, text) => { const t2 = text.trim().toLowerCase().replace(/^(\.|--)/, ''), i = t2 ? name.toLowerCase().indexOf(t2) : -1; return i < 0 ? esc(name) : `${esc(name.slice(0, i))}<mark>${esc(name.slice(i, i + t2.length))}</mark>${esc(name.slice(i + t2.length))}`; };
  let rows = [], act = 0, shown = false;
  const pick = (h) => {
    const id = h.kind === 'page' ? h.p.id : h.page; clearBox(); go(id);
    if (h.kind === 'page' || h.kind === 'token') return;
    setTimeout(() => {   // the example that uses the class or names the component is shown (after the scroll to its page)
      const card = document.getElementById('ds-' + id); let t2 = null;
      if (card && h.kind === 'class') t2 = card.querySelector('.cb .' + CSS.escape(h.name));
      else if (card) t2 = [...card.querySelectorAll('.dsx')].find((x) => new RegExp('\\b' + h.name + '\\b').test(x.querySelector('.dsl')?.textContent ?? '')) ?? [...card.querySelectorAll('.dsapi tbody tr')].find((r) => new RegExp('^\\s*' + h.name + '\\b').test(r.querySelector('td')?.textContent ?? ''));
      if (!t2) return; t2.scrollIntoView?.({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' }); t2.classList.add('ds-hit'); setTimeout(() => t2.classList.remove('ds-hit'), 2400);
    }, LOCK_MS);
  };
  const noneCard = () => {
    let n = root.querySelector('#dsnone');
    if (!n) { n = document.createElement('div'); n.className = 'card dsnone'; n.id = 'dsnone'; n.style.display = 'flex';
      n.innerHTML = `<div class="state s-md"><span class="material-icons-outlined ic" aria-hidden="true">search_off</span><h3>${esc(B('No matching page', 'Tidak ada halaman yang cocok'))}</h3><p class="mut">${esc(B('Try another name, for example button, badge, table or color.', 'Coba nama lain, misalnya tombol, badge, tabel, atau warna.'))}</p></div><div style="display:flex;justify-content:center;padding:0 0 20px"><button type="button" class="btn b-outlined i-neutral s-md" data-clear>${esc(B('Clear search', 'Hapus pencarian'))}</button></div>`;
      main2.prepend(n); n.querySelector('[data-clear]').addEventListener('click', () => clearBox()); }
    return n;
  };
  function clearBox() { q.value = ''; rows = []; shown = false; box.querySelector('#dsres')?.remove(); root.querySelector('#dsnone')?.remove(); q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant'); box.querySelector('[data-dsclear]')?.remove(); }
  const paint = () => {
    box.querySelector('#dsres')?.remove(); root.querySelector('#dsnone')?.remove();
    const text = q.value; rows = [];
    if (!text.trim()) { q.setAttribute('aria-expanded', 'false'); return; }
    const pg = searchPages(text), code = searchCode(text);
    rows = [...pg.map((h) => ({ kind: 'page', ...h })), ...code.comp, ...code.class, ...code.token];
    if (!rows.length) { noneCard(); q.setAttribute('aria-expanded', 'false'); return; }
    act = Math.min(act, rows.length - 1);
    let i = 0;
    const G = (title, list, row) => (list.length ? `<li role="presentation" class="dsrg"><span>${esc(title)}</span><span class="n">${list.length}</span></li>${list.map(row).join('')}` : '');
    const opt = (kind, icon, body, h) => { const k = i++; h.__i = k; return `<li id="dsr-${k}" role="option" aria-selected="${k === act}" data-kind="${kind}" data-i="${k}" class="dsro k-${kind}"><span class="dsri"><span class="material-icons-outlined ic" aria-hidden="true">${icon}</span></span><span class="dsrb">${body}</span></li>`; };
    const where = (h) => (h.pages > 1 ? B(`on the page ${nameOf(h.page)}, and ${h.pages - 1} more`, `di halaman ${nameOf(h.page)}, dan ${h.pages - 1} lainnya`) : B(`on the page ${nameOf(h.page)}`, `di halaman ${nameOf(h.page)}`));
    const code2 = (h, nm, label) => `<code class="nm">${mk(nm, text)}</code><span class="pr">${esc(label)}</span>`;
    const pageRows = rows.filter((r) => r.kind === 'page');
    const html = G(B('Pages', 'Halaman'), pageRows, (h) => opt('page', 'description', `<span class="nm">${mk(h.p.name, text)}</span><span class="pr">${esc(h.p.kind + (h.alias ? ' · alias: ' + h.alias : ''))}</span>`, h))
      + G(B('Components in the code', 'Komponen di kode'), code.comp, (h) => opt('comp', 'widgets', code2(h, h.name, where(h)), h))
      + G(B('Classes', 'Class'), code.class, (h) => opt('class', 'code', code2(h, '.' + h.name, where(h)), h))
      + G(B('Tokens', 'Token'), code.token, (h) => opt('token', 'palette', code2(h, h.name, B('on the page ', 'di halaman ') + nameOf(h.page)), h));
    const ul = document.createElement('ul'); ul.className = 'dsres'; ul.id = 'dsres'; ul.setAttribute('role', 'listbox'); ul.setAttribute('aria-label', B('Search results', 'Hasil pencarian')); ul.innerHTML = html;
    ul.addEventListener('mousedown', (e) => { const li = e.target.closest('.dsro'); if (li) { e.preventDefault(); pick(rows[Number(li.dataset.i)]); } });
    box.appendChild(ul); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', 'dsres'); q.setAttribute('aria-activedescendant', `dsr-${act}`);
  };
  if (q && box) {
    q.setAttribute('placeholder', B('Search pages, classes, tokens', 'Cari halaman, class, token'));
    q.addEventListener('input', () => { act = 0; shown = true; paint(); });
    q.addEventListener('focus', () => { if (q.value.trim()) paint(); });
    q.addEventListener('blur', () => { box.querySelector('#dsres')?.remove(); q.setAttribute('aria-expanded', 'false'); });
    q.addEventListener('keydown', (e) => {
      const ul = box.querySelector('#dsres');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { if (!rows.length) return; e.preventDefault(); act = (act + (e.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length; if (!ul) paint(); else { ul.querySelectorAll('.dsro').forEach((li) => li.setAttribute('aria-selected', String(Number(li.dataset.i) === act))); q.setAttribute('aria-activedescendant', `dsr-${act}`); document.getElementById('dsr-' + act)?.scrollIntoView({ block: 'nearest' }); } }
      else if (e.key === 'Enter') { const h = rows[act] ?? rows[0]; if (h) { e.preventDefault(); pick(h); } }
      else if (e.key === 'Escape') { e.preventDefault(); if (ul) { ul.remove(); q.setAttribute('aria-expanded', 'false'); } else if (q.value) clearBox(); }
    });
  }
  // "What's new": the version, the newest entry and the full history come from docs/design-system/changelog.md (the static page only holds a copy of the frame)
  const logSec = root.querySelector('#ds-changes');
  if (logSec) fetch(new URL('../../docs/design-system/changelog.md', import.meta.url)).then((r) => (r.ok ? r.text() : '')).then((md) => {
    const cmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] ?? 0) - (y[i] ?? 0); if (d) return d; } return 0; };
    const rows = [...md.matchAll(/^- \*\*([\d.]+)\*\* \((\d{4}-\d{2}-\d{2})\) (.+)$/gm)].map((m) => ({ v: m[1], d: m[2], text: m[3] })).sort((a, b) => cmp(b.v, a.v));
    if (!rows.length) return;
    const top = rows[0], isId = lang() === 'id';
    const dfmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString(isId ? 'id-ID' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const rowHtml = (r) => `<div><span class="chp chp-s${r.v === top.v ? ' on' : ''}">v${esc(r.v)}</span><span>${esc(r.text)}</span></div>`;
    const lead = logSec.querySelector('.dslead'), list = logSec.querySelector('.dslog'), more = logSec.querySelector('.dslog-more button');
    if (lead) lead.textContent = (isId ? `Versi ${top.v} · diperbarui ${dfmt(top.d)}. Dokumentasi ini diperbarui bersamaan dengan setiap perubahan komponen, token, atau aturan.` : `Version ${top.v} · updated ${dfmt(top.d)}. This documentation is updated together with every change to a component, token or rule.`);
    if (list) list.innerHTML = rowHtml(top);
    if (!more) return;
    if (rows.length < 2) { more.parentElement.style.display = 'none'; return; }
    const chip = more.querySelector('.chp'); if (chip) chip.textContent = String(rows.length);
    more.setAttribute('aria-label', `${isId ? 'Lihat semua' : 'View all'} (${rows.length})`);
    more.addEventListener('click', () => {
      const ph = isId ? 'Cari perubahan atau versi, mis. "toast" atau "1.2"' : 'Search changes or a version, e.g. "toast" or "1.2"';
      const dr = drawer({ title: isId ? 'Yang baru — riwayat lengkap' : "What's new — full history", size: 'md', closeLabel: t('take.close') || 'Close',
        bodyHtml: `<div class="dslogq"><div class="fld"><div class="inp s-md"><span class="material-icons-outlined ic" aria-hidden="true">search</span><input id="dslogq" type="search" autocomplete="off" placeholder="${esc(ph)}" aria-label="${esc(ph)}" aria-controls="dsloglist" /></div></div><p class="mut" id="dslogcount" aria-live="polite"></p></div><div id="dsloglist" class="dslog"></div><p class="mut" id="dslognone" style="display:none">${isId ? 'Tidak ada perubahan yang cocok.' : 'No changes match.'}</p>` });
      const input = dr.el.querySelector('#dslogq'), box = dr.el.querySelector('#dsloglist'), count = dr.el.querySelector('#dslogcount'), none = dr.el.querySelector('#dslognone');
      const paint = () => {
        const w = terms(input.value), hit = rows.filter((r) => w.every((x) => `v${r.v} ${r.text}`.toLowerCase().includes(x)));
        box.innerHTML = hit.map(rowHtml).join(''); none.style.display = w.length && !hit.length ? '' : 'none';
        count.textContent = w.length ? (isId ? `${hit.length} dari ${rows.length} perubahan cocok` : `${hit.length} of ${rows.length} changes match`) : (isId ? `${rows.length} perubahan · versi ${top.v} · diperbarui ${dfmt(top.d)}` : `${rows.length} changes · version ${top.v} · updated ${dfmt(top.d)}`);
      };
      input.addEventListener('input', paint); paint();
    });
  }).catch(() => {});
  // "This project": the log of new components (docs/design-system/new-components.md) is the source of truth; its headings are listed here
  const proj = root.querySelector('#ds-project .cb');
  if (proj) fetch(new URL('../../docs/design-system/new-components.md', import.meta.url)).then((r) => r.text()).then((md) => {
    const names = [...md.matchAll(/^### (.+?) \(/gm)].map((m) => m[1]);
    if (names.length) { const ul = document.createElement('ul'); ul.className = 'dsrules'; names.forEach((n) => { const li = document.createElement('li'); li.textContent = n; ul.appendChild(li); }); proj.appendChild(ul); }
  }).catch(() => {});
}
