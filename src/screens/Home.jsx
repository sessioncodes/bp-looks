import React, { useRef } from 'react';
import { Icon } from '../components.jsx';

const TIPS = [
  { icon: 'face', t: 'Look straight at the camera' },
  { icon: 'scissors', t: 'Push your hair off your forehead' },
  { icon: 'glasses', t: 'Take off glasses and hats' },
  { icon: 'sun', t: 'Face a window or soft light' },
];

function FaceSketch() {
  return (
    <svg viewBox="0 0 200 240" fill="none" strokeLinecap="round">
      <path d="M100 22c-44 0-70 30-70 76 0 52 28 110 70 124 42-14 70-72 70-124 0-46-26-76-70-76Z" stroke="currentColor" strokeWidth="2" />
      <path d="M70 104c6-4 14-4 20 0M110 104c6-4 14-4 20 0M92 160c5 4 11 4 16 0" stroke="currentColor" strokeWidth="2" opacity=".55" />
      <g className="dim" strokeWidth="1.5" strokeDasharray="4 5">
        <path d="M100 22v200" />
        <path d="M30 118h140" />
        <path d="M52 56h96" />
        <path d="M58 182h84" />
      </g>
      {[[100, 22], [100, 222], [30, 118], [170, 118]].map(([x, y]) => (
        <circle key={x + '-' + y} cx={x} cy={y} r="4" fill="currentColor" />
      ))}
    </svg>
  );
}

export default function Home({ onFile, error }) {
  const cam = useRef(null);
  const lib = useRef(null);
  const pick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (f) onFile(f);
  };

  return (
    <>
      <header className="topbar">
        <span className="wordmark">
          bp<span>.</span>
        </span>
      </header>

      <section className="hero">
        <h1>
          Find the haircut that suits <em>your</em> face.
        </h1>
        <p className="body">Take a selfie. We'll work out your face shape and show you which cuts work, and which to skip.</p>
      </section>

      <div className="illo">
        <FaceSketch />
        <span className="illo-tag a">Face shape</span>
        <span className="illo-tag b">Proportions</span>
      </div>

      <div className="actions">
        <button className="btn primary block" onClick={() => cam.current.click()}>
          <Icon name="camera" size={20} /> Take a selfie
        </button>
        <button className="btn secondary block" onClick={() => lib.current.click()}>
          <Icon name="image" size={20} /> Choose from photos
        </button>
        <input ref={cam} type="file" accept="image/*" capture="user" hidden onChange={pick} />
        <input ref={lib} type="file" accept="image/*" hidden onChange={pick} />
      </div>

      {error && (
        <div className="notice error" role="alert">
          <Icon name="alert" size={18} />
          <span>{error}</span>
        </div>
      )}

      <p className="privacy">
        <Icon name="lock" size={14} /> Your photo stays on your phone
      </p>

      <section className="card tips">
        <h3>Getting a good photo</h3>
        <ul>
          {TIPS.map((t) => (
            <li key={t.t}>
              <Icon name={t.icon} size={18} />
              {t.t}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
