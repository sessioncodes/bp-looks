// Dev tool: scores Unsplash candidates for each haircut and builds the hair
// overlay assets used by the in-app try-on. Run with `npm run dev` and open
// /tools/hair.html. Stage 1 (default) shows a scored contact sheet;
// window.best() lists the top candidates; window.build({ styleId: [i, ...] }) processes picks.
import { FilesetResolver, FaceLandmarker, ImageSegmenter } from '@mediapipe/tasks-vision';

const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const log = (m) => (document.getElementById('log').textContent = m);

const vision = await FilesetResolver.forVisionTasks(WASM);
const face = await FaceLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
    delegate: 'GPU',
  },
  runningMode: 'IMAGE',
  numFaces: 3,
});
const hairSeg = await ImageSegmenter.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/latest/hair_segmenter.tflite',
    delegate: 'GPU',
  },
  runningMode: 'IMAGE',
  outputCategoryMask: true,
  outputConfidenceMasks: false,
});

// Merge both candidate lists, de-duplicated per style
const CANDS = {};
for (const file of ['./candidates.txt', './candidates2.txt']) {
  const text = await (await fetch(file)).text();
  for (const line of text.trim().split(/\r?\n/)) {
    const [id, rest] = line.split('=');
    const list = (CANDS[id] ??= []);
    for (const s of rest.split('|')) {
      const [path, by] = s.split('~');
      if (!list.some((c) => c.path === path)) list.push({ path, by });
    }
  }
}

const src = (path, w) => `https://images.unsplash.com/${path}?w=${w}&q=85&fm=jpg`;

function loadImg(url) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = url;
  });
}

function toCanvas(im) {
  const c = document.createElement('canvas');
  c.width = im.naturalWidth;
  c.height = im.naturalHeight;
  c.getContext('2d').drawImage(im, 0, 0);
  return c;
}

function hairMask(c) {
  let data, w, h;
  hairSeg.segment(c, (r) => {
    w = r.categoryMask.width;
    h = r.categoryMask.height;
    data = new Uint8Array(r.categoryMask.getAsUint8Array());
  });
  return { data, w, h };
}

const avg = (lm, ids) => ({ x: ids.reduce((s, i) => s + lm[i].x, 0) / ids.length, y: ids.reduce((s, i) => s + lm[i].y, 0) / ids.length });

function analyze(c) {
  const r = face.detect(c);
  const faces = r.faceLandmarks || [];
  if (!faces.length) return { score: 0, why: 'no face' };
  const lm = faces[0];
  const W = c.width;
  const H = c.height;
  const px = (i) => ({ x: lm[i].x * W, y: lm[i].y * H });
  const cheekL = px(234);
  const cheekR = px(454);
  const nose = px(1);
  const cw = Math.hypot(cheekR.x - cheekL.x, cheekR.y - cheekL.y);
  const yaw = Math.abs(Math.hypot(nose.x - cheekL.x, nose.y - cheekL.y) - Math.hypot(nose.x - cheekR.x, nose.y - cheekR.y)) / cw;
  const eL = avg(lm, [33, 133]);
  const eR = avg(lm, [263, 362]);
  const tilt = Math.abs(Math.atan2((eR.y - eL.y) * H, (eR.x - eL.x) * W)) * 57.3;
  const size = cw / W;
  const top = lm[10].y;
  const m = hairMask(c);
  // hair pixels above the forehead landmark
  let above = 0;
  const topRow = Math.floor(top * m.h);
  for (let y = 0; y < topRow; y++) for (let x = 0; x < m.w; x++) if (m.data[y * m.w + x]) above++;
  const hairAbove = above / (m.w * m.h);

  let score = 1;
  const why = [];
  if (faces.length > 1) (score *= 0.3), why.push('multi');
  if (yaw > 0.12) (score *= Math.max(0.05, 1 - (yaw - 0.12) * 5)), why.push('yaw ' + yaw.toFixed(2));
  if (tilt > 6) (score *= Math.max(0.1, 1 - (tilt - 6) / 15)), why.push('tilt ' + tilt.toFixed(0));
  if (size < 0.28) (score *= Math.max(0.1, size / 0.28)), why.push('small ' + size.toFixed(2));
  if (top < 0.12) (score *= 0.3), why.push('cropped top');
  if (hairAbove < 0.01) (score *= 0.4), why.push('little hair');
  return { score, why: why.join(', ') || 'ok', yaw, size };
}

