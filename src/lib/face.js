import { getFaceLandmarker } from './mp.js';

// Landmark indices (MediaPipe 478-point face mesh)
const IDX = {
  top: 10,
  chin: 152,
  cheekL: 234,
  cheekR: 454,
  jawL: 172,
  jawR: 397,
  foreL: 54,
  foreR: 284,
  nose: 1,
  eyeL: 33,
  eyeR: 263,
};

export const SHAPES = {
  oval: {
    label: 'Oval',
    blurb: 'Balanced proportions with a gently curved jaw. The most versatile shape: most cuts work, so pick by vibe.',
  },
  round: {
    label: 'Round',
    blurb: 'Face length and width are close, with soft edges. Height on top and clean sides add definition.',
  },
  square: {
    label: 'Square',
    blurb: 'A strong, angular jaw and a broad forehead. Texture and softer tops balance the sharp lines.',
  },
  oblong: {
    label: 'Oblong',
    blurb: 'Longer than wide with a straight cheek line. Fringes and side volume shorten and widen the look.',
  },
  heart: {
    label: 'Heart',
    blurb: 'A wider forehead tapering to a narrower chin. Fringes and fuller lengths balance the top.',
  },
  diamond: {
    label: 'Diamond',
    blurb: 'Prominent cheekbones with a narrower forehead and jaw. Fringes and volume at the temples soften it.',
  },
};

// Prototype ratios: [length/cheek, forehead/cheek, jaw/cheek]
const PROTOS = {
  oval: [1.36, 0.86, 0.74],
  round: [1.16, 0.86, 0.8],
  square: [1.2, 0.88, 0.9],
  oblong: [1.52, 0.86, 0.78],
  heart: [1.34, 0.95, 0.66],
  diamond: [1.36, 0.74, 0.68],
};
const WEIGHTS = [1.6, 1.0, 1.2];

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export async function analyzeFace(canvas) {
  const lm = await getFaceLandmarker();
  const res = lm.detect(canvas);
  const face = res.faceLandmarks?.[0];
  if (!face) throw new Error('NO_FACE');

  const W = canvas.width;
  const H = canvas.height;
  const P = (i) => ({ x: face[i].x * W, y: face[i].y * H });
  const p = Object.fromEntries(Object.entries(IDX).map(([k, i]) => [k, P(i)]));

  const length = dist(p.top, p.chin);
  const cheek = dist(p.cheekL, p.cheekR);
  const jaw = dist(p.jawL, p.jawR);
  const fore = dist(p.foreL, p.foreR);

  const ratios = {
    length: length / cheek,
    forehead: fore / cheek,
    jaw: jaw / cheek,
  };

  // Score each shape by weighted distance to its prototype
  const vec = [ratios.length, ratios.forehead, ratios.jaw];
  const raw = Object.entries(PROTOS).map(([shape, proto]) => {
    const d2 = proto.reduce((s, v, i) => s + WEIGHTS[i] * (vec[i] - v) ** 2, 0);
    return [shape, Math.exp(-d2 / 0.02)];
  });
  const total = raw.reduce((s, [, v]) => s + v, 0) || 1;
  const scores = raw
    .map(([shape, v]) => ({ shape, pct: Math.round((v / total) * 100) }))
    .sort((a, b) => b.pct - a.pct);

  // Photo quality checks
  const yaw = (dist(p.nose, p.cheekL) - dist(p.nose, p.cheekR)) / cheek;
  const tilt = Math.abs(Math.atan2(p.eyeR.y - p.eyeL.y, p.eyeR.x - p.eyeL.x)) * (180 / Math.PI);
  const warnings = [];
  if (Math.abs(yaw) > 0.18) warnings.push('Your face is turned. Look straight at the camera for a more accurate read.');
  if (tilt > 8) warnings.push('Your head looks tilted. Keep it level.');
  if (cheek / W < 0.25) warnings.push('Your face is small in the frame. Move closer.');

  // Points (normalized) for the overlay
  const norm = (pt) => ({ x: pt.x / W, y: pt.y / H });
  const pts = Object.fromEntries(Object.entries(p).map(([k, v]) => [k, norm(v)]));

  return { shape: scores[0].shape, scores, ratios, pts, warnings, confidence: scores[0].pct };
}

export function explainRatios(r) {
  return [
    { label: 'Face length', hint: 'vs. cheek width', value: r.length, min: 1.05, max: 1.7 },
    { label: 'Forehead width', hint: 'vs. cheek width', value: r.forehead, min: 0.6, max: 1.05 },
    { label: 'Jaw width', hint: 'vs. cheek width', value: r.jaw, min: 0.55, max: 1.0 },
  ];
}
