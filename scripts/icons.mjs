import sharp from 'sharp';
import { mkdirSync, readFileSync } from 'node:fs';

mkdirSync('public/icons', { recursive: true });

const logo = readFileSync('public/logo.svg', 'utf8');

// Maskable icons need the mark inside the central safe zone, so shrink it.
const padded = (scale) =>
  logo.replace(/(<rect[^>]*\/>)([\s\S]*)(<\/svg>)/, (_, rect, mark, end) => `${rect}<g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${mark}</g>${end}`);

const out = (name, size, svg = logo) => sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/icons/${name}`);

await out('icon-192.png', 192);
await out('icon-512.png', 512);
await out('icon-512-maskable.png', 512, padded(0.78));
await out('apple-touch-icon.png', 180);
console.log('icons done');