async function stage1() {
  const out = document.getElementById('out');
  const results = {};
  const ids = Object.keys(CANDS);
  for (const [n, id] of ids.entries()) {
    results[id] = [];
    const row = document.createElement('div');
    row.className = 'row';
    const title = document.createElement('h2');
    title.textContent = id;
    out.append(title, row);
    for (const [i, c] of CANDS[id].entries()) {
      log(`scoring ${id} (${n + 1}/${ids.length}) ${i + 1}/${CANDS[id].length}`);
      let a;
      try {
        const im = await loadImg(src(c.path, 512));
        a = analyze(toCanvas(im));
      } catch (e) {
        a = { score: 0, why: 'load error' };
      }
      results[id].push({ i, ...a });
      const el = document.createElement('div');
      el.className = 'c' + (a.score < 0.5 ? ' bad' : '');
      el.dataset.style = id;
      el.dataset.i = i;
      el.innerHTML = `<img src="${src(c.path, 240)}"><b>${i} · ${a.score.toFixed(2)}</b><i>${a.why}</i>`;
      row.append(el);
    }
    // best first
    [...row.children].sort((x, y) => results[id][y.dataset.i].score - results[id][x.dataset.i].score).forEach((el) => row.append(el));
  }
  window.__scores = results;
  log('done scoring');
}

/* ---------- stage 2: build assets ---------- */

async function post(path, blob) {
  const r = await fetch('/__save?path=' + encodeURIComponent(path), { method: 'POST', body: blob });
  if (!r.ok) throw new Error('save failed ' + path);
}

const toBlob = (c, type, q) => new Promise((r) => c.toBlob(r, type, q));

async function buildOne(id, cand) {
  const im = await loadImg(src(cand.path, 1080));
  const c = toCanvas(im);
  const W = c.width;
  const H = c.height;
  const lm = face.detect(c).faceLandmarks[0];
  const m = hairMask(c);

  // Soft hair alpha at full size
  const raw = document.createElement('canvas');
  raw.width = m.w;
  raw.height = m.h;
  const rctx = raw.getContext('2d');
  const id0 = rctx.createImageData(m.w, m.h);
  for (let i = 0; i < m.data.length; i++) id0.data[i * 4 + 3] = m.data[i] ? 255 : 0;
  rctx.putImageData(id0, 0, 0);
  const alpha = document.createElement('canvas');
  alpha.width = W;
  alpha.height = H;
  const actx = alpha.getContext('2d');
  actx.filter = 'blur(1.5px)';
  actx.drawImage(raw, 0, 0, W, H);

  // Cut the hair out
  const cut = document.createElement('canvas');
  cut.width = W;
  cut.height = H;
  const cctx = cut.getContext('2d');
  cctx.drawImage(c, 0, 0);
  cctx.globalCompositeOperation = 'destination-in';
  cctx.drawImage(alpha, 0, 0);

  // Crop to the hair bounding box
  const ad = cctx.getImageData(0, 0, W, H).data;
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (ad[(y * W + x) * 4 + 3] > 20) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  const pad = 8;
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(W, x1 + pad);
  y1 = Math.min(H, y1 + pad);
  const cw = x1 - x0;
  const ch = y1 - y0;
  const crop = document.createElement('canvas');
  crop.width = cw;
  crop.height = ch;
  crop.getContext('2d').drawImage(cut, x0, y0, cw, ch, 0, 0, cw, ch);

  // Anchors in crop pixel coordinates
  const P = (p) => [Math.round((p.x * W - x0) * 10) / 10, Math.round((p.y * H - y0) * 10) / 10];
  const anchors = {
    eyeL: P(avg(lm, [33, 133])),
    eyeR: P(avg(lm, [263, 362])),
    chin: P(lm[152]),
  };

  // Thumbnail: square around the head
  const fx = [234, 454].map((i) => lm[i].x * W);
  const faceW = fx[1] - fx[0];
  const cx = (fx[0] + fx[1]) / 2;
  const cy = ((lm[10].y + lm[152].y) / 2) * H - faceW * 0.12;
  const side = Math.min(W, H, faceW * 2.1);
  const sx = Math.max(0, Math.min(W - side, cx - side / 2));
  const sy = Math.max(0, Math.min(H - side, cy - side / 2));
  const thumb = document.createElement('canvas');
  thumb.width = thumb.height = 480;
  thumb.getContext('2d').drawImage(c, sx, sy, side, side, 0, 0, 480, 480);

  await post(`hair/${id}.webp`, await toBlob(crop, 'image/webp', 0.86));
  await post(`cuts/${id}.jpg`, await toBlob(thumb, 'image/jpeg', 0.82));
  return { w: cw, h: ch, anchors, by: cand.by, photo: cand.path.replace(/^flagged\//, '') };
}

// picks: { styleId: [candidateIndex, ...] } -> several reference models per cut
window.build = async (picks) => {
  const meta = {};
  for (const [id, list] of Object.entries(picks)) {
    meta[id] = [];
    for (const [v, i] of list.entries()) {
      log(`building ${id} #${v}`);
      meta[id].push(await buildOne(`${id}-${v}`, CANDS[id][i]));
    }
  }
  await post('hair/meta.json', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  log('built ' + Object.keys(meta).length + ' styles');
  return meta;
};

// Compact ranking: best candidates per style
window.best = (n = 8) =>
  Object.fromEntries(
    Object.entries(window.__scores).map(([id, r]) => [
      id,
      r
        .filter((x) => x.score >= 0.5)
        .sort((a, b) => b.score - a.score)
        .slice(0, n)
        .map((x) => x.i),
    ])
  );

window.CANDS = CANDS;
stage1();
