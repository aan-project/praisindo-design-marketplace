#!/usr/bin/env node
// Rule coverage of the skill (design-system v2.183.0). Zero dependencies.
//   node scripts/rules-coverage.mjs                                   uses references/rules-general.json (the general rule ids of the last triage)
//   node scripts/rules-coverage.mjs --triage <triage-register.md>     reads the U ids from the triage table (| id | section | summary | U/D/X | ...)
//   node scripts/rules-coverage.mjs --triage <t.md> --register <rules-register.md>   also checks that every register id is triaged and every U id exists
// Fails (exit 1) when a general (U) rule has no section "### <id>" with Rule / Meet / Check in references/rules-*.md.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url)), refs = join(here, '..', 'references');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const ID = /^[A-Z]+-\d+[a-z]?$/;
const rows = (md) => md.split('\n').filter((l) => l.startsWith('| ')).map((l) => l.split('|').slice(1, -1).map((c) => c.trim())).filter((c) => ID.test(c[0]));

let U, triaged = null;
const tri = arg('--triage');
if (tri) {
  const r = rows(readFileSync(tri, 'utf8'));
  triaged = new Map(r.map((c) => [c[0], c[3]]));
  U = r.filter((c) => c[3] === 'U').map((c) => c[0]);
} else U = JSON.parse(readFileSync(join(refs, 'rules-general.json'), 'utf8')).ids;

let bad = 0;
const regFile = arg('--register');
if (regFile) {
  if (!triaged) { console.error('--register needs --triage'); process.exit(2); }
  const ids = new Set(rows(readFileSync(regFile, 'utf8')).map((c) => c[0]));
  for (const id of ids) if (!triaged.has(id)) { console.log(`NOT TRIAGED ${id} (in the register, not in the triage)`); bad++; }
  for (const id of U) if (!ids.has(id)) { console.log(`UNKNOWN ${id} (U in the triage, not in the register)`); bad++; }
}
const text = readdirSync(refs).filter((f) => /^rules-.*\.md$/.test(f)).map((f) => readFileSync(join(refs, f), 'utf8')).join('\n');
for (const id of U) {
  const at = text.indexOf(`\n### ${id}\n`);
  if (at < 0) { console.log(`MISSING ${id}: no "### ${id}" section in references/rules-*.md`); bad++; continue; }
  const sec = text.slice(at + 1).split('\n### ')[0];
  if (!/\*\*Rule\.\*\*/.test(sec) || !/\*\*Meet[.\s/]/.test(sec) || !/\*\*(Check|Meet \/ Check)\.?\*\*/.test(sec)) { console.log(`INCOMPLETE ${id}: needs Rule, Meet and Check`); bad++; }
}
console.log(bad ? `rules coverage: ${bad} problem(s)` : `rules coverage: ok (${U.length} general rules, each with Rule, Meet and Check)`);
process.exit(bad ? 1 : 0);
