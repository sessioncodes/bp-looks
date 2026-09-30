import React, { useMemo, useState } from 'react';
import { Chip, EmptyState, Icon } from '../components.jsx';
import { HAIR_TYPES, LENGTHS, recommend } from '../lib/styles.js';
import { SHAPES } from '../lib/face.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const fitLabel = (n) => (n >= 5 ? 'Best fit' : n >= 4 ? 'Good fit' : n >= 3 ? 'Works' : 'Tricky');

export default function Styles({ analysis, prefs, setPrefs, onScan, onTryOn }) {
  const [open, setOpen] = useState(null);
  const list = useMemo(() => (analysis ? recommend(analysis.shape, prefs) : []), [analysis, prefs]);

  if (!analysis) {
    return (
      <EmptyState
        icon="scissors"
        title="No scan yet"
        body="Take a selfie first and we'll sort these cuts by what suits your face."
        cta="Take a selfie"
        onClick={onScan}
      />
    );
  }

  const toggle = (k, v) => setPrefs((p) => ({ ...p, [k]: p[k] === v ? null : v }));

  return (
    <>
      <header className="page-head">
        <h1>Haircuts for you</h1>
        <p>Sorted for a {SHAPES[analysis.shape].label.toLowerCase()} face. Tap one for what to tell your barber.</p>
      </header>

      <div className="filters">
        <div className="seg">
          {HAIR_TYPES.map((t) => (
            <Chip key={t} active={prefs.hairType === t} onClick={() => toggle('hairType', t)}>
              {cap(t)}
            </Chip>
          ))}
        </div>
        <div className="seg">
          {LENGTHS.map((t) => (
            <Chip key={t} active={prefs.length === t} onClick={() => toggle('length', t)}>
              {cap(t)}
            </Chip>
          ))}
        </div>
      </div>

      {list.length === 0 && <p className="empty-note">Nothing matches both filters. Try removing one.</p>}

      <div className="list">
        {list.map((s) => {
          const isOpen = open === s.id;
          const n = s.fit[analysis.shape];
          return (
            <article className="cut card" key={s.id}>
              <button className="cut-head" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen}>
                <div className="cut-main">
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                </div>
                <div className={'fit' + (n >= 5 ? ' best' : '')}>
                  <span>{fitLabel(n)}</span>
                  <div className="pips">
                    {[1, 2, 3, 4, 5].map((k) => (
                      <i key={k} className={k <= n ? 'on' : ''} />
                    ))}
                  </div>
                </div>
              </button>
              {isOpen && (
                <div className="cut-body">
                  <div className="say">
                    <b>Tell your barber</b>
                    {s.tip}
                  </div>
                  <div className="meta-row">
                    <span>{cap(s.length)}</span>
                    {s.types.map((t) => (
                      <span key={t}>{cap(t)}</span>
                    ))}
                  </div>
                  <button className="btn secondary sm" onClick={onTryOn}>
                    <Icon name="palette" size={16} /> Try a hair color
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
