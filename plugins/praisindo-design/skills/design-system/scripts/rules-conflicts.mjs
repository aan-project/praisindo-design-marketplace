#!/usr/bin/env node
// Finds rules of the register (docs/design-system/rules-register.md of the project, or --register <file>) that may contradict each other (rule RG-02). The owner decides every conflict; nothing here resolves one.
//   node scripts/rules-conflicts.mjs --new GN-01,GN-02     rules just added or changed: lists every active rule that shares two or more code terms with them and says the opposite, or gives another value
//   node scripts/rules-conflicts.mjs                       the hard conflicts of the whole register (exit 1 when there is one)
// HARD: an active rule says it replaces / supersedes / overrides another rule that is still active.   CANDIDATE: two active rules share two or more terms (`code`, ids, class names) and one of them
// forbids what the other requires, or they give a different value (px, ms, count) for the same term. Candidates are for the owner to read; they never fail a test.
import { readFileSync } from 'node:fs';   // zero dependencies; copy of tools/rules_conflicts.mjs of the Praisindo DS repo (skill v2.131.0)
import { pathToFileURL } from 'node:url';

const ID = /^[A-Z]{2,4}-\d{2}[a-z]?$/;
export function parseRegister(md) {
  return md.split('\n').filter((l) => /^\| [A-Z]{2,4}-\d{2}[a-z]? \|/.test(l)).map((l) => { const c = l.split('|').map((x) => x.trim()); return { id: c[1], rule: c[2] || '', status: c[5] || '', test: c[6] || '' }; }).filter((r) => r.status);
}
const terms = (t) => new Set([...(t.match(/`[^`]{2,40}`/g) || []).map((x) => x.slice(1, -1).toLowerCase()), ...(t.match(/\b[A-Z]{2,4}-\d{2}\b/g) || [])]);
const NEG = /\b(never|no|not|without|stays out|must not)\b/i, POS = /\b(always|every|each|must|at least|exactly|is shown|are shown)\b/i;
const nums = (t) => new Map([...t.matchAll(/(\d+(?:\.\d+)?)\s?(px|ms|s|%|rows|items|columns|characters)\b/g)].map((m) => [m[2], m[1]]));

export function findConflicts(md, only = []) {
  const rows = parseRegister(md), act = rows.filter((r) => r.status === 'aktif'), byId = new Map(rows.map((r) => [r.id, r])), hard = [], cand = [];
  for (const r of act) for (const m of r.rule.matchAll(/\b(replaces|supersedes|overrides|menggantikan)\s+([A-Z]{2,4}-\d{2})\b/g)) { const t = byId.get(m[2]); if (t && t.status === 'aktif' && t.id !== r.id) hard.push({ a: r.id, b: t.id, why: `${r.id} says it ${m[1]} ${t.id}, which is still aktif` }); }
  const df = new Map(); for (const r of act) for (const t of terms(r.rule)) df.set(t, (df.get(t) || 0) + 1);
  const T = new Map(act.map((r) => [r.id, [...terms(r.rule)].filter((t) => (df.get(t) || 0) <= 30 && !ID.test(t))]));
  for (const a of act) {
    if (only.length && !only.includes(a.id)) continue;
    for (const b of act) {
      if (a.id === b.id || (only.length === 0 && a.id > b.id) || (only.length && only.includes(b.id) && a.id > b.id)) continue;
      const shared = T.get(a.id).filter((t) => T.get(b.id).includes(t)); if (shared.length < 2) continue;
      const na = nums(a.rule), nb = nums(b.rule), diff = [...na].filter(([u, v]) => nb.has(u) && nb.get(u) !== v).map(([u, v]) => `${v}${u} vs ${nb.get(u)}${u}`);
      const pol = (NEG.test(a.rule) && !NEG.test(b.rule) && POS.test(b.rule)) || (NEG.test(b.rule) && !NEG.test(a.rule) && POS.test(a.rule));
      if (diff.length || pol) cand.push({ a: a.id, b: b.id, shared: shared.slice(0, 4), why: diff.length ? 'other value: ' + diff.slice(0, 2).join(', ') : 'one forbids what the other requires' });
    }
  }
  return { hard, cand };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf('--new'), only = i > 0 ? process.argv[i + 1].split(',').map((x) => x.trim()) : [];
  const r = process.argv.indexOf('--register'), file = r > 0 ? process.argv[r + 1] : 'docs/design-system/rules-register.md';
  const { hard, cand } = findConflicts(readFileSync(file, 'utf8'), only);
  for (const h of hard) console.log(`HARD       ${h.a} / ${h.b}: ${h.why}`);
  for (const c of cand.slice(0, 40)) console.log(`CANDIDATE  ${c.a} / ${c.b}: ${c.why} (terms: ${c.shared.join(', ')})`);
  console.log(`${hard.length} hard conflict(s), ${cand.length} candidate(s)${only.length ? ' for ' + only.join(', ') : ''}. The owner decides: record the new rule as "perlu keputusan owner" in the Konflik section.`);
  process.exit(hard.length ? 1 : 0);
}
