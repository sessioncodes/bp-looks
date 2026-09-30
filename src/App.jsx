import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Home from './screens/Home.jsx';
import Analyzing from './screens/Analyzing.jsx';
import Results from './screens/Results.jsx';
import Styles from './screens/Styles.jsx';
import TryOn from './screens/TryOn.jsx';
import Community from './screens/Community.jsx';
import { TabBar, Toaster } from './components.jsx';
import { fileToCanvas } from './lib/image.js';
import { analyzeFace } from './lib/face.js';
import { preload } from './lib/mp.js';
import { load, save } from './lib/store.js';

const TABS = [
  { id: 'face', label: 'Scan', icon: 'scan' },
  { id: 'styles', label: 'Cuts', icon: 'scissors' },
  { id: 'tryon', label: 'Try on', icon: 'mirror' },
  { id: 'community', label: 'Community', icon: 'users' },
];
const ORDER = TABS.map((t) => t.id);

export default function App() {
  const [tab, setTab] = useState('face');
  const dir = useRef(1);
  const [photo, setPhoto] = useState(null); // canvas, kept in memory only
  const [analysis, setAnalysis] = useState(null);
  const [pending, setPending] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [tryCut, setTryCut] = useState(null);
  const [tryMode, setTryMode] = useState('cut');
  const [prefs, setPrefs] = useState(() => load('bp.prefs', { hairType: null, length: null }));

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => save('bp.prefs', prefs), [prefs]);

  const go = useCallback(
    (id) => {
      if (id === tab) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      dir.current = ORDER.indexOf(id) > ORDER.indexOf(tab) ? 1 : -1;
      setTab(id);
      window.scrollTo(0, 0);
    },
    [tab]
  );

  const scan = useCallback(async (file) => {
    setError('');
    setPending(null);
    let canvas;
    try {
      canvas = await fileToCanvas(file);
    } catch {
      setError("That file couldn't be opened. Try a JPG or PNG.");
      return;
    }
    setPhoto(canvas);
    setScanning(true);
    try {
      setPending(await analyzeFace(canvas));
    } catch (e) {
      setPhoto(null);
      setScanning(false);
      setError(
        e.message === 'NO_FACE'
          ? "We couldn't find a face in that photo. Try a straight-on selfie in good light."
          : 'Something went wrong loading the scanner. Check your connection and try again.'
      );
    }
  }, []);

  const finish = useCallback(() => {
    setAnalysis(pending);
    setPending(null);
    setScanning(false);
    setTab('face');
    window.scrollTo(0, 0);
  }, [pending]);

  const reset = () => {
    setPhoto(null);
    setAnalysis(null);
    setError('');
    window.scrollTo(0, 0);
  };

  if (scanning) return <Analyzing photo={photo} result={pending} onDone={finish} />;

  const hasResult = photo && analysis;
  const isHome = tab === 'face' && !hasResult;

  return (
    <div className="app">
      <motion.main
        key={tab + (hasResult ? '-r' : '')}
        className={'screen' + (isHome ? ' home' : '')}
        initial={{ opacity: 0, x: dir.current * 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {tab === 'face' &&
          (hasResult ? (
            <Results photo={photo} analysis={analysis} onStyles={() => go('styles')} onReset={reset} />
          ) : (
            <Home onFile={scan} error={error} />
          ))}
        {tab === 'styles' && <Styles analysis={analysis} prefs={prefs} setPrefs={setPrefs} onScan={() => go('face')} onTryOn={(id) => {
              if (id) setTryCut(id);
              setTryMode(id ? 'cut' : 'color');
              go('tryon');
            }}
          />}
        {tab === 'tryon' && (
          <TryOn photo={photo} analysis={analysis} cut={tryCut} setCut={setTryCut} mode={tryMode} setMode={setTryMode} onScan={() => go('face')} />
        )}
        {tab === 'community' && <Community />}
      </motion.main>
      <TabBar tabs={TABS} active={tab} onChange={go} />
      <Toaster />
    </div>
  );
}
