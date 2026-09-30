// On-device haircut try-on. Nothing here leaves the phone: the user's hair is
// removed with the local hair segmenter, and a pre-cut reference hairstyle is
// aligned to their eyes and chin.
import { segmentHairCached } from './hair.js';

let metaP;
export const loadMeta = () => (metaP ??= fetch('/hair/meta.json').then((r) => (r.ok ? r.json() : {})).catch(() => ({})));

const imgs = {};
export const loadHairImage = (key) =>
  (imgs[key] ??= new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = `/hair/${key}.webp`;
  }));

const canvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const eyeAvg = (mesh, ids, W, H) => [ids.reduce((s, i) => s + mesh[i][0], 0) / ids.length * W, ids.reduce((s, i) => s + mesh[i][1], 0) / ids.length * H];

// Fill the hair area from its surroundings: blur the photo with the hair cut
// out at several scales, coarse first, so holes take on nearby colors.
function inpaint(photo, hole) {
  const w = photo.width;
  const h = photo.height;
  const out = canvas(w, h);
  const octx = out.getContext('2d');
  for (const s of [1 / 16, 1 / 8, 1 / 4, 1 / 2]) {
    const sw = Math.max(1, Math.round(w * s));
    const sh = Math.max(1, Math.round(h * s));
    const small = canvas(sw, sh);
    const sctx = small.getContext('2d');
    sctx.filter = 'blur(3px)';
    sctx.drawImage(hole, 0, 0, sw, sh);
    // Re-drawing a semi-transparent layer pushes its alpha toward 1 while
    // keeping its (normalized) color, which fills the hole smoothly.
    for (let k = 0; k < 6; k++) octx.drawImage(small, 0, 0, w, h);
  }
  octx.drawImage(hole, 0, 0);
  return out;
}

function meanColor(photo, alpha) {
  const d = photo.getContext('2d').getImageData(0, 0, photo.width, photo.height).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < alpha.length; i += 3) {
    if (alpha[i] < 0.6) continue;
    const o = i * 4;
    r += d[o];
    g += d[o + 1];
    b += d[o + 2];
    n++;
  }
  return n > 400 ? [r / n, g / n, b / n] : null;
}

// Once per photo: hair-free base image, face anchors, and current hair color.
const prepared = new WeakMap();
export function prepareUser(photo, mesh) {
  if (prepared.has(photo)) return prepared.get(photo);
  const p = (async () => {
    const { alpha } = await segmentHairCached(photo);
    const w = photo.width;
    const h = photo.height;

    // Hair mask, grown a little so no stray strands are left at the edges
    const m = canvas(w, h);
    const mctx = m.getContext('2d');
    const md = mctx.createImageData(w, h);
    for (let i = 0; i < alpha.length; i++) md.data[i * 4 + 3] = alpha[i] > 0.25 ? 255 : 0;
    mctx.putImageData(md, 0, 0);
    const grown = canvas(w, h);
    const gctx = grown.getContext('2d');
    gctx.filter = `blur(${Math.round(w / 140)}px)`;
    for (let k = 0; k < 3; k++) gctx.drawImage(m, 0, 0);

    const hole = canvas(w, h);
    const hctx = hole.getContext('2d');
    hctx.drawImage(photo, 0, 0);
    hctx.globalCompositeOperation = 'destination-out';
    hctx.drawImage(grown, 0, 0);

    return {
      base: inpaint(photo, hole),
      eyeL: eyeAvg(mesh, [33, 133], w, h),
      eyeR: eyeAvg(mesh, [263, 362], w, h),
      chin: [mesh[152][0] * w, mesh[152][1] * h],
      hairRgb: meanColor(photo, alpha),
    };
  })();
  prepared.set(photo, p);
  return p;
}

// Tint the reference hair toward a color while keeping its light and shadow.
const tinted = new Map();
function tint(img, key, rgb) {
  const id = key + rgb.map(Math.round).join(',');
  if (tinted.has(id)) return tinted.get(id);
  const c = canvas(img.width, img.height);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, c.width, c.height);
  const d = data.data;
  // average luminance of the reference hair, to preserve relative shading
  let sum = 0, n = 0;
  for (let o = 0; o < d.length; o += 4) if (d[o + 3] > 128) (sum += 0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2]), n++;
  const refL = n ? sum / n : 80;
  const tL = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  for (let o = 0; o < d.length; o += 4) {
    if (!d[o + 3]) continue;
    const L = 0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2];
    const k = Math.min(2.2, (L / refL) * (tL / Math.max(tL, 1)));
    const s = 0.8;
    d[o] += (Math.min(255, rgb[0] * k) - d[o]) * s;
    d[o + 1] += (Math.min(255, rgb[1] * k) - d[o + 1]) * s;
    d[o + 2] += (Math.min(255, rgb[2] * k) - d[o + 2]) * s;
  }
  ctx.putImageData(data, 0, 0);
  tinted.set(id, c);
  return c;
}

// Draws the user's photo wearing the reference hairstyle into `out`.
export async function renderTryOn(out, photo, user, variantKey, ref, { matchColor }) {
  const img = await loadHairImage(variantKey);
  out.width = photo.width;
  out.height = photo.height;
  const ctx = out.getContext('2d');
  ctx.drawImage(user.base, 0, 0);

  const a = ref.anchors;
  const rMid = mid(a.eyeL, a.eyeR);
  const uMid = mid(user.eyeL, user.eyeR);
  const rAng = Math.atan2(a.eyeR[1] - a.eyeL[1], a.eyeR[0] - a.eyeL[0]);
  const uAng = Math.atan2(user.eyeR[1] - user.eyeL[1], user.eyeR[0] - user.eyeL[0]);
  const rEye = Math.hypot(a.eyeR[0] - a.eyeL[0], a.eyeR[1] - a.eyeL[1]);
  const uEye = Math.hypot(user.eyeR[0] - user.eyeL[0], user.eyeR[1] - user.eyeL[1]);
  const rLen = Math.hypot(a.chin[0] - rMid[0], a.chin[1] - rMid[1]);
  const uLen = Math.hypot(user.chin[0] - uMid[0], user.chin[1] - uMid[1]);
  const sx = uEye / rEye;
  // follow the face's length a little, but never stretch the hair much
  const sy = sx * Math.max(0.9, Math.min(1.1, uLen / rLen / sx));

  const src = matchColor && user.hairRgb ? tint(img, variantKey, user.hairRgb) : img;
  ctx.save();
  ctx.translate(uMid[0], uMid[1]);
  ctx.rotate(uAng);
  ctx.scale(sx, sy);
  ctx.rotate(-rAng);
  ctx.translate(-rMid[0], -rMid[1]);
  // soft contact shadow so the hair sits on the head instead of floating
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 10 / sx;
  ctx.drawImage(src, 0, 0);
  ctx.restore();
}
