import React from 'react';
import { Icon } from '../components.jsx';

const SOON = [
  { t: 'Before / after feed', d: 'Post transformations and get feedback from people with your face shape.' },
  { t: 'Style boards', d: 'Save cuts you love and compare them side by side.' },
  { t: 'Barber cards', d: 'Export a one-tap card to show your barber exactly what you want.' },
];

export default function Community() {
  return (
    <div className="community">
      <header className="page-head">
        <p className="eyebrow">Coming soon</p>
        <h1>Community</h1>
      </header>
      <p className="lead">A place to share glow-ups and get honest, constructive feedback. It's being built next.</p>
      <div className="list">
        {SOON.map((s) => (
          <div className="card soon" key={s.t}>
            <span className="soon-ic"><Icon name="users" size={18} /></span>
            <div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
