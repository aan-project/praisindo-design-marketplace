// Saves a file the way the prototype's saveBlob does: a temporary object URL and a click on a hidden link. Harmless where the browser APIs are missing (tests).
export function saveBlob(blob: Blob, file: string): void {
  try {
    const u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = file; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 4000);
  } catch { /* no object URLs here */ }
}
