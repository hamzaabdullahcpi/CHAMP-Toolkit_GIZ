/**
 * Build-time Airtable sync, part 2. Runs right after generate_airtable.cjs.
 *
 * 1. Adds the sections generate_airtable.cjs doesn't export to public/api/content.json:
 *    the home page "How to use" popup, the Country Journeys overview page, the Roadmap and the Pledges.
 *    It uses the same parsers the app uses, so the shape matches what the components expect.
 * 2. Downloads every Airtable attachment (image) referenced in content.json into public/airtable-assets/
 *    and points content.json at the local copy. Airtable attachment links expire after a few hours,
 *    so linking to them directly breaks images shortly after each deploy.
 *
 * Without AIRTABLE_BASE_ID / AIRTABLE_PAT it leaves content.json untouched.
 */
import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  fetchTableClientSafely,
  parseHomePageRecords,
  parseCountryJourneysOverviewRecords,
  parseChampRoadmapRecords,
  parseChampPledgeRecords,
} from '../src/services/airtableService';

const ROOT = process.cwd();
const CONTENT_FILE = path.join(ROOT, 'public', 'api', 'content.json');
const ASSET_DIR_NAME = 'airtable-assets';
const ASSET_DIR = path.join(ROOT, 'public', ASSET_DIR_NAME);
const AIRTABLE_URL = /^https:\/\/[a-z0-9.-]*airtableusercontent\.com\//i;

const EXTENSIONS: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'application/pdf': '.pdf',
};

const log = (msg: string) => console.log(`[Airtable Extras] ${msg}`);

async function syncExtraSections(content: any, baseId: string, pat: string) {
  const [homeRecords, countryRecords, overviewRecords, roadmapRecords, pledgeRecords] = await Promise.all([
    fetchTableClientSafely(['Home Page', 'Landing Page', 'Home Page Content', 'Home Content'], baseId, pat),
    fetchTableClientSafely(['Country Journeys', 'Country Deep Dives', 'Countries'], baseId, pat),
    fetchTableClientSafely(['Country Journeys Overview', 'Country Journeys Page', 'Country Journeys Content', 'Country Journey Overview'], baseId, pat),
    fetchTableClientSafely(['CHAMP Implementation Roadmap', 'Roadmap', 'CHAMP Roadmap'], baseId, pat),
    fetchTableClientSafely(['CHAMP Pledges', 'Pledges', 'CHAMP Pledge'], baseId, pat),
  ]);

  // Hero and partnership already come from generate_airtable.cjs; only add the "How to use" popup.
  if (homeRecords.length > 0) {
    const home = parseHomePageRecords(homeRecords);
    content.homePageContent = { ...(content.homePageContent || {}), howToUse: home.howToUse };
    log(`Home page "How to use" popup: synced from ${homeRecords.length} Home Page rows.`);
  } else {
    log('Home Page table not found or empty; "How to use" popup keeps its built-in text.');
  }

  if (overviewRecords.length > 0 || countryRecords.length > 0) {
    content.countryJourneysOverview = parseCountryJourneysOverviewRecords(overviewRecords, countryRecords, homeRecords);
    log(`Country Journeys overview: synced (${overviewRecords.length} overview rows).`);
  } else {
    log('Country Journeys Overview table not found or empty; page keeps its built-in text.');
  }

  if (roadmapRecords.length > 0) {
    content.roadmapPillars = parseChampRoadmapRecords(roadmapRecords);
    log(`Roadmap: synced ${content.roadmapPillars.length} pillars from ${roadmapRecords.length} rows.`);
  } else {
    log('Roadmap table not found or empty; popup keeps its built-in text.');
  }

  if (pledgeRecords.length > 0) {
    content.champPledges = parseChampPledgeRecords(pledgeRecords);
    log(`Pledges: synced ${content.champPledges.length} pledges.`);
  } else {
    log('Pledges table not found or empty; popup keeps its built-in text.');
  }
}

function collectAirtableUrls(value: any, found: Set<string>) {
  if (typeof value === 'string') {
    if (AIRTABLE_URL.test(value)) found.add(value);
  } else if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) collectAirtableUrls(value[key], found);
  }
}

function replaceUrls(value: any, map: Map<string, string>): any {
  if (typeof value === 'string') return map.get(value) ?? value;
  if (Array.isArray(value)) return value.map((v) => replaceUrls(v, map));
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = replaceUrls(value[key], map);
  }
  return value;
}

async function localizeAttachments(content: any) {
  const urls = new Set<string>();
  collectAirtableUrls(content, urls);
  if (urls.size === 0) {
    log('No Airtable attachments to download.');
    return;
  }

  fs.mkdirSync(ASSET_DIR, { recursive: true });
  const map = new Map<string, string>();

  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
      const ext = EXTENSIONS[type] || path.extname(new URL(url).pathname) || '';
      // Name by content so the same image keeps the same file across builds.
      const name = crypto.createHash('sha1').update(bytes).digest('hex').slice(0, 16) + ext;
      fs.writeFileSync(path.join(ASSET_DIR, name), bytes);
      map.set(url, `/${ASSET_DIR_NAME}/${name}`);
    } catch (err: any) {
      console.warn(`[Airtable Extras] Could not download attachment (keeping the Airtable link): ${err?.message || err}`);
    }
  }

  replaceUrls(content, map);
  log(`Saved ${map.size} of ${urls.size} Airtable attachments to public/${ASSET_DIR_NAME}/.`);

  // Remove images no longer referenced by any content.
  const used = new Set([...map.values()].map((p) => path.basename(p)));
  collectLocalAssetNames(content, used);
  for (const file of fs.readdirSync(ASSET_DIR)) {
    if (!used.has(file)) fs.unlinkSync(path.join(ASSET_DIR, file));
  }
}

function collectLocalAssetNames(value: any, used: Set<string>) {
  if (typeof value === 'string') {
    if (value.startsWith(`/${ASSET_DIR_NAME}/`)) used.add(path.basename(value));
  } else if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) collectLocalAssetNames(value[key], used);
  }
}

async function main() {
  const baseId = process.env.AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;
  const pat = process.env.AIRTABLE_PAT || process.env.AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_PAT;

  if (!baseId || !pat) {
    log('No AIRTABLE_BASE_ID / AIRTABLE_PAT in build environment; leaving content.json as is.');
    return;
  }
  if (!fs.existsSync(CONTENT_FILE)) {
    log('public/api/content.json not found; skipping.');
    return;
  }

  const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));

  try {
    await syncExtraSections(content, baseId, pat);
  } catch (err: any) {
    console.warn(`[Airtable Extras] Could not sync extra sections: ${err?.message || err}`);
  }

  await localizeAttachments(content);

  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
  log('Updated public/api/content.json.');
}

main().catch((err) => {
  // Never fail the deploy because of this step; the site falls back to built-in content.
  console.warn('[Airtable Extras] Unexpected error:', err);
});
