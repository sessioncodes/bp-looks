import React, { useMemo, useState } from 'react';
import { Chip, EmptyState, Icon } from '../components.jsx';
import { HAIR_TYPES, LENGTHS, recommend } from '../lib/styles.js';
import { SHAPES } from '../lib/face.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);

export default function Styles({ analysis, prefs, setPrefs, onScan, onTryOn }) {
  const [open, setOpen] = useState(null);
  const list = useMemo(() => (analysis ? recommend(analysis.shape, prefs) : []), [analysis, prefs]);

  if (!analysis) {
    return <EmptyState title="Scan first" body="We need your face shape to rank hairstyles for you." cta="Scan my face" onClick={onScan} />;
  }

  const toggle = (k, v) => setPrefs((p) => ({ ...p, [k]: p[k] === v ? null : v }));

  return (
    <div className="styles">
      <header className="page-head">
        <p className="eyebrow">{SHAPES[analysis.shape].label} face</p>
        <h1>Your hairstyles</h1>
      </header>

      <div className="filters">
        <div className="chips">
          <span className="chips-label">Hair type</span>
          {HAIR_TYPES.map((t) => (
            <Chip key={t} active={prefs.hairType === t} onClick={() => toggle('hairType', t)}>{cap(t)}</Chip>
          ))}
        </div>
        <div className="chips">
          <span className="chips-label">Length</span>
          {LENGTHS.map((t) => (
            <Chip key={t} active={prefs.length === t} onClick={() => toggle('length', t)}>{cap(t)}</Chip>
          ))}
        </div>
      </div>

      {list.length === 0 && <p className="muted center pad">No styles match those filters. Try loosening one.</p>}

      <div className="list">
        {list.map((s, i) => {
          const isOpen = open === s.id;
          return (
            <article className={'style card' + (isOpen ? ' open' : '')} key={s.id}>
              <button className="style-head" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen}>
                <span className="rank">{i + 1}</span>
                <div className="style-main">
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                  <div className="tags">
                    <span>{cap(s.length)}</span>
                    {s.types.map((t) => (
                      <span key={t}>{cap(t)}</span>
                    ))}
                  </div>
                </div>
                <div className="score" style={{ '--p': s.match }}>
                  <b>{s.match}</b>
                  <small>%</small>
                </div>
                <Icon name="chevron" size={18} />
              </button>
              {isOpen && (
                <div className="style-body">
                  <h4>Ask your barber</h4>
                  <p>{s.tip}</p>
                  <button className="btn ghost small" onClick={onTryOn}>
                    <Icon name="palette" size={16} /> Try a hair color
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
