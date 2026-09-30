import React from 'react';
import { Icon, PhotoCard } from '../components.jsx';
import { SHAPES, explainRatios } from '../lib/face.js';

export default function Results({ photo, analysis, onStyles, onReset }) {
  const { shape, scores, ratios, pts, warnings, confidence } = analysis;
  const info = SHAPES[shape];

  return (
    <div className="results">
      <PhotoCard photo={photo} pts={pts}>
        <span className="tag tl">Length</span>
        <span className="tag tr">Cheeks</span>
      </PhotoCard>

      {warnings.map((w) => (
        <div className="notice warn" key={w}>
          <Icon name="alert" size={18} />
          <span>{w}</span>
        </div>
      ))}

      <section className="shape-hero card">
        <p className="eyebrow">Your face shape</p>
        <h1 className="shape-name">{info.label}</h1>
        <div className="conf">
          <div className="conf-bar"><i style={{ width: confidence + '%' }} /></div>
          <span>{confidence}% match</span>
        </div>
        <p className="lead">{info.blurb}</p>
        <button className="btn primary big" onClick={onStyles}>
          See my hairstyles <Icon name="arrow" size={18} />
        </button>
      </section>

      <section className="card">
        <h3 className="section-title">Your proportions</h3>
        {explainRatios(ratios).map((r) => {
          const pct = Math.max(4, Math.min(100, ((r.value - r.min) / (r.max - r.min)) * 100));
          return (
            <div className="meter" key={r.label}>
              <div className="meter-head">
                <span>{r.label}</span>
                <b>{r.value.toFixed(2)}</b>
              </div>
              <div className="meter-track"><i style={{ width: pct + '%' }} /></div>
              <small>{r.hint}</small>
            </div>
          );
        })}
      </section>

      <section className="card">
        <h3 className="section-title">Shape breakdown</h3>
        {scores.map((s) => (
          <div className="row-bar" key={s.shape}>
            <span>{SHAPES[s.shape].label}</span>
            <div className="meter-track"><i style={{ width: Math.max(2, s.pct) + '%' }} className={s.shape === shape ? 'hot' : ''} /></div>
            <b>{s.pct}%</b>
          </div>
        ))}
        <p className="muted small">Estimates from a single photo. Shape is a guide, not a rule. Wear what you like.</p>
      </section>

      <button className="btn ghost" onClick={onReset}>
        <Icon name="refresh" size={18} /> Scan a new photo
      </button>
    </div>
  );
}
