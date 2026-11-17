#!/usr/bin/env node
// Self-test of scripts/audit.mjs (skill design-system v2.118.0): the violation fixture must produce every pattern finding, and the starters (with the example pages) none.
// node scripts/audit-selftest.mjs   (exit 1 when a check is missing or a starter is not clean)
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const run = (dir) => { try { return JSON.parse(execFileSync('node', [join(here, 'audit.mjs'), dir, '--json'], { encoding: 'utf8' })); } catch (e) { return JSON.parse(e.stdout); } };
const PATTERN = ['FM-17', 'FM-01', 'TB-06', 'TB-03', 'TB-10', 'BT-04', 'BT-02', 'TB-09', 'CD-08', 'RN-01'];
let bad = 0;
const fx = run(join(here, 'fixtures/violations'));
for (const id of PATTERN) for (const kind of ['tsx', 'html']) {
  const hit = fx.findings.some((f) => f.rule === id && f.file.endsWith('.' + kind));
  if (!hit) { console.log(`MISSING ${id} in the ${kind} fixture`); bad++; }
}
if (!fx.findings.some((f) => f.rule === 'LD-01' && f.file.endsWith('index.html'))) { console.log('MISSING LD-01 in the index.html fixture'); bad++; }
if (!fx.findings.some((f) => f.rule === 'BD-15' && f.file.endsWith('.css'))) { console.log('MISSING BD-15 in the css fixture'); bad++; }
for (const id of ['DK-01', 'GN-03', 'GN-05']) if (!fx.findings.some((f) => f.rule === id && f.file.endsWith('.tsx'))) { console.log(`MISSING ${id} in the tsx fixture`); bad++; }
const req = fx.findings.filter((f) => f.rule === 'FM-01' && /aria-required/.test(f.msg)).length;
if (!req) { console.log('MISSING FM-01 aria-required finding'); bad++; }
for (const s of ['starter-react', 'starter-html']) {
  const dir = join(here, '..', 'assets', s), r = run(dir);
  if (!r) { console.log('skip ' + s); continue; }
  const left = r.findings.filter((f) => f.cls !== 'Cleanup');
  if (left.length || r.counts.Blocker) { console.log(`NOT CLEAN ${s}:`, left.slice(0, 5)); bad++; }
}
console.log(bad ? `audit self-test: ${bad} problem(s)` : `audit self-test: ok (${PATTERN.length + 5} pattern checks found in the fixtures, starters clean)`);
process.exit(bad ? 1 : 0);
