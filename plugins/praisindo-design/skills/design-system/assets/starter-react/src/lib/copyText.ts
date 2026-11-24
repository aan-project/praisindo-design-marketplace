/** Clipboard copy with a fallback (hidden textarea + execCommand) for a page that is not a secure context. Resolves to whether it worked. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* fall through to the textarea route */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    const r = document.execCommand('copy');
    ta.remove();
    return r;
  } catch { return false; }
}
