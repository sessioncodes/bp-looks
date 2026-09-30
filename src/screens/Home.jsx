import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Icon, Segmented, ShapeMorph } from '../components.jsx';
import { SHAPES } from '../lib/face.js';

const ORDER = ['oval', 'round', 'square', 'oblong', 'heart', 'diamond'];

const TIPS = [
  { icon: 'face', t: 'Look straight ahead', d: 'Chin level, face the lens.' },
  { icon: 'scissors', t: 'Hair off your face', d: 'Your forehead and jaw need to show.' },
  { icon: 'glasses', t: 'No glasses or hats', d: 'They hide your outline.' },
  { icon: 'sun', t: 'Even light', d: 'Face a window, not a lamp.' },
];

const rise = (i) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.05 + i * 0.07, ease: [0.2, 0.8, 0.2, 1] },
});

export default function Home({ onFile, error }) {
  const cam = useRef(null);
  const lib = useRef(null);
  const [shape, setShape] = useState('oval');
  const [touched, setTouched] = useState(false);

  // Cycle through the shapes until the user picks one
  useEffect(() => {
    if (touched) return;
    const t = setInterval(() => setShape((s) => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length]), 2200);
    return () => clearInterval(t);
  }, [touched]);

  const pick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (f) onFile(f);
  };

  return (
    <>
      <motion.header className="topbar" {...rise(0)}>
        <span className="wordmark">bp</span>
      </motion.header>

      <motion.section className="home-title" {...rise(1)}>
        <h1>What's your face shape?</h1>
        <p>Scan a selfie to find out, then see which haircuts suit it.</p>
      </motion.section>

      <motion.section className="morph-card" {...rise(2)}>
        <ShapeMorph shape={shape} />
        <AnimatePresence mode="wait">
          <motion.div
            key={shape}
            className="morph-caption"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <b>{SHAPES[shape].label}</b>
            <span>{SHAPES[shape].short}</span>
          </motion.div>
        </AnimatePresence>
        <Segmented
          id="home-shape"
          scroll
          value={shape}
          onChange={(v) => {
            setTouched(true);
            setShape(v);
          }}
          options={ORDER.map((s) => ({ value: s, label: SHAPES[s].label }))}
        />
      </motion.section>

      <motion.div className="actions" {...rise(3)}>
        <Button className="block" onClick={() => cam.current.click()}>
          <Icon name="camera" size={20} /> Take a selfie
        </Button>
        <Button variant="secondary" className="block" onClick={() => lib.current.click()}>
          <Icon name="image" size={20} /> Choose from photos
        </Button>
        <input ref={cam} type="file" accept="image/*" capture="user" hidden onChange={pick} />
        <input ref={lib} type="file" accept="image/*" hidden onChange={pick} />
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div className="notice error" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p className="privacy" {...rise(4)}>
        <Icon name="lock" size={13} /> Your photo never leaves your phone
      </motion.p>

      <motion.section {...rise(5)}>
        <h2 className="group-title">For the best result</h2>
        <div className="tips-row">
          {TIPS.map((t) => (
            <div className="tip" key={t.t}>
              <span className="tip-ic">
                <Icon name={t.icon} size={18} />
              </span>
              <b>{t.t}</b>
              <span>{t.d}</span>
            </div>
          ))}
        </div>
      </motion.section>
    </>
  );
}
