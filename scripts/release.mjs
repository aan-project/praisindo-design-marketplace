#!/usr/bin/env node
// Release helper of the Praisindo design marketplace.
//   node scripts/release.mjs <MAJOR.MINOR.PATCH> "<one line for the changelog>"   bump everything
//   node scripts/release.mjs --check                                              verify consistency
// It updates: plugin.json, marketplace.json (plugin entry and metadata), CHANGELOG.md (one new line),
// and the markers in README.md (version, date, repo address). It does not commit, tag or push.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = {
  plugin: join(root, 'plugins/praisindo-design/.claude-plugin/plugin.json'),
  market: join(root, '.claude-plugin/marketplace.json'),
  readme: join(root, 'README.md'),
  log: join(root, 'CHANGELOG.md'),
};
const SEMVER = /^\d+\.\d+\.\d+$/;
const read = (f) => readFileSync(f, 'utf8');
const mark = (s, name) => (s.match(new RegExp(`<!-- ${name} -->(.*?)<!-- /${name} -->`)) || [])[1];

function slug() {
  try {
    const u = execSync('git remote get-url origin', { cwd: root, encoding: 'utf8' }).trim();
    const m = u.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
    return m ? m[1] : null;
  } catch { return null; }
}

function check() {
  const problems = [];
  const plugin = JSON.parse(read(P.plugin));
  const market = JSON.parse(read(P.market));
  const entry = (market.plugins || []).find((p) => p.name === plugin.name);
  const v = plugin.version;
  if (!SEMVER.test(v)) problems.push(`plugin.json version "${v}" is not MAJOR.MINOR.PATCH`);
  if (!entry) problems.push(`marketplace.json has no plugin entry "${plugin.name}"`);
  else if (entry.version !== v) problems.push(`marketplace.json plugin version ${entry.version} != plugin.json ${v}`);
  if (market.metadata?.version !== v) problems.push(`marketplace.json metadata.version ${market.metadata?.version} != ${v}`);
  const readme = read(P.readme);
  if (mark(readme, 'version') !== v) problems.push(`README version marker "${mark(readme, 'version')}" != ${v}`);
  const top = (read(P.log).match(/^- \*\*(\d+\.\d+\.\d+)\*\*/m) || [])[1];
  if (top !== v) problems.push(`CHANGELOG top entry "${top}" != ${v}`);
  const s = slug();
  const addr = (readme.match(/^\s+([\w.-]+\/[\w.-]+-marketplace)$/m) || [])[1];
  if (s && addr && s !== addr) problems.push(`README repo address ${addr} != git remote ${s}`);
  const skill = join(root, 'plugins/praisindo-design/skills/design-system/SKILL.md');
  if (!existsSync(skill)) problems.push('skills/design-system/SKILL.md is missing');
  else if (!read(skill).includes(v)) problems.push(`SKILL.md does not mention ${v}`);
  return problems;
}

const [a, b] = process.argv.slice(2);
if (a === '--check') {
  const pr = check();
  pr.forEach((x) => console.log('PROBLEM', x));
  console.log(pr.length ? `${pr.length} problem(s)` : 'release check ok');
  process.exit(pr.length ? 1 : 0);
}
if (!a || !SEMVER.test(a) || !b) {
  console.error('usage: node scripts/release.mjs <MAJOR.MINOR.PATCH> "<changelog line>"   |   --check');
  process.exit(2);
}
const date = new Date().toISOString().slice(0, 10);

const plugin = JSON.parse(read(P.plugin)); plugin.version = a;
writeFileSync(P.plugin, JSON.stringify(plugin, null, 2) + '\n');

const market = JSON.parse(read(P.market));
market.metadata = { ...(market.metadata || {}), version: a };
for (const p of market.plugins || []) if (p.name === plugin.name) p.version = a;
writeFileSync(P.market, JSON.stringify(market, null, 2) + '\n');

let log = read(P.log);
const head = 'One line per release, newest first.\n\n';
if (!log.includes(head)) { console.error('CHANGELOG.md header not found'); process.exit(1); }
log = log.replace(head, `${head}- **${a}** (${date}) ${b}\n`);
writeFileSync(P.log, log);

let readme = read(P.readme);
readme = readme.replace(/<!-- version -->.*?<!-- \/version -->/, `<!-- version -->${a}<!-- /version -->`);
readme = readme.replace(/<!-- date -->.*?<!-- \/date -->/, `<!-- date -->${date}<!-- /date -->`);
const s = slug();
if (s) readme = readme.replace(/^(\s+)[\w.-]+\/[\w.-]+-marketplace$/m, `$1${s}`);
writeFileSync(P.readme, readme);

const pr = check();
pr.forEach((x) => console.log('PROBLEM', x));
console.log(pr.length ? 'fix the problems above' : `released ${a} locally (not committed). Next: git add -A && git commit -m "Praisindo design ${a}" && git tag v${a} && git push && git push --tags`);
process.exit(pr.length ? 1 : 0);
