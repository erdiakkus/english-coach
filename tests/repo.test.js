/* Repository rules: no em or en dashes anywhere, content validator passes. */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { ROOT } = require('./helpers');
const DASH = new RegExp('[' + String.fromCharCode(0x2013, 0x2014) + ']');

function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (e) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'screenshots') return;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  });
  return out;
}

test('no em or en dashes in any text file', function () {
  const bad = [];
  walk(ROOT, []).filter(function (f) { return !/\.(png|ico)$/i.test(f); }).forEach(function (f) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach(function (l, i) { if (DASH.test(l)) bad.push(path.relative(ROOT, f) + ':' + (i + 1)); });
  });
  assert.deepEqual(bad, []);
});

test('tools/validate.js passes on built-in content and the bundled pack', function () {
  fs.readdirSync(path.join(ROOT, 'packs')).filter(function (f) { return /\.json$/.test(f); }).forEach(function (f) {
    const out = execFileSync(process.execPath, [path.join(ROOT, 'tools', 'validate.js'), path.join(ROOT, 'packs', f)], { encoding: 'utf8' });
    assert.match(out, /^OK:/);
  });
});
