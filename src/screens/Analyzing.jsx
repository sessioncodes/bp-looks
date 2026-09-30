import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PhotoCard } from '../components.jsx';

const TEXT = ['Finding your face', 'Mapping your features', 'Measuring proportions', 'Done'];
const PROGRESS = [0.18, 0.5, 0.82, 1];

// 0: waiting for the model, 1: mesh sweeps in, 2: measurement lines, 3: done
export default function Analyzing({ photo, result, onDone }) {
  const [stage, setStage] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!result) return;
    setStage(1);
    const ts = [setTimeout(() => setStage(2), 1400), setTimeout(() => setStage(3), 2300), setTimeout(() => done.current(), 3000)];
    return () => ts.forEach(clearTimeout);
  }, [result]);

  return (
    <div className="app analyzing">
      <motion.div className="analyze-wrap" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <PhotoCard photo={photo} mesh={stage >= 1 ? result.mesh : null} reveal pts={stage >= 2 ? result.pts : null} className={stage >= 2 ? 'dimmed' : ''}>
          {stage === 0 && <div className="scanbar" />}
          {stage === 1 && <div className="sweep" />}
        </PhotoCard>

        <div className="status">
          <AnimatePresence mode="wait">
            <motion.h2 key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {TEXT[stage]}
              {stage < 3 && '…'}
            </motion.h2>
          </AnimatePresence>
          <div className="progress">
            <motion.i animate={{ scaleX: PROGRESS[stage] }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }} />
          </div>
          {stage === 0 && <p>The first scan takes a few extra seconds.</p>}
        </div>
      </motion.div>
    </div>
  );
}
