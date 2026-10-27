#!/usr/bin/env node
/* Validate built-in content and (optionally) a content pack JSON.
   Usage: node tools/validate.js [path/to/pack.json] */
const fs = require('fs');
const path = require('path');
const C = require(path.join(__dirname, '..', 'js', 'content.js'));

let errors = [];
let checked = 0;
C.units.forEach(function (u) {
  if (u.vocab) { checked++; errors = errors.concat(C.validateUnit(u)); }
});
C.placement.forEach(function (band, bi) {
  band.forEach(function (q, i) { errors = errors.concat(C.validateQuestion(q, 'placement band ' + bi + ' item ' + i)); });
});
Object.keys(C.stages).forEach(function (g) {
  C.stages[g].speak.forEach(function (q, i) { errors = errors.concat(C.validateQuestion(q, 'stage ' + g + ' speak ' + i)); });
});
const packPath = process.argv[2];
if (packPath) {
  const pack = JSON.parse(fs.readFileSync(packPath, 'utf8'));
  (pack.units || []).forEach(function (u) { checked++; errors = errors.concat(C.validateUnit(u)); });
}
if (errors.length) {
  console.error('Found ' + errors.length + ' problem(s):');
  errors.forEach(function (e) { console.error(' - ' + e); });
  process.exit(1);
}
console.log('OK: ' + checked + ' unit(s) validated, placement and stage data valid.');
