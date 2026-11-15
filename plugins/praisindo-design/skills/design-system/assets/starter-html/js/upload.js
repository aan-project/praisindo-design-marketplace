// File upload (rules UP-01 to UP-04, the same as the React `FileUpload`). Markup and classes are the design system's (css/45-form-kit.css): a `.ffd` field with the drop box `.fdz`, a hidden `input[type=file]` and the list `ul.fdl`.
//   initUploads()  -> call once at boot; it is delegated, so markup drawn later works too.
// Each file is checked against its rules: over the size (`data-max` MB, 5 by default), a type that is not in `accept` (extension, MIME or family such as `image/*`; none = all) and, without `multiple`, every file after the first.
// An accepted file is a row whose ring fills around its icon (--fdl-p, 0 to 100; at once when motion is off) and turns green; a refused file is a red row with the reason; nothing is repeated under the field.
import { fill, t } from './shell.js';
import { esc, icon } from './ui.js';

const typeOk = (f, accept) => { const list = (accept || '').split(',').map((x) => x.trim().toLowerCase()).filter(Boolean); if (!list.length) return true; const n = f.name.toLowerCase(), ty = (f.type || '').toLowerCase(); return list.some((a) => (a.startsWith('.') ? n.endsWith(a) : a.endsWith('/*') ? ty.startsWith(a.slice(0, -1)) : ty === a)); };
const fileIcon = (n) => { const e = (n.split('.').pop() || '').toLowerCase(); return e === 'pdf' ? 'picture_as_pdf' : /^(xlsx?|csv)$/.test(e) ? 'table_chart' : /^(png|jpe?g|gif|webp)$/.test(e) ? 'image' : 'description'; };
const motionOn = () => document.documentElement.dataset.motion !== 'off';

function row(f, no, maxMb) {
  const why = no === 'size' ? fill(t('ff.fdBigS'), { n: maxMb }) : no === 'type' ? t('ff.fdTypeS') : no === 'one' ? t('ff.fdOneS') : `${(f.size / 1024).toFixed(0)} KB`;
  const p = no || !motionOn() ? 100 : 0;
  return `<li class="${no ? 'err' : p >= 100 ? 'ok' : ''}" style="--fdl-p:${p}" data-name="${esc(f.name)}">${icon(fileIcon(f.name))}<span>${esc(f.name)}</span><small>${esc(why)}</small>${no ? `<span class="fds">${icon('error_outline')}</span>` : p >= 100 ? `<span class="fds">${icon('check_circle_outline')}</span>` : '<span class="fdp">0%</span>'}<button type="button" aria-label="${esc(fill(t('ff.rm'), { x: f.name }))}">${icon('close')}</button></li>`;
}
function progress(li) {   // the demo progress of a new file (the real upload sets --fdl-p itself)
  let p = 0; const iv = setInterval(() => {
    p = Math.min(100, p + 8); li.style.setProperty('--fdl-p', p); const pc = li.querySelector('.fdp'); if (pc) pc.textContent = p + '%';
    if (p >= 100) { clearInterval(iv); li.classList.add('ok'); pc?.replaceWith(Object.assign(document.createElement('span'), { className: 'fds', innerHTML: icon('check_circle_outline') })); }
  }, 60);
}
function add(field, files) {
  const input = field.querySelector('input[type=file]'), list = field.querySelector('.fdl'), maxMb = +field.dataset.max || 5, multiple = input.multiple, accept = input.getAttribute('accept') || '';
  list.querySelectorAll('li.err').forEach((l) => l.remove());   // a new choice clears the refusals of the one before
  let kept = list.querySelectorAll('li').length; const html = [], fresh = [];
  for (const f of files) {
    const no = f.size > maxMb * 1048576 ? 'size' : !typeOk(f, accept) ? 'type' : !multiple && kept >= 1 ? 'one' : '';
    if (!no) kept++;
    html.push(row(f, no, maxMb)); if (!no) fresh.push(f.name);
  }
  list.insertAdjacentHTML('beforeend', html.join(''));
  if (motionOn()) [...list.querySelectorAll('li')].filter((l) => fresh.includes(l.dataset.name) && !l.classList.contains('ok') && !l.classList.contains('err')).forEach(progress);
}
export function initUploads() {
  document.addEventListener('change', (e) => { const i = e.target.closest?.('.ffd input[type=file]'); if (i) { add(i.closest('.ffd'), [...i.files]); i.value = ''; } });
  document.addEventListener('click', (e) => {
    const b = e.target.closest?.('.ffd .fdz .btn'); if (b) { b.closest('.ffd').querySelector('input[type=file]').click(); return; }
    const x = e.target.closest?.('.ffd .fdl li button'); if (x) x.closest('li').remove();
  });
  document.addEventListener('dragover', (e) => { const z = e.target.closest?.('.ffd .fdz'); if (z) { e.preventDefault(); z.classList.add('over'); } });
  document.addEventListener('dragleave', (e) => { e.target.closest?.('.ffd .fdz')?.classList.remove('over'); });
  document.addEventListener('drop', (e) => { const z = e.target.closest?.('.ffd .fdz'); if (z) { e.preventDefault(); z.classList.remove('over'); add(z.closest('.ffd'), [...e.dataTransfer.files]); } });
}
