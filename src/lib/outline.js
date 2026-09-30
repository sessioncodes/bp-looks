// Stylized face outlines for each shape, used by the morphing illustration.
// Each entry: [top y, right-side points [dx, y] from forehead to chin corner, chin y]
// in a 200 x 244 box centered at x = 100. Every shape has the same point count so they can morph.
const R = {
  oval: [20, [[48, 38], [66, 80], [70, 120], [58, 172], [34, 208]], 222],
  round: [30, [[55, 42], [76, 82], [80, 120], [72, 160], [46, 196]], 210],
  square: [28, [[64, 34], [75, 70], [76, 120], [74, 174], [58, 204]], 212],
  oblong: [8, [[44, 24], [58, 70], [60, 122], [56, 186], [34, 224]], 236],
  heart: [26, [[64, 36], [78, 78], [72, 122], [50, 170], [24, 206]], 220],
  diamond: [22, [[34, 40], [62, 82], [82, 122], [56, 170], [28, 206]], 220],
};

const cache = {};

export function outlinePoints(shape) {
  if (cache[shape]) return cache[shape];
  const [top, side, chin] = R[shape];
  const cx = 100;
  const right = side.map(([x, y]) => [cx + x, y]);
  const left = side
    .slice()
    .reverse()
    .map(([x, y]) => [cx - x, y]);
  return (cache[shape] = [[cx, top], ...right, [cx, chin], ...left]);
}

// Named points in the 12-point outline
export const P = { top: 0, foreR: 1, cheekR: 3, jawR: 4, chin: 6, jawL: 8, cheekL: 9, foreL: 11 };

// Closed Catmull-Rom spline through the points, as an SVG path.
export function toPath(pts) {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}
