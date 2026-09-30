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
    short: 'Slightly longer than wide, soft jaw',
    blurb: 'A little longer than it is wide, with a softly rounded jaw. Almost any cut works on you, so go with what you like.',
  },
  round: {
    label: 'Round',
    short: 'Even length and width, soft angles',
    blurb: 'About as wide as it is long, with soft angles. Some height on top and shorter sides will add shape.',
  },
  square: {
    label: 'Square',
    short: 'Strong jaw, straight sides',
    blurb: 'Strong jaw, wide forehead, fairly straight sides. A bit of texture on top keeps it from looking boxy.',
  },
  oblong: {
    label: 'Oblong',
    short: 'Long and narrow, straight cheeks',
    blurb: 'Noticeably longer than it is wide. Skip the big height on top; a fringe or fuller sides balance it out.',
  },
  heart: {
    label: 'Heart',
    short: 'Wide forehead, narrow chin',
    blurb: 'Wider at the forehead, narrowing down to the chin. A fringe or some length around the jaw evens it out.',
  },
  diamond: {
    label: 'Diamond',
    short: 'Wide cheekbones, narrow top and chin',
    blurb: 'Your cheekbones are the widest point, with a narrower forehead and chin. A fringe or fuller sides work well.',
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
  if (Math.abs(yaw) > 0.18) warnings.push("You're turned a little to the side. A straight-on photo gives a better read.");
  if (tilt > 8) warnings.push("Your head's tilted. Try holding it level.");
  if (cheek / W < 0.25) warnings.push("You're a bit far from the camera. Get closer for a better read.");

  // Points (normalized) for the overlay
  const norm = (pt) => ({ x: pt.x / W, y: pt.y / H });
  const pts = Object.fromEntries(Object.entries(p).map(([k, v]) => [k, norm(v)]));

  const mesh = face.map((q) => [q.x, q.y]);

  return { shape: scores[0].shape, scores, ratios, pts, mesh, warnings, confidence: scores[0].pct };
}

export function explainRatios(r) {
  return [
    { label: 'Face length', hint: 'Compared to your cheek width', value: r.length, min: 1.05, max: 1.7 },
    { label: 'Forehead', hint: 'Compared to your cheek width', value: r.forehead, min: 0.6, max: 1.05 },
    { label: 'Jaw', hint: 'Compared to your cheek width', value: r.jaw, min: 0.55, max: 1.0 },
  ];
}
