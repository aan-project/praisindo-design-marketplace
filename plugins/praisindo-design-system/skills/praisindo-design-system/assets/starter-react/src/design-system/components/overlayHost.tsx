import type { ReactElement } from 'react';
import { createPortal } from 'react-dom';

/** Overlays render into #overlay (like the prototype); without that host (static markup in tests) they stay inline. */
export function toOverlay(node: ReactElement): ReactElement {
  const host = typeof document !== 'undefined' ? document.getElementById('overlay') : null;
  return host ? createPortal(node, host) : node;
}
