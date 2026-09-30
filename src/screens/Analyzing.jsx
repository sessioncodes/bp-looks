import React, { useEffect, useState } from 'react';
import { PhotoCard } from '../components.jsx';

const STEPS = ['Finding your face', 'Measuring', 'Picking your cuts'];

export default function Analyzing({ photo }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => Math.min(v + 1, STEPS.length - 1)), 650);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="app analyzing">
      <div className="analyze-wrap">
        <PhotoCard photo={photo}>
          <div className="scanbar" />
        </PhotoCard>
        <div className="status">
          <h2>{STEPS[i]}…</h2>
          <p>The first scan takes a few seconds longer.</p>
          <div className="dots">
            {STEPS.map((s, n) => (
              <i key={s} className={n <= i ? 'on' : ''} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
