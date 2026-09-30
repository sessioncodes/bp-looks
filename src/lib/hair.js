import { getHairSegmenter } from './mp.js';

// Returns a soft alpha mask (canvas, same size as source) of the hair region.
export async function segmentHair(srcCanvas) {
  const seg = await getHairSegmenter();
  let maskData = null;
  let mw = 0;
  let mh = 0;
  seg.segment(srcCanvas, (res) => {
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

  const soft = document.createElement('canvas');
  soft.width = srcCanvas.width;
  soft.height = srcCanvas.height;
  const sctx = soft.getContext('2d');
  sctx.filter = 'blur(2px)';
  sctx.drawImage(raw, 0, 0, soft.width, soft.height);
  return { mask: soft, coverage: hairPx / maskData.length };
}

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Recolor hair while keeping the original light/shadow detail.
export function renderColor(out, src, mask, hex, strength) {
  const w = src.width;
  const h = src.height;
  out.width = w;
  out.height = h;
  const ctx = out.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(src, 0, 0);
  if (!hex || strength <= 0) return;

  const base = ctx.getImageData(0, 0, w, h);
  const m = mask.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
  const [tr, tg, tb] = hexToRgb(hex);
  const d = base.data;
  const tl = (0.299 * tr + 0.587 * tg + 0.114 * tb) / 255;

  for (let i = 0; i < d.length; i += 4) {
    const a = (m[i + 3] / 255) * strength;
    if (a <= 0) continue;
    const lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    // shift luminance toward the target's brightness, keep texture
    const k = 0.25 + lum * 1.5 * (0.35 + tl * 0.9);
    d[i] += (Math.min(255, tr * k) - d[i]) * a;
    d[i + 1] += (Math.min(255, tg * k) - d[i + 1]) * a;
    d[i + 2] += (Math.min(255, tb * k) - d[i + 2]) * a;
  }
  ctx.putImageData(base, 0, 0);
}
