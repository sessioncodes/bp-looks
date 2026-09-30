import React, { useEffect, useRef, useState } from 'react';
import { EmptyState, Icon } from '../components.jsx';
import { HAIR_COLORS } from '../lib/styles.js';
import { renderColor, segmentHair } from '../lib/hair.js';

export default function TryOn({ photo, onScan }) {
  const out = useRef(null);
  const [state, setState] = useState('loading'); // loading | ready | error
  const [mask, setMask] = useState(null);
  const [color, setColor] = useState(HAIR_COLORS[3]);
  const [strength, setStrength] = useState(0.7);
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
    return (
      <EmptyState
        icon="palette"
        title="See yourself in a new color"
        body="Add a photo and you can try a dozen hair colors on it."
        cta="Take a selfie"
        onClick={onScan}
      />
    );
  }

  const stop = () => setCompare(false);

  return (
    <>
      <header className="page-head">
        <h1>Hair color</h1>
        <p>Pick a shade. Hold the photo to see your original.</p>
      </header>

      <div className="photocard" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        {state === 'ready' ? <canvas ref={out} /> : <div className="skeleton" />}
        {state === 'loading' && <span className="pill">Finding your hair…</span>}
        {state === 'ready' && (
          <button className="pill hold" onPointerDown={() => setCompare(true)} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}>
            <Icon name="eye" size={15} /> {compare ? 'Original' : 'Hold to compare'}
          </button>
        )}
      </div>

      {state === 'error' && (
        <div className="notice warn">
          <Icon name="alert" size={18} />
          <span>We couldn't pick out your hair in this one. A photo with your whole head in frame works best.</span>
        </div>
      )}

      {state === 'ready' && (
        <section className="card">
          <p className="label">{color.name}</p>
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
            <span>Strength</span>
            <input type="range" min="0.2" max="1" step="0.05" value={strength} onChange={(e) => setStrength(+e.target.value)} />
          </label>
        </section>
      )}
    </>
  );
}
