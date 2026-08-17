#!/usr/bin/env node
/*
 * Tests for the zero-infra campaign attribution in hire/index.html.
 *
 * No dependencies, no framework. This does NOT re-implement the logic: it
 * extracts the exact inline <script> that ships in hire/index.html, evaluates
 * it in a sandbox with `document`/`window` undefined (so the IIFE only exports
 * the pure function and skips DOM work), and exercises that real function.
 *
 * Regression guard for t_9c7032c3: the previous sanitiser stripped '_' (a legal
 * YouTube video-id character) with /[^a-z0-9-]/gi, mangling 9 of 59 real ids and
 * still rewriting the mailto with a wrong-length id that matches no video.
 *
 * Run: node tests/hire-attribution.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const HIRE = path.join(__dirname, '..', 'hire', 'index.html');
// The exact CTA href shipped in hire/index.html (subject=Hire%20inquiry).
const ORIGINAL_HREF =
  "mailto:hafs.darwish+hire@gmail.com?subject=Hire%20inquiry&body=Hi%20Hafs%2C%0A%0AHere%27s%20what%20I%27m%20building%20and%20where%20it%27s%20stuck%20(two%20sentences)%3A%0A%0A%0A%0AThanks%2C%0A";

// --- Extract the inline attribution <script> that defines hireInquiryMailto ---
const html = fs.readFileSync(HIRE, 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const source = scripts.find((s) => s.includes('function hireInquiryMailto'));
assert.ok(source, 'could not find the hireInquiryMailto inline script in hire/index.html');

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

const subjectTag = (id) => 'subject=Hire%20inquiry%20%5B' + id + '%5D';

// --- Acceptance criterion 1: all 9 underscore-bearing real ids reflect BYTE-EXACTLY ---
// These are the exact ids the deployed /[^a-z0-9-]/gi sanitiser mangled
// (measured against the real channel, 2026-08-16).
const UNDERSCORE_IDS = [
  '3m0yJKls_4Q',
  'h3Lc_iWH4OY',
  '_RAhGZbfApo',
  '_2dhlVxU6KI',
  '_dMp1zgtIJg',
  'Bt9k_Yj6LdU',
  '_Owfn3fycgo',
  '1SBOJ_YBLpU',
  'HqFaD94lJ_o',
];
UNDERSCORE_IDS.forEach((id) => {
  test('underscore id reflects byte-exactly: ' + id, () => {
    const out = rewrite(ORIGINAL_HREF, 'utm_campaign=' + id);
    assert.ok(out.indexOf(subjectTag(id)) !== -1, 'subject not tagged with exact id: ' + out);
    // The '_' must survive verbatim — no character dropped.
    assert.ok(out.indexOf('%5B' + id + '%5D') !== -1, 'id not byte-exact in subject: ' + out);
    // Body and recipient untouched.
    assert.ok(out.indexOf('mailto:hafs.darwish+hire@gmail.com') === 0, 'recipient changed');
  });
});

// A plain (no underscore) 11-char id still works.
test('plain 11-char id reflects', () => {
  const out = rewrite(ORIGINAL_HREF, 'utm_campaign=dQw4w9WgXcQ');
  assert.strictEqual(out.indexOf(subjectTag('dQw4w9WgXcQ')) !== -1, true);
});

// Hyphen-bearing id survives.
test('hyphen-bearing id reflects byte-exactly', () => {
  const out = rewrite(ORIGINAL_HREF, 'utm_campaign=aBcD_1-2xyZ');
  assert.ok(out.indexOf(subjectTag('aBcD_1-2xyZ')) !== -1, out);
});

// --- Acceptance criterion 2: malformed input reflects NOTHING (href unchanged) ---
const REJECTED = {
  'id too short (10)': 'utm_campaign=dQw4w9WgXc',
  'id too long (12)': 'utm_campaign=dQw4w9WgXcQZ',
  'sanitised fragment of a mangled underscore id (10-char)': 'utm_campaign=RAhGZbfApo',
  'illegal char (dot)': 'utm_campaign=dQw4w9WgX.Q',
  'illegal char (space, encoded)': 'utm_campaign=' + encodeURIComponent('dQw4w9WgX Q'),
  'empty id': 'utm_campaign=',
  'missing utm_campaign': 'utm_source=youtube&utm_medium=short',
  'arbitrary 40-char string (old slice(0,40) would have reflected)':
    'utm_campaign=' + 'a'.repeat(40),
  'CRLF injection attempt': 'utm_campaign=' + encodeURIComponent('a\r\nBcc:x@evil'),
  'extra-recipient injection attempt': 'utm_campaign=' + encodeURIComponent('a@b.com,c@d.com'),
  'duplicate utm_campaign keys (ambiguous)':
    'utm_campaign=dQw4w9WgXcQ&utm_campaign=aBcD_1-2xyZ',
};
Object.entries(REJECTED).forEach(([name, search]) => {
  test('rejected, mailto byte-for-byte unchanged: ' + name, () => {
    const out = rewrite(ORIGINAL_HREF, search);
    assert.strictEqual(out, ORIGINAL_HREF, 'href was modified: ' + out);
  });
});

// --- Acceptance criterion 3: negative control — untagged visit unchanged ---
test('negative control: no query string leaves mailto byte-identical', () => {
  assert.strictEqual(rewrite(ORIGINAL_HREF, ''), ORIGINAL_HREF);
  assert.strictEqual(rewrite(ORIGINAL_HREF, undefined), ORIGINAL_HREF);
});

// --- Robustness: only rewrites when the known subject literal is present ---
test('href without the known subject literal is left unchanged', () => {
  const weird = 'mailto:hafs.darwish+hire@gmail.com?subject=Something%20Else';
  assert.strictEqual(rewrite(weird, 'utm_campaign=dQw4w9WgXcQ'), weird);
});

// --- Report ---
console.log('\n' + passed + ' passed, ' + failures.length + ' failed');
if (failures.length) {
  process.exit(1);
}
