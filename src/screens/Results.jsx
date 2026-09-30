import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, CountUp, Icon, PhotoCard, Segmented, ShapeMorph } from '../components.jsx';
import { SHAPES, explainRatios } from '../lib/face.js';

const rise = (i) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] },
});

export default function Results({ photo, analysis, onStyles, onReset }) {
  const { shape, scores, ratios, pts, mesh, warnings } = analysis;
  const info = SHAPES[shape];
  const [view, setView] = useState('lines');
  const [openShape, setOpenShape] = useState(null);
  const runnerUp = scores[1];
  const close = runnerUp && scores[0].pct - runnerUp.pct < 15;

  return (
    <>
      <motion.div {...rise(0)} className="photo-wrap">
        <PhotoCard photo={photo} pts={view === 'lines' ? pts : null} mesh={view === 'mesh' ? mesh : null} />
        <div className="photo-toggle">
          <Segmented
            id="photo-view"
            value={view}
            onChange={setView}
            options={[
              { value: 'lines', label: 'Lines' },
              { value: 'mesh', label: 'Mesh' },
              { value: 'none', label: 'Photo' },
            ]}
          />
        </div>
      </motion.div>

      {warnings.map((w) => (
        <motion.div className="notice warn" key={w} {...rise(1)}>
          <Icon name="alert" size={18} />
          <span>{w}</span>
        </motion.div>
      ))}

      <motion.section className="result-hero" {...rise(1)}>
        <div className="result-text">
          <span className="kicker">Your face shape</span>
          <h1>{info.label}</h1>
          {close && <span className="also">with some {SHAPES[runnerUp.shape].label.toLowerCase()}</span>}
        </div>
        <ShapeMorph shape={shape} from="round" guides={false} className="mini" />
      </motion.section>

      <motion.p className="body-text" {...rise(2)}>
        {info.blurb}
      </motion.p>

      <motion.div {...rise(3)}>
        <Button className="block" onClick={onStyles}>
          See haircuts for you <Icon name="arrow" size={18} />
        </Button>
      </motion.div>

      <motion.section {...rise(4)}>
        <h2 className="group-title">Measurements</h2>
        <div className="group">
          {explainRatios(ratios).map((r, i) => {
            const pct = Math.max(3, Math.min(97, ((r.value - r.min) / (r.max - r.min)) * 100));
            return (
              <div className="stat" key={r.label}>
                <div className="stat-head">
                  <span>{r.label}</span>
                  <b>
                    <CountUp value={r.value} decimals={2} delay={0.3 + i * 0.1} />×
                  </b>
                </div>
                <div className="track">
                  <motion.i initial={{ left: '0%' }} animate={{ left: pct + '%' }} transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.35 + i * 0.1 }} />
                </div>
                <small>{r.hint}</small>
              </div>
            );
          })}
        </div>
      </motion.section>

      <motion.section {...rise(5)}>
        <h2 className="group-title">Closest shapes</h2>
        <div className="group">
          {scores.map((s, n) => {
            const open = openShape === s.shape;
            return (
              <div key={s.shape} className={'shape-row-wrap' + (n === 0 ? ' top' : '')}>
                <button className="shape-row" onClick={() => setOpenShape(open ? null : s.shape)} aria-expanded={open}>
                  <span className="shape-name">{SHAPES[s.shape].label}</span>
                  <span className="bar">
                    <motion.i initial={{ width: 0 }} animate={{ width: Math.max(2, s.pct) + '%' }} transition={{ duration: 0.9, delay: 0.4 + n * 0.06, ease: [0.2, 0.8, 0.2, 1] }} />
                  </span>
                  <b>{s.pct}%</b>
                  <motion.span className="chev" animate={{ rotate: open ? 90 : 0 }}>
                    <Icon name="chevron" size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.p className="shape-more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <span>{SHAPES[s.shape].blurb}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <p className="footnote">Based on one photo, so treat it as a starting point. If you like a cut, wear it.</p>
      </motion.section>

      <Button variant="plain" onClick={onReset}>
        <Icon name="refresh" size={17} /> Scan a different photo
      </Button>
    </>
  );
}
