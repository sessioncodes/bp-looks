import React, { useRef } from 'react';
import { Icon } from '../components.jsx';

const STEPS = [
  { n: '01', t: 'Snap a selfie', d: 'Front-facing, good light, hair off your forehead.' },
  { n: '02', t: 'We map your face', d: '478 landmarks measure your length, cheeks, forehead and jaw.' },
  { n: '03', t: 'Get your cuts', d: 'Ranked hairstyles for your shape, hair type and length.' },
];

export default function Home({ onFile, error }) {
  const cam = useRef(null);
  const lib = useRef(null);
  const pick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (f) onFile(f);
  };

  return (
    <div className="home">
      <header className="brand">
        <span className="logo">BP</span>
        <span className="brand-sub">Looks Lab</span>
      </header>

      <section className="hero">
        <div className="hero-glow" />
        <p className="eyebrow">AI face analysis</p>
        <h1>
          Find the cut
          <br />
          that fits <em>your face.</em>
        </h1>
        <p className="lead">Face shape, hairstyle matches and hair-color try-on. Free, instant, and your photo never leaves your phone.</p>

        <div className="cta-stack">
          <button className="btn primary big" onClick={() => cam.current.click()}>
            <Icon name="camera" /> Take a selfie
          </button>
          <button className="btn ghost big" onClick={() => lib.current.click()}>
            <Icon name="image" /> Upload a photo
          </button>
        </div>
        <input ref={cam} type="file" accept="image/*" capture="user" hidden onChange={pick} />
        <input ref={lib} type="file" accept="image/*" hidden onChange={pick} />

        {error && (
          <div className="notice error" role="alert">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="trust">
          <span><Icon name="lock" size={15} /> On-device</span>
          <span><Icon name="zap" size={15} /> Free forever</span>
          <span><Icon name="check" size={15} /> No sign-up</span>
        </div>
      </section>

      <section className="steps">
        <h3 className="section-title">How it works</h3>
        {STEPS.map((s) => (
          <div className="step card" key={s.n}>
            <span className="step-n">{s.n}</span>
            <div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="tips card">
        <h3>For the best read</h3>
        <ul>
          <li>Look straight at the camera, chin level</li>
          <li>Neutral expression, mouth closed</li>
          <li>Pull hair back and remove glasses</li>
          <li>Even light, no harsh shadows</li>
        </ul>
      </section>
    </div>
  );
}
