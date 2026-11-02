// Fetches finished Premier League 2026/27 results from football-data.org
// and fills them into data/fixtures-2026-27.json.
// Runs daily on GitHub Actions. Needs the FOOTBALL_DATA_KEY secret.
import { readFile, writeFile } from 'node:fs/promises';

const SEASON = 2026; // football-data.org names a season by its starting year
const FIXTURES = new URL('../data/fixtures-2026-27.json', import.meta.url);
const UPDATED = new URL('../data/last-updated.json', import.meta.url);
const API = process.env.FOOTBALL_DATA_API || `https://api.football-data.org/v4/competitions/PL/matches?season=${SEASON}`;

const ALIASES = {
  'Brighton & Hove Albion': 'Brighton',
  'Brighton Hove Albion': 'Brighton',
  'Tottenham Hotspur': 'Tottenham',
  'Wolverhampton Wanderers': 'Wolves',
  'AFC Bournemouth': 'Bournemouth',
  'Newcastle': 'Newcastle United',
  'Leeds': 'Leeds United',
  'Nottingham': 'Nottingham Forest',
  'Hull': 'Hull City',
  'Coventry': 'Coventry City',
  'Ipswich': 'Ipswich Town',
};
const clean = (name) => {
  const s = name.trim().replace(/^AFC /, '').replace(/ (A?FC)$/, '');
  return ALIASES[name.trim()] || ALIASES[s] || s;
};

const key = process.env.FOOTBALL_DATA_KEY;
if (!key && !process.env.FOOTBALL_DATA_API) {
  console.error('Missing FOOTBALL_DATA_KEY. Add it under Settings > Secrets and variables > Actions.');
  process.exit(1);
}

const res = await fetch(API, { headers: key ? { 'X-Auth-Token': key } : {} });
if (!res.ok) {
  console.error(`football-data.org answered ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const { matches = [] } = await res.json();
const fixtures = JSON.parse(await readFile(FIXTURES, 'utf8'));
const teams = new Set(fixtures.flatMap((f) => [f.home, f.away]));

const added = [], corrected = [], unknown = new Set();
let moved = 0;
for (const m of matches) {
  const home = clean(m.homeTeam?.name || m.homeTeam?.shortName || '');
  const away = clean(m.awayTeam?.name || m.awayTeam?.shortName || '');
  if (!teams.has(home)) unknown.add(m.homeTeam?.name);
  if (!teams.has(away)) unknown.add(m.awayTeam?.name);
  const f = fixtures.find((x) => x.home === home && x.away === away);
  if (!f) continue;
  const date = (m.utcDate || '').slice(0, 10);
  if (date && f.date !== date) { f.date = date; moved++; }
  if (m.status !== 'FINISHED') continue;
  const hg = m.score?.fullTime?.home, ag = m.score?.fullTime?.away;
  if (!Number.isInteger(hg) || !Number.isInteger(ag)) continue;
  if (f.hg === null || f.hg === undefined) added.push(`${home} ${hg}-${ag} ${away}`);
  else if (f.hg !== hg || f.ag !== ag) corrected.push(`${home} ${f.hg}-${f.ag} -> ${hg}-${ag} ${away}`);
  else continue;
  f.hg = hg; f.ag = ag;
}

if (unknown.size) {
  console.error('Team names not recognised, add them to ALIASES in scripts/update.mjs:', [...unknown].join(', '));
  process.exit(1);
}

await writeFile(FIXTURES, JSON.stringify(fixtures) + '\n');
const played = fixtures.filter((f) => f.hg !== null && f.hg !== undefined).length;
await writeFile(UPDATED, JSON.stringify({ checked_at: new Date().toISOString(), games_played: played }) + '\n');

console.log(`Added ${added.length} result(s), corrected ${corrected.length}, rescheduled ${moved}. ${played} games played.`);
for (const line of [...added, ...corrected]) console.log('  ' + line);
