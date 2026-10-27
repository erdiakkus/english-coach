#!/usr/bin/env node
/* Generate the app icons with no dependencies: a teal rounded square with the letters "EC".
   Usage: node tools/make-icons.js   (writes icons/*.png and favicon.ico) */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const TEAL = [15, 118, 110], WHITE = [255, 255, 255];
const OUT = path.join(__dirname, '..', 'icons');

/* ---------- PNG writer (RGBA, 8 bit) ---------- */
const CRC = (function () {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4); }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}
function ico(images) {
  const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(function (im) {
    const e = Buffer.alloc(16);
    e[0] = im.size >= 256 ? 0 : im.size; e[1] = im.size >= 256 ? 0 : im.size;
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(im.data.length, 8); e.writeUInt32LE(offset, 12);
    offset += im.data.length;
    return e;
  });
  return Buffer.concat([head].concat(entries, images.map(function (im) { return im.data; })));
}

/* ---------- shapes in unit coordinates (0..1) ---------- */
function inRoundRect(x, y, r) {
  const cx = Math.min(Math.max(x, r), 1 - r), cy = Math.min(Math.max(y, r), 1 - r);
  return (x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r;
}
function inLetters(x, y) {
  const s = 0.085;
  const inE = (x >= 0.16 && x <= 0.16 + s && y >= 0.30 && y <= 0.70) ||
    (x >= 0.16 && x <= 0.40 && ((y >= 0.30 && y <= 0.30 + s) || (y >= 0.70 - s && y <= 0.70))) ||
    (x >= 0.16 && x <= 0.37 && y >= 0.5 - s / 2 && y <= 0.5 + s / 2);
  if (inE) return true;
  const dx = x - 0.64, dy = y - 0.5, d = Math.sqrt(dx * dx + dy * dy);
  return d <= 0.20 && d >= 0.20 - s && !(dx > 0 && Math.abs(dy) < dx * 0.9);
}
/* full: square to the edges (maskable, apple). scale < 1 shrinks the letters into the maskable safe zone. */
function render(size, opts) {
  const SS = 4, buf = Buffer.alloc(size * size * 4);
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    let bg = 0, fg = 0;
    for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
      const x = (px + (sx + 0.5) / SS) / size, y = (py + (sy + 0.5) / SS) / size;
      if (opts.full || inRoundRect(x, y, 0.22)) {
        bg++;
        if (inLetters(0.5 + (x - 0.5) / opts.scale, 0.5 + (y - 0.5) / opts.scale)) fg++;
      }
    }
    const n = SS * SS, i = (py * size + px) * 4, f = bg ? fg / bg : 0;
    for (let c = 0; c < 3; c++) buf[i + c] = Math.round(TEAL[c] * (1 - f) + WHITE[c] * f);
    buf[i + 3] = Math.round(255 * bg / n);
  }
  return png(size, buf);
}

fs.mkdirSync(OUT, { recursive: true });
const files = {
  'icon-192.png': render(192, { scale: 1 }),
  'icon-512.png': render(512, { scale: 1 }),
  'icon-maskable-512.png': render(512, { full: true, scale: 0.78 }),
  'apple-touch-icon.png': render(180, { full: true, scale: 0.9 }),
  'favicon-32.png': render(32, { scale: 1 })
};
Object.keys(files).forEach(function (f) { fs.writeFileSync(path.join(OUT, f), files[f]); console.log('icons/' + f + '  ' + files[f].length + ' bytes'); });
const favicon = ico([16, 32, 48].map(function (s) { return { size: s, data: render(s, { scale: 1 }) }; }));
fs.writeFileSync(path.join(__dirname, '..', 'favicon.ico'), favicon);
console.log('favicon.ico  ' + favicon.length + ' bytes');
