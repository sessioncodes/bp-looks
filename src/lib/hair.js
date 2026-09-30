import { getHairSegmenter } from './mp.js';

// Returns a soft per-pixel hair alpha (0-1) at the source canvas size.
export async function segmentHair(src) {
  const seg = await getHairSegmenter();
  let maskData = null;
  let mw = 0;
  let mh = 0;
  seg.segment(src, (res) => {
    const m = res.categoryMask;
    mw = m.width;
    mh = m.height;
    maskData = new Uint8Array(m.getAsUint8Array());
  });
  if (!maskData) throw new Error('SEGMENT_FAILED');

  // Hair segmenter: category 1 = hair (0 = background).
  const raw = document.createElement('canvas');
  raw.width = mw;
  raw.height = mh;
  const rctx = raw.getContext('2d');
  const img = rctx.createImageData(mw, mh);
  let hairPx = 0;
  for (let i = 0; i < maskData.length; i++) {
    const on = maskData[i] > 0;
    if (on) hairPx++;
    img.data[i * 4 + 3] = on ? 255 : 0;
  }
  rctx.putImageData(img, 0, 0);

  // Upscale with a slight blur so edges blend
  const soft = document.createElement('canvas');
  soft.width = src.width;
  soft.height = src.height;
  const sctx = soft.getContext('2d', { willReadFrequently: true });
  sctx.filter = 'blur(2px)';
  sctx.drawImage(raw, 0, 0, soft.width, soft.height);
  const px = sctx.getImageData(0, 0, soft.width, soft.height).data;
  const alpha = new Float32Array(soft.width * soft.height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = px[i * 4 + 3] / 255;

  return { alpha, coverage: hairPx / maskData.length };
}

// The color and haircut try-ons both need the mask; compute it once per photo.
const cache = new WeakMap();
export function segmentHairCached(src) {
  if (!cache.has(src)) cache.set(src, segmentHair(src));
  return cache.get(src);
}

export const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Precomputes the hair pixels once; the returned function recolors them fast
// enough to animate between colors.
export function createRecolor(src, alpha) {
  const w = src.width;
  const h = src.height;
  const base = src.getContext('2d').getImageData(0, 0, w, h).data;
  const list = [];
  for (let i = 0; i < alpha.length; i++) if (alpha[i] > 0.02) list.push(i);
  const idx = Int32Array.from(list);
  const out = new ImageData(new Uint8ClampedArray(base), w, h);
  const d = out.data;

  return (rgb, strength) => {
    const [tr, tg, tb] = rgb;
    const tl = (0.299 * tr + 0.587 * tg + 0.114 * tb) / 255;
    const m = 1.5 * (0.35 + tl * 0.9);
    for (let j = 0; j < idx.length; j++) {
      const i = idx[j];
      const o = i * 4;
      const a = alpha[i] * strength;
      const r0 = base[o];
      const g0 = base[o + 1];
      const b0 = base[o + 2];
      // keep the original light/shadow detail, shift the hue
      const k = 0.25 + ((0.299 * r0 + 0.587 * g0 + 0.114 * b0) / 255) * m;
      d[o] = r0 + (Math.min(255, tr * k) - r0) * a;
      d[o + 1] = g0 + (Math.min(255, tg * k) - g0) * a;
      d[o + 2] = b0 + (Math.min(255, tb * k) - b0) * a;
    }
    return out;
  };
}
