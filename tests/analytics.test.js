#!/usr/bin/env node
/*
 * Run: node tests/analytics.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const TAG = '<script defer src="/analytics.js"></script>';
const SOURCE = fs.readFileSync(path.join(ROOT, 'analytics.js'), 'utf8');
const EXCLUDED = /^(previews\/|blog\/social-drafts\/|resume-engine-tool\/_next\/)/;

function publicPages() {
  return execFileSync('git', ['ls-files', '*.html'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter((f) => f && !EXCLUDED.test(f));
}

function load({ hostname, websiteId, win = {} }) {
  const appended = [];
  const listeners = [];
  const src = SOURCE.replace(/var WEBSITE_ID = '[^']*';/, `var WEBSITE_ID = '${websiteId}';`);
  const element = () => ({ attrs: {}, setAttribute(k, v) { this.attrs[k] = v; } });
  Object.assign(win, {
    location: { hostname, pathname: '/blog/x.html', href: `https://${hostname}/blog/x.html` },
    document: {
      createElement: element,
      head: { appendChild: (el) => appended.push(el) },
      addEventListener: (type, fn) => listeners.push(fn),
    },
    URL,
  });
  win.window = win;
  vm.runInNewContext(src, win);
  return { appended, listeners, win };
}

let failures = 0;
function test(name, fn) {
  try { fn(); console.log(`ok   ${name}`); }
  catch (e) { failures++; console.log(`FAIL ${name}\n     ${e.message}`); }
}

test('every public page loads analytics.js exactly once, inside <head>', () => {
  const missing = [];
  for (const f of publicPages()) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const head = html.split(/<\/head>/i)[0];
    if (html.split(TAG).length !== 2 || !head.includes(TAG)) missing.push(f);
  }
  assert.deepStrictEqual(missing, []);
});

test('loads the Umami tracker with the website id on hafs.dev', () => {
  const { appended } = load({ hostname: 'hafs.dev', websiteId: 'test-id' });
  assert.strictEqual(appended.length, 1);
  assert.strictEqual(appended[0].src, 'https://cloud.umami.is/script.js');
  assert.strictEqual(appended[0].attrs['data-website-id'], 'test-id');
  assert.strictEqual(appended[0].defer, true);
});

test('loads on herald.hafs.dev', () => {
  assert.strictEqual(load({ hostname: 'herald.hafs.dev', websiteId: 'test-id' }).appended.length, 1);
});

test('stays inert off-site and without a website id', () => {
  assert.strictEqual(load({ hostname: 'localhost', websiteId: 'test-id' }).appended.length, 0);
  assert.strictEqual(load({ hostname: 'nothafs.dev', websiteId: 'test-id' }).appended.length, 0);
  assert.strictEqual(load({ hostname: 'hafs.dev', websiteId: '' }).appended.length, 0);
});

test('a second include on the same page does not load the tracker twice', () => {
  const first = load({ hostname: 'hafs.dev', websiteId: 'test-id' });
  const second = load({ hostname: 'hafs.dev', websiteId: 'test-id', win: first.win });
  assert.strictEqual(second.appended.length, 0);
});

test('classifies clicks into section, email and outbound events', () => {
  const { win } = load({ hostname: 'hafs.dev', websiteId: '' });
  const here = win.location;
  const c = (href) => JSON.parse(JSON.stringify(win.hafsAnalyticsClassify(href, here)));
  assert.deepStrictEqual(c('#consulting'), { name: 'section-link', data: { to: 'consulting', from: '/blog/x.html' } });
  assert.deepStrictEqual(c('mailto:a@b.c'), { name: 'email-link', data: { from: '/blog/x.html' } });
  assert.deepStrictEqual(c('https://github.com/hdarwish'), { name: 'outbound-link', data: { to: 'github.com', from: '/blog/x.html' } });
  assert.strictEqual(win.hafsAnalyticsClassify('../blog.html', here), null);
  assert.strictEqual(win.hafsAnalyticsClassify('https://herald.hafs.dev/', here), null);
  assert.strictEqual(win.hafsAnalyticsClassify('#', here), null);
  assert.strictEqual(win.hafsAnalyticsClassify('javascript:void(0)', here), null);
});

test('click handler sends the classified event to umami.track', () => {
  const { listeners, win } = load({ hostname: 'hafs.dev', websiteId: 'test-id' });
  const sent = [];
  win.umami = { track: (name, data) => sent.push([name, data]) };
  const anchor = { getAttribute: () => 'https://www.linkedin.com/in/x' };
  listeners[0]({ target: { closest: () => anchor } });
  assert.strictEqual(sent.length, 1);
  assert.strictEqual(sent[0][0], 'outbound-link');
  assert.strictEqual(sent[0][1].to, 'www.linkedin.com');
});

if (failures) { console.log(`\n${failures} failing`); process.exit(1); }
console.log('\nall passing');
