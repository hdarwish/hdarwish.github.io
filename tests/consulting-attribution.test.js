#!/usr/bin/env node
/*
 * Tests for the zero-infra YouTube inquiry attribution in index.html.
 *
 * No dependencies, no framework. This does NOT re-implement the logic: it
 * extracts the exact inline <script> that ships in index.html, evaluates it in
 * a sandbox with `document`/`window` undefined (so the IIFE only exports the
 * pure function and skips DOM work), and exercises that real function.
 *
 * Run: node tests/consulting-attribution.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const INDEX = path.join(__dirname, '..', 'index.html');
const ORIGINAL_HREF =
  "mailto:hafs.darwish@gmail.com?subject=Consulting%20Inquiry&body=Hi%20Hafs%2C%0A%0AI'm%20interested%20in%20discussing%20a%20project.%0A%0A";

// --- Extract the inline attribution <script> that defines ytConsultingMailto ---
const html = fs.readFileSync(INDEX, 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const source = scripts.find((s) => s.includes('function ytConsultingMailto'));
assert.ok(source, 'could not find the ytConsultingMailto inline script in index.html');

// Sandbox with browser globals the function needs, but NO document/window,
// so the IIFE exports the pure function and returns before touching the DOM.
const sandbox = {
  module: { exports: {} },
  URLSearchParams,
  encodeURIComponent,
};
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const rewrite = sandbox.module.exports;
assert.strictEqual(typeof rewrite, 'function', 'inline script did not export the function');

// --- Test helpers ---
let passed = 0;
const failures = [];
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  ✓ ' + name);
  } catch (e) {
    failures.push({ name, message: e && e.message });
    console.log('  ✗ ' + name + '\n      ' + (e && e.message));
  }
}

const q = (params) => new URLSearchParams(params).toString();
const VALID_ID = 'dQw4w9WgXcQ'; // canonical 11-char YouTube id
const VALID_ID_2 = 'aBcD_1-2xyZ';

// --- Valid sources ---
test('valid short source produces tagged, video-specific mailto', () => {
  const out = rewrite(
    ORIGINAL_HREF,
    q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: VALID_ID, utm_content: 'short' })
  );
  assert.ok(out.startsWith('mailto:hafs.darwish+yt-' + VALID_ID + '@gmail.com?'), 'recipient not plus-addressed: ' + out);
  assert.ok(out.includes('subject=Consulting%20Inquiry%20%5Byoutube%2Fshort%2F' + VALID_ID + '%5D'), 'subject tag missing: ' + out);
  // Body preserved byte-for-byte.
  assert.ok(out.endsWith("&body=Hi%20Hafs%2C%0A%0AI'm%20interested%20in%20discussing%20a%20project.%0A%0A"), 'body altered: ' + out);
});

test('valid long source produces long tag', () => {
  const out = rewrite(
    ORIGINAL_HREF,
    q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: VALID_ID, utm_content: 'long' })
  );
  assert.ok(out.includes('subject=Consulting%20Inquiry%20%5Byoutube%2Flong%2F' + VALID_ID + '%5D'), out);
  assert.ok(out.startsWith('mailto:hafs.darwish+yt-' + VALID_ID + '@gmail.com'), out);
});

test('short and long, and different video ids, produce distinct tags', () => {
  const shortOut = rewrite(ORIGINAL_HREF, q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: VALID_ID, utm_content: 'short' }));
  const longOut = rewrite(ORIGINAL_HREF, q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: VALID_ID, utm_content: 'long' }));
  const otherVid = rewrite(ORIGINAL_HREF, q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: VALID_ID_2, utm_content: 'short' }));
  assert.notStrictEqual(shortOut, longOut, 'short and long tags identical');
  assert.notStrictEqual(shortOut, otherVid, 'different video ids produced identical mailto');
  assert.ok(otherVid.includes('yt-' + VALID_ID_2 + '@gmail.com'), otherVid);
});

// --- Invalid / missing params leave the href byte-for-byte unchanged ---
const unchangedCases = {
  'plain visitor (no query)': '',
  'missing all utm params but has other query': 'ref=hn&foo=bar',
  'wrong source (google)': q({ utm_source: 'google', utm_medium: 'description', utm_campaign: VALID_ID, utm_content: 'short' }),
  'wrong medium (cpc)': q({ utm_source: 'youtube', utm_medium: 'cpc', utm_campaign: VALID_ID, utm_content: 'short' }),
  'missing medium': q({ utm_source: 'youtube', utm_campaign: VALID_ID, utm_content: 'short' }),
  'missing content': q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: VALID_ID }),
  'invalid content value': q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: VALID_ID, utm_content: 'medium' }),
  'id too short (10)': q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: 'dQw4w9WgXc', utm_content: 'short' }),
  'id too long (12)': q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: 'dQw4w9WgXcQZ', utm_content: 'short' }),
  'id with illegal char (dot)': q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: 'dQw4w9WgXc.', utm_content: 'short' }),
  'empty id': q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: '', utm_content: 'short' }),
  'case-mismatched source (YouTube)': q({ utm_source: 'YouTube', utm_medium: 'description', utm_campaign: VALID_ID, utm_content: 'short' }),
};
for (const [name, search] of Object.entries(unchangedCases)) {
  test('unchanged: ' + name, () => {
    assert.strictEqual(rewrite(ORIGINAL_HREF, search), ORIGINAL_HREF);
  });
}

// --- Injection attempts must never mutate the mailto ---
test('injection: CRLF + extra recipient/field in id is rejected (unchanged)', () => {
  const evil = 'dQw4w9WgXcQ%0ACc:victim@evil.com%0ABcc:x@evil.com';
  const out = rewrite(ORIGINAL_HREF, 'utm_source=youtube&utm_medium=description&utm_content=short&utm_campaign=' + evil);
  assert.strictEqual(out, ORIGINAL_HREF);
});

test('injection: comma-separated extra recipient in id is rejected (unchanged)', () => {
  const out = rewrite(ORIGINAL_HREF, 'utm_source=youtube&utm_medium=description&utm_content=short&utm_campaign=' + encodeURIComponent('a@b.com,c@d.com'));
  assert.strictEqual(out, ORIGINAL_HREF);
});

test('injection: content carrying ]&cc= payload is rejected (unchanged)', () => {
  const out = rewrite(ORIGINAL_HREF, 'utm_source=youtube&utm_medium=description&utm_campaign=' + VALID_ID + '&utm_content=' + encodeURIComponent('short]&cc=x@evil.com'));
  assert.strictEqual(out, ORIGINAL_HREF);
});

test('any valid rewrite has exactly one @ and no raw CR/LF or added mailto field', () => {
  const out = rewrite(ORIGINAL_HREF, q({ utm_source: 'youtube', utm_medium: 'description', utm_campaign: VALID_ID, utm_content: 'short' }));
  assert.strictEqual((out.match(/@/g) || []).length, 1, 'more than one @ in href: ' + out);
  assert.ok(!/[\r\n]/.test(out), 'raw CR/LF present: ' + out);
  assert.ok(!/[?&](cc|bcc)=/i.test(out), 'cc/bcc field injected: ' + out);
  // Exactly the two intended query fields remain: subject and body.
  const query = out.split('?')[1];
  const keys = [...new URLSearchParams(query).keys()];
  assert.deepStrictEqual(keys.sort(), ['body', 'subject'], 'unexpected mailto fields: ' + keys);
});

// --- Report ---
console.log('\n' + passed + ' passed, ' + failures.length + ' failed');
process.exit(failures.length ? 1 : 0);
