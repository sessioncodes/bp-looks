import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

mkdirSync('public/icons', { recursive: true });

// Face-outline mark on a dark tile. `pad` shrinks the mark for maskable icons.
const svg = (pad = 0) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#07070a"/>
  <defs><radialGradient id="g" cx="30%" cy="20%" r="80%"><stop offset="0" stop-color="#7c5cff" stop-opacity=".55"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></radialGradient></defs>
  <rect width="512" height="512" fill="url(#g)"/>
  <g transform="translate(256 256) scale(${1 - pad}) translate(-256 -256)">
    <path d="M256 92c-72 0-118 52-118 126 0 84 46 178 118 202 72-24 118-118 118-202 0-74-46-126-118-126Z" fill="none" stroke="#d4ff3f" stroke-width="18" stroke-linejoin="round"/>
    <path d="M256 128v268M164 226h184M188 330h136" stroke="#d4ff3f" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/>
    <circle cx="256" cy="128" r="12" fill="#fff"/><circle cx="256" cy="396" r="12" fill="#fff"/>
  </g>
</svg>`;

const out = async (name, size, pad = 0) =>
  sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(`public/icons/${name}`);

await out('icon-192.png', 192);
await out('icon-512.png', 512);
await out('icon-512-maskable.png', 512, 0.2);
await out('apple-touch-icon.png', 180);
console.log('icons done');
