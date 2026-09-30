import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { Button, EmptyState, FitBars, Icon, Screen, Segmented } from '../components.jsx';
import { HAIR_COLORS, recommend, STYLES } from '../lib/styles.js';
import { createRecolor, hexToRgb, segmentHairCached } from '../lib/hair.js';
import { loadMeta, prepareUser, renderTryOn } from '../lib/tryon.js';
import { toast } from '../lib/store.js';
import { HAIRCUT_TRYON } from '../lib/flags.js';

/* ---------- before / after slider ---------- */

function Compare({ photo, after, version, ready, loadingText }) {
  const box = useRef(null);
  const orig = useRef(null);
  const vis = useRef(null);
  const dragging = useRef(false);
  const hinted = useRef(false);
  const [pos, setPos] = useState(100);

  useEffect(() => {
    const c = orig.current;
    c.width = photo.width;
    c.height = photo.height;
    c.getContext('2d').drawImage(photo, 0, 0);
  }, [photo]);

  useEffect(() => {
    if (!after) return;
    const c = vis.current;
    if (c.width !== after.width || c.height !== after.height) {
      c.width = after.width;
      c.height = after.height;
    }
    c.getContext('2d').drawImage(after, 0, 0);
  }, [after, version]);

  // Slide the divider in once, the first time a result shows
  useEffect(() => {
    if (!ready || hinted.current) return;
    hinted.current = true;
    const a = animate(100, 50, { duration: 1.1, delay: 0.25, ease: [0.3, 0.9, 0.2, 1], onUpdate: setPos });
    return () => a.stop();
  }, [ready]);

  const move = (e) => {
    const r = box.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className={'compare' + (ready ? ' ready' : '')}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      onPointerDown={(e) => {
        if (!ready) return;
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={(e) => dragging.current && move(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <canvas ref={orig} />
      <canvas ref={vis} className="after" style={{ clipPath: `inset(0 0 0 ${ready ? pos : 100}%)` }} />
      {ready && (
        <>
          <div className="divider" style={{ left: pos + '%' }}>
            <span className="knob">
              <Icon name="sliders" size={16} stroke={2.2} />
            </span>
          </div>
          <span className="ba left" style={{ opacity: pos > 14 ? 1 : 0 }}>
            Before
          </span>
          <span className="ba right" style={{ opacity: pos < 86 ? 1 : 0 }}>
            After
          </span>
        </>
      )}
      <AnimatePresence>
        {loadingText && (
          <motion.span className="pill" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span className="spinner" /> {loadingText}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

async function saveCanvas(c, name) {
  const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.92));
  const file = new File([blob], name, { type: 'image/jpeg' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
    } catch {}
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('Image saved');
}

function Switch({ on, onChange, label }) {
  return (
    <button className="switch-row" onClick={() => onChange(!on)} role="switch" aria-checked={on}>
      <span>{label}</span>
      <span className={'switch' + (on ? ' on' : '')}>
        <motion.i layout transition={{ type: 'spring', stiffness: 700, damping: 35 }} />
      </span>
    </button>
  );
}

/* ---------- haircut try-on ---------- */

function CutMode({ photo, analysis, cut, setCut }) {
  const after = useRef(document.createElement('canvas'));
  const [version, setVersion] = useState(0);
  const [meta, setMeta] = useState(null);
  const [user, setUser] = useState(null);
  const [failed, setFailed] = useState(false);
  const [variant, setVariant] = useState(0);
  const [match, setMatch] = useState(true);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    loadMeta().then(setMeta);
  }, []);

  useEffect(() => {
    let live = true;
    setUser(null);
    prepareUser(photo, analysis.mesh)
      .then((u) => live && setUser(u))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [photo, analysis]);

  const list = useMemo(() => (meta ? recommend(analysis.shape, {}).filter((s) => meta[s.id]?.length) : []), [meta, analysis]);
  const current = cut && meta?.[cut] ? cut : list[0]?.id;
  const refs = current ? meta[current] : [];
  const v = Math.min(variant, refs.length - 1);
  const picker = useRef(null);

  // Keep the selected cut in view, e.g. when arriving from the Cuts screen
  useEffect(() => {
    const el = picker.current?.querySelector('.pick.on');
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [current, list.length]);

  useEffect(() => {
    if (!user || !current) return;
    let live = true;
    setBusy(true);
    renderTryOn(after.current, photo, user, `${current}-${v}`, refs[v], { matchColor: match })
      .then(() => live && setVersion((n) => n + 1))
      .catch(() => live && toast("Couldn't load that style"))
      .finally(() => live && setBusy(false));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, current, v, match]);

  if (failed) {
    return (
      <div className="notice warn">
        <Icon name="alert" size={18} />
        <span>We couldn't prepare this photo. Try one with your whole head in frame.</span>
      </div>
    );
  }

  const style = STYLES.find((s) => s.id === current);
  const ready = version > 0;

  return (
    <>
      <Compare photo={photo} after={after.current} version={version} ready={ready} loadingText={!user ? 'Preparing your photo' : busy && !ready ? 'Styling' : null} />

      <div className="cut-picker" ref={picker}>
        {list.map((s) => {
          const on = s.id === current;
          return (
            <motion.button
              key={s.id}
              className={'pick' + (on ? ' on' : '')}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                setCut(s.id);
                setVariant(0);
              }}
            >
              <span className="pick-img">
                <img src={`/cuts/${s.id}-0.jpg`} alt="" loading="lazy" />
                {on && <motion.span layoutId="pick-ring" className="pick-ring" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
              </span>
              <span className="pick-name">{s.name}</span>
            </motion.button>
          );
        })}
      </div>

      {style && (
        <div className="group tryon-panel">
          <div className="tp-head">
            <div>
              <b>{style.name}</b>
              <div className={'fit' + (style.fit[analysis.shape] >= 5 ? ' best' : '')}>
                <FitBars n={style.fit[analysis.shape]} best={style.fit[analysis.shape] >= 5} />
              </div>
            </div>
            {busy && ready && <span className="spinner dark" />}
          </div>
          {refs.length > 1 && (
            <div className="variants">
              <span>Model</span>
              <div>
                {refs.map((r, i) => (
                  <motion.button key={i} whileTap={{ scale: 0.9 }} className={'variant' + (i === v ? ' on' : '')} onClick={() => setVariant(i)} aria-label={`Model ${i + 1}`}>
                    <img src={`/cuts/${current}-${i}.jpg`} alt="" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          <Switch on={match} onChange={setMatch} label="Use my hair color" />
          {refs[v] && <p className="credit">Reference photo by {refs[v].by} on Unsplash</p>}
        </div>
      )}

      {ready && (
        <Button variant="secondary" className="block" onClick={() => saveCanvas(after.current, `bp-${current}.jpg`)}>
          <Icon name="download" size={18} /> Save image
        </Button>
      )}
      <p className="footnote center">A quick preview made on your phone, so edges won't be perfect. Your photo never leaves your device.</p>
    </>
  );
}

/* ---------- hair color ---------- */

function ColorMode({ photo }) {
  const after = useRef(document.createElement('canvas'));
  const render = useRef(null);
  const rgb = useRef(hexToRgb(HAIR_COLORS[3].hex));
  const [state, setState] = useState('loading');
  const [version, setVersion] = useState(0);
  const [color, setColor] = useState(HAIR_COLORS[3]);
  const [strength, setStrength] = useState(0.7);

  const paint = (c) => {
    if (!render.current) return;
    const cv = after.current;
    cv.width = photo.width;
    cv.height = photo.height;
    cv.getContext('2d').putImageData(render.current(c, strength), 0, 0);
    setVersion((n) => n + 1);
  };

  useEffect(() => {
    let live = true;
    setState('loading');
    segmentHairCached(photo)
      .then(({ alpha, coverage }) => {
        if (!live) return;
        if (coverage < 0.005) throw new Error('no hair');
        render.current = createRecolor(photo, alpha);
        setState('ready');
        paint(rgb.current);
      })
      .catch(() => live && setState('error'));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo]);

  useEffect(() => {
    if (state !== 'ready') return;
    const from = rgb.current;
    const to = hexToRgb(color.hex);
    const a = animate(0, 1, {
      duration: 0.35,
      ease: 'easeOut',
      onUpdate: (t) => {
        rgb.current = from.map((x, i) => x + (to[i] - x) * t);
        paint(rgb.current);
      },
    });
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  useEffect(() => {
    if (state === 'ready') paint(rgb.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength]);

  return (
    <>
      <Compare photo={photo} after={after.current} version={version} ready={state === 'ready'} loadingText={state === 'loading' ? 'Finding your hair' : null} />

      {state === 'error' && (
        <div className="notice warn">
          <Icon name="alert" size={18} />
          <span>We couldn't pick out your hair in this one. A photo with your whole head in frame works best.</span>
        </div>
      )}

      {state === 'ready' && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="group color-panel">
            <div className="color-head">
              <AnimatePresence mode="wait">
                <motion.b key={color.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                  {color.name}
                </motion.b>
              </AnimatePresence>
            </div>
            <div className="swatches">
              {HAIR_COLORS.map((c) => {
                const on = c.hex === color.hex;
                return (
                  <motion.button key={c.hex} className="swatch" whileTap={{ scale: 0.85 }} onClick={() => setColor(c)} aria-label={c.name} aria-pressed={on}>
                    {on && <motion.span layoutId="swatch-ring" className="ring" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />}
                    <span className="dot" style={{ background: c.hex }} />
                  </motion.button>
                );
              })}
            </div>
            <label className="slider">
              <span>Strength</span>
              <input type="range" min="0.2" max="1" step="0.05" value={strength} onChange={(e) => setStrength(+e.target.value)} />
              <b>{Math.round(strength * 100)}%</b>
            </label>
          </div>
          <Button variant="secondary" className="block save-btn" onClick={() => saveCanvas(after.current, 'bp-hair-color.jpg')}>
            <Icon name="download" size={18} /> Save image
          </Button>
        </motion.section>
      )}
    </>
  );
}

export default function TryOn({ photo, analysis, cut, setCut, mode, setMode, onScan }) {
  if (!photo || !analysis) {
    return HAIRCUT_TRYON ? (
      <EmptyState icon="mirror" title="See new looks on you" body="Scan a selfie, then try haircuts and hair colors on your own photo." cta="Take a selfie" onClick={onScan} />
    ) : (
      <EmptyState icon="palette" title="Try a new hair color" body="Add a photo and you can see yourself in a dozen shades." cta="Take a selfie" onClick={onScan} />
    );
  }

  if (!HAIRCUT_TRYON) {
    return (
      <Screen title="Hair color" subtitle="Drag across the photo to compare.">
        <ColorMode photo={photo} />
      </Screen>
    );
  }

  return (
    <Screen title="Try on" subtitle="Drag across the photo to compare.">
      <Segmented
        id="tryon-mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'cut', label: 'Haircut' },
          { value: 'color', label: 'Color' },
        ]}
      />
      {mode === 'cut' ? <CutMode photo={photo} analysis={analysis} cut={cut} setCut={setCut} /> : <ColorMode photo={photo} />}
    </Screen>
  );
}
