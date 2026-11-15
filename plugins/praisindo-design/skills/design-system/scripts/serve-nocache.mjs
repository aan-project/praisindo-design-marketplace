#!/usr/bin/env node
// Static file server that never caches (python's http.server caches ES modules, so an edited starter keeps showing the OLD code).
//   node scripts/serve-nocache.mjs [port] [dir]      default: 8123 and the current folder
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const port = Number(process.argv[2] || 8123), root = resolve(process.argv[3] || '.');
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (p.endsWith('/')) p += 'index.html';
    const f = join(root, p); if (!f.startsWith(root)) throw new Error('outside');
    const b = await readFile(f); res.writeHead(200, { 'content-type': T[extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(b);
  } catch { res.writeHead(404, { 'cache-control': 'no-store' }); res.end('not found'); }
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} at http://127.0.0.1:${port} (no cache)`));
