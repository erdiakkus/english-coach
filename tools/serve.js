#!/usr/bin/env node
/* Tiny static server for local testing. No dependencies.
   Usage: node tools/serve.js [port] [--base=/sub/path/]
   --base serves the app under a subpath, the same way GitHub Pages does (https://user.github.io/repo/).
   http://localhost counts as a secure origin, so the service worker and the microphone work here.
   To test on a phone over Wi-Fi you need HTTPS (see README_TR.md). */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const port = parseInt(args.filter(function (a) { return /^\d+$/.test(a); })[0] || '8000', 10);
let base = (args.filter(function (a) { return a.indexOf('--base=') === 0; })[0] || '--base=/').slice(7);
if (base[0] !== '/') base = '/' + base;
if (base[base.length - 1] !== '/') base += '/';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.ico': 'image/x-icon', '.css': 'text/css; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.svg': 'image/svg+xml'
};

http.createServer(function (req, res) {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === base.slice(0, -1)) { res.writeHead(301, { Location: base }); return res.end(); }
  if (url.indexOf(base) !== 0) { res.writeHead(404); return res.end('Not found (app is served under ' + base + ')'); }
  let rel = url.slice(base.length) || 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(ROOT, rel));
  if (file.indexOf(ROOT) !== 0 || /(^|[\\/])(node_modules|\.git)([\\/]|$)/.test(path.relative(ROOT, file))) { res.writeHead(403); return res.end(); }
  fs.readFile(file, function (err, data) {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': rel === 'sw.js' ? 'no-cache' : 'max-age=0'
    });
    res.end(data);
  });
}).listen(port, function () { console.log('English Coach: http://localhost:' + port + base + '  (Ctrl+C to stop)'); });
