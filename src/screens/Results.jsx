import React from 'react';
import { Icon, PhotoCard } from '../components.jsx';
import { SHAPES, explainRatios } from '../lib/face.js';

export default function Results({ photo, analysis, onStyles, onReset }) {
  const { shape, scores, ratios, pts, warnings } = analysis;
  const info = SHAPES[shape];
  const runnerUp = scores[1];
  const close = runnerUp && scores[0].pct - runnerUp.pct < 15;

  return (
    <>
      <PhotoCard photo={photo} pts={pts} />

      {warnings.map((w) => (
        <div className="notice warn" key={w}>
          <Icon name="alert" size={18} />
          <span>{w}</span>
        </div>
      ))}

      <section className="result-head">
        <h1>
          You have {/^[aeiou]/i.test(info.label) ? 'an' : 'a'} <em>{info.label.toLowerCase()}</em> face.
        </h1>
        {close && <p className="meta">With a bit of {SHAPES[runnerUp.shape].label.toLowerCase()} in there too.</p>}
        <p className="body">{info.blurb}</p>
      </section>

      <button className="btn primary block" onClick={onStyles}>
        See haircuts for you <Icon name="arrow" size={18} />
      </button>

      <section className="card">
        <p className="label">Measurements</p>
        {explainRatios(ratios).map((r) => {
          const pct = Math.max(3, Math.min(97, ((r.value - r.min) / (r.max - r.min)) * 100));
          return (
            <div className="stat" key={r.label}>
              <div className="stat-head">
                <span>{r.label}</span>
                <b>{r.value.toFixed(2)}×</b>
              </div>
              <div className="track">
                <i style={{ left: pct + '%' }} />
              </div>
              <small>{r.hint}</small>
            </div>
          );
        })}
      </section>

      <section className="card">
        <p className="label">How close you are to each shape</p>
        {scores.map((s, n) => (
          <div className={'shape-row' + (n === 0 ? ' top' : '')} key={s.shape}>
            <span>{SHAPES[s.shape].label}</span>
            <div className="bar">
              <i style={{ width: Math.max(2, s.pct) + '%' }} />
            </div>
            <b>{s.pct}%</b>
          </div>
        ))}
      </section>

      <p className="muted small center">
        This is a read from one photo, so treat it as a starting point. If you like a cut, wear it.
      </p>

      <button className="btn link" onClick={onReset}>
        <Icon name="refresh" size={16} /> Try another photo
      </button>
    </>
  );
}
