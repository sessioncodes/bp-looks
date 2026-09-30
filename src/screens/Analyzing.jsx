import React, { useEffect, useState } from 'react';
import { PhotoCard } from '../components.jsx';

const STEPS = ['Detecting your face', 'Mapping 478 landmarks', 'Measuring proportions', 'Matching hairstyles'];

export default function Analyzing({ photo }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => Math.min(v + 1, STEPS.length - 1)), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="app analyzing">
      <div className="analyze-wrap">
        <PhotoCard photo={photo} scanning />
        <ul className="progress">
          {STEPS.map((s, n) => (
            <li key={s} className={n < i ? 'done' : n === i ? 'now' : ''}>
              <span className="dot" />
              {s}
            </li>
          ))}
        </ul>
        <p className="muted small center">First scan downloads the AI model (~4 MB), then it's cached.</p>
      </div>
    </div>
  );
}
