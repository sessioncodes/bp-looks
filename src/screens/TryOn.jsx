import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { Button, EmptyState, Icon, Screen } from '../components.jsx';
import { HAIR_COLORS } from '../lib/styles.js';
import { createRecolor, hexToRgb, segmentHair } from '../lib/hair.js';
import { toast } from '../lib/store.js';

export default function TryOn({ photo, onScan }) {
  const box = useRef(null);
  const orig = useRef(null);
  const edit = useRef(null);
  const render = useRef(null);
  const rgb = useRef(hexToRgb(HAIR_COLORS[3].hex));
  const [state, setState] = useState('loading'); // loading | ready | error
  const [color, setColor] = useState(HAIR_COLORS[3]);
  const [strength, setStrength] = useState(0.7);
  const [pos, setPos] = useState(100);
  const dragging = useRef(false);

  // Segment once per photo
  useEffect(() => {
    if (!photo) return;
    let live = true;
    setState('loading');
    segmentHair(photo)
      .then(({ alpha, coverage }) => {
        if (!live) return;
        if (coverage < 0.005) throw new Error('no hair');
        render.current = createRecolor(photo, alpha);
        setState('ready');
      })
      .catch(() => live && setState('error'));
    return () => {
      live = false;
    };
  }, [photo]);

  const paint = (c) => {
    const cv = edit.current;
    if (!cv || !render.current) return;
    cv.getContext('2d').putImageData(render.current(c, strength), 0, 0);
  };

  // Set up canvases and slide the divider in once the hair is found
  useEffect(() => {
    if (state !== 'ready') return;
    for (const cv of [orig.current, edit.current]) {
      cv.width = photo.width;
      cv.height = photo.height;
    }
    orig.current.getContext('2d').drawImage(photo, 0, 0);
    paint(rgb.current);
    const a = animate(100, 50, { duration: 1.1, delay: 0.3, ease: [0.3, 0.9, 0.2, 1], onUpdate: setPos });
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, photo]);

  // Blend smoothly to a newly picked color
  useEffect(() => {
    if (state !== 'ready') return;
    const from = rgb.current;
    const to = hexToRgb(color.hex);
    const a = animate(0, 1, {
      duration: 0.35,
      ease: 'easeOut',
      onUpdate: (t) => {
        const c = from.map((v, i) => v + (to[i] - v) * t);
        rgb.current = c;
        paint(c);
      },
    });
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  useEffect(() => {
    if (state === 'ready') paint(rgb.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength]);

  const move = (e) => {
    const r = box.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };

  const saveImage = async () => {
    const blob = await new Promise((r) => edit.current.toBlob(r, 'image/jpeg', 0.92));
    const file = new File([blob], 'bp-hair-color.jpg', { type: 'image/jpeg' });
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
  };

  if (!photo) {
    return <EmptyState icon="palette" title="Try a new hair color" body="Add a photo and you can see yourself in a dozen shades." cta="Take a selfie" onClick={onScan} />;
  }

  return (
    <Screen title="Hair color" subtitle="Drag across the photo to compare.">
      <div
        ref={box}
        className={'compare' + (state === 'ready' ? ' ready' : '')}
        style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        onPointerDown={(e) => {
          if (state !== 'ready') return;
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e);
        }}
        onPointerMove={(e) => dragging.current && move(e)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {state === 'ready' ? (
          <>
            <canvas ref={orig} />
            <canvas ref={edit} className="after" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} />
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
        ) : (
          <div className="skeleton" />
        )}
        <AnimatePresence>
          {state === 'loading' && (
            <motion.span className="pill" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <span className="spinner" /> Finding your hair
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {state === 'error' && (
        <div className="notice warn">
          <Icon name="alert" size={18} />
          <span>We couldn't pick out your hair in this one. A photo with your whole head in frame works best.</span>
        </div>
      )}

      {state === 'ready' && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
          <Button variant="secondary" className="block save-btn" onClick={saveImage}>
            <Icon name="download" size={18} /> Save image
          </Button>
        </motion.section>
      )}
    </Screen>
  );
}
