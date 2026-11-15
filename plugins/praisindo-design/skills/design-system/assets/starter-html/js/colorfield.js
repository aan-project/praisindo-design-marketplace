// Colour field (rule FM-18, the same as the React `Input format="color"`): a hex colour typed with or without the pound sign; the pound is added by itself, what is not a hex digit is dropped, at most six digits; the swatch (.csw) at the end of the field shows a valid colour.
//   initColorFields()  -> call once at boot; it is delegated (capture phase, so a page handler of the same input already sees the normalised value), the markup is `.inp > input` followed by `.csw`.
const norm = (raw) => { const d = String(raw).replace(/[^0-9a-fA-F]/g, '').slice(0, 6); return d ? '#' + d : ''; };
const valid = (h) => /^#[0-9a-f]{6}$/i.test(h);
export function initColorFields() {
  document.addEventListener('input', (e) => {
    const i = e.target; if (!(i instanceof HTMLInputElement)) return;
    const sw = i.parentElement?.querySelector(':scope > .csw'); if (!sw) return;
    const n = norm(i.value); if (i.value !== n) i.value = n;
    sw.style.background = valid(n) ? n : '';
  }, true);
}
