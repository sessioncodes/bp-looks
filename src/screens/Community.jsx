import React from 'react';
import { Icon } from '../components.jsx';

const SOON = [
  { icon: 'grid', t: 'Before and afters', d: 'Post your new cut and see what worked for people with your face shape.' },
  { icon: 'message', t: 'Honest feedback', d: 'Ask which of two cuts looks better and get real answers.' },
  { icon: 'bookmark', t: 'Saved cuts', d: 'Keep a board of styles to show your barber.' },
];

export default function Community() {
  return (
    <>
      <header className="page-head">
        <h1>Community</h1>
        <p>We're still building this part. Here's what's coming.</p>
      </header>
      <ul className="card soon">
        {SOON.map((s) => (
          <li key={s.t}>
            <span className="ic">
              <Icon name={s.icon} size={18} />
            </span>
            <div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
