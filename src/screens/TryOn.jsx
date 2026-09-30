import React, { useEffect, useRef, useState } from 'react';
import { EmptyState, Icon } from '../components.jsx';
import { HAIR_COLORS } from '../lib/styles.js';
import { renderColor, segmentHair } from '../lib/hair.js';

export default function TryOn({ photo, onScan }) {
  const out = useRef(null);
  const [state, setState] = useState('loading'); // loading | ready | error
  const [mask, setMask] = useState(null);
  const [color, setColor] = useState(HAIR_COLORS[9]);
  const [strength, setStrength] = useState(0.75);
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    if (!photo) return;
    let live = true;
    setState('loading');
    segmentHair(photo)
      .then(({ mask, coverage }) => {
        if (!live) return;
        if (coverage < 0.005) throw new Error('no hair');
        setMask(mask);
        setState('ready');
      })
      .catch(() => live && setState('error'));
    return () => {
      live = false;
    };
  }, [photo]);

  useEffect(() => {
    if (state !== 'ready' || !out.current) return;
    renderColor(out.current, photo, mask, color.hex, compare ? 0 : strength);
  }, [state, mask, color, strength, compare, photo]);

  if (!photo) {
    return <EmptyState title="Scan first" body="Upload a photo and you can try on hair colors right away." cta="Scan my face" onClick={onScan} />;
  }

  return (
    <div className="tryon">
      <header className="page-head">
        <p className="eyebrow">Hair color</p>
        <h1>Try-on</h1>
      </header>

      <div className="photocard" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        {state === 'ready' ? <canvas ref={out} /> : <div className="skeleton" />}
        {state === 'loading' && <div className="scanline" />}
        {state === 'loading' && <span className="badge">Finding your hair…</span>}
        {state === 'ready' && (
          <button
            className="hold"
            onPointerDown={() => setCompare(true)}
            onPointerUp={() => setCompare(false)}
            onPointerLeave={() => setCompare(false)}
            onPointerCancel={() => setCompare(false)}
          >
            <Icon name="eye" size={16} /> Hold to compare
          </button>
        )}
      </div>

      {state === 'error' && (
        <div className="notice warn">
          <Icon name="alert" size={18} />
          <span>Couldn't find your hair in this photo. Try one with your full head visible against a plain background.</span>
        </div>
      )}

      {state === 'ready' && (
        <>
          <section className="card">
            <h3 className="section-title">Color · {color.name}</h3>
            <div className="swatches">
              {HAIR_COLORS.map((c) => (
                <button
                  key={c.hex}
                  className={'swatch' + (c.hex === color.hex ? ' active' : '')}
                  style={{ background: c.hex }}
                  onClick={() => setColor(c)}
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </div>
            <label className="slider">
              <span>Intensity</span>
              <input type="range" min="0.2" max="1" step="0.05" value={strength} onChange={(e) => setStrength(+e.target.value)} />
            </label>
          </section>
          <p className="muted small center">Color preview only. Hairstyle (cut) try-on is on the roadmap.</p>
        </>
      )}
    </div>
  );
}
