import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/content';

test('live content refreshes, filters publication, caches requests and survives Airtable failures', async () => {
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  const originalBase = process.env.AIRTABLE_BASE_ID;
  const originalToken = process.env.AIRTABLE_PAT;
  let clock = originalNow();
  Date.now = () => clock;
  process.env.AIRTABLE_BASE_ID = 'app-test';
  process.env.AIRTABLE_PAT = 'private-test-token';
  let requests = 0;
  let published = true;
  let fail = false;
  let phase = 'Initial Brazil';
  const country = (id: string, visible: boolean) => ({ id: 'rec-' + id, fields: {
    'Country ID': id, 'Country Name': id, Published: visible, Status: 'Available', Summary: phase,
  }});
  globalThis.fetch = async (input, options) => {
    requests++;
    clock += 250; // Advance the rate-limit clock without slowing the test.
    assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer private-test-token');
    if (fail) return Response.json({ error: 'unavailable' }, { status: 503 });
    const url = new URL(String(input));
    const table = decodeURIComponent(url.pathname.split('/').at(-1)!);
    let records: any[] = [];
    if (table === 'Actions') records = [{ id: 'rec-action', fields: { 'Action Number': 1, Title: phase } }];
    if (table === 'Country Journeys') {
      records = url.searchParams.has('offset')
        ? [country('brazil', published), country('unpublished', false)]
        : [country('sweden', true)];
    }
    return Response.json({ records, ...(table === 'Country Journeys' && !url.searchParams.has('offset') ? { offset: 'page2' } : {}) });
  };
  async function request(method = 'GET') {
    const headers: Record<string, unknown> = {};
    let body: string | undefined;
    const response = { statusCode: 0, setHeader(name: string, value: unknown) { headers[name] = value; return this; }, end(value?: string) { body = value; return this; } };
    await handler({ method }, response as any);
    return { status: response.statusCode, headers, data: body ? JSON.parse(body) : undefined };
  }
  try {
    const [first, concurrent] = await Promise.all([request(), request()]);
    assert.deepEqual(first.data.countryJourneys.map((c: any) => c.countryId), ['sweden', 'brazil']);
    assert.deepEqual(concurrent.data, first.data);
    assert.equal(first.data.source, 'airtable_api_live');
    assert.equal(first.data.stale, false);
    assert.ok(!JSON.stringify(first.data).includes('private-test-token'));
    const initialRequests = requests;
    await request();
    assert.equal(requests, initialRequests, 'fresh requests share cached Airtable data');
    phase = 'Edited in Airtable';
    clock += 31_000;
    const edited = await request();
    assert.equal(edited.data.countryJourneys.find((c: any) => c.countryId === 'brazil').summary, phase);
    published = false;
    clock += 31_000;
    const unpublished = await request();
    assert.deepEqual(unpublished.data.countryJourneys.map((c: any) => c.countryId), ['sweden']);
    fail = true;
    clock += 31_000;
    const fallback = await request();
    assert.equal(fallback.data.stale, true);
    assert.equal(fallback.headers['Vercel-CDN-Cache-Control'], 'no-store');
    assert.deepEqual(fallback.data.countryJourneys, unpublished.data.countryJourneys);
    const beforePost = requests;
    assert.equal((await request('POST')).status, 405);
    assert.equal(requests, beforePost);
    assert.equal((await request('HEAD')).data, undefined);
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
    if (originalBase === undefined) delete process.env.AIRTABLE_BASE_ID; else process.env.AIRTABLE_BASE_ID = originalBase;
    if (originalToken === undefined) delete process.env.AIRTABLE_PAT; else process.env.AIRTABLE_PAT = originalToken;
  }
});

test('the emitted Vercel function loads in Node without a bundler or TS loader', async () => {
  const { execFileSync } = await import('node:child_process');
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join, resolve } = await import('node:path');
  const { pathToFileURL } = await import('node:url');
  const output = mkdtempSync(join(tmpdir(), 'champ-function-test-'));
  try {
    writeFileSync(join(output, 'package.json'), '{"type":"module"}');
    execFileSync(process.execPath, [resolve('node_modules/typescript/bin/tsc'), 'api/content.ts',
      '--outDir', output, '--module', 'esnext', '--target', 'es2022',
      '--moduleResolution', 'bundler', '--skipLibCheck', '--esModuleInterop']);
    const result = execFileSync(process.execPath, ['--input-type=module', '-e',
      `const {default: handler} = await import(${JSON.stringify(pathToFileURL(join(output, 'api/content.js')).href)});
       await handler({method:'GET'}, {setHeader(){},end(body){if(!JSON.parse(body).stale) process.exit(1)}});`],
      { env: { ...process.env, AIRTABLE_BASE_ID: '', AIRTABLE_PAT: '', AIRTABLE_API_KEY: '' }, encoding: 'utf8' });
    assert.ok(!result.includes('ERR_MODULE_NOT_FOUND'));
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
});
