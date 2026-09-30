import React, { useCallback, useEffect, useState } from 'react';
import Home from './screens/Home.jsx';
import Analyzing from './screens/Analyzing.jsx';
import Results from './screens/Results.jsx';
import Styles from './screens/Styles.jsx';
import TryOn from './screens/TryOn.jsx';
import Community from './screens/Community.jsx';
import { Icon } from './components.jsx';
import { fileToCanvas } from './lib/image.js';
import { analyzeFace } from './lib/face.js';
import { preload } from './lib/mp.js';

const load = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};

const TABS = [
  { id: 'face', label: 'Face', icon: 'scan' },
  { id: 'styles', label: 'Styles', icon: 'scissors' },
  { id: 'tryon', label: 'Try-on', icon: 'palette' },
  { id: 'community', label: 'Community', icon: 'users' },
];

export default function App() {
  const [tab, setTab] = useState('face');
  const [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState(null); // canvas, memory only
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [prefs, setPrefs] = useState(() => load('bp.prefs', { hairType: null, length: null }));

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bp.prefs', JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  const scan = useCallback(async (file) => {
    setError('');
    setBusy(true);
    try {
      const canvas = await fileToCanvas(file);
      setPhoto(canvas);
      const [result] = await Promise.all([analyzeFace(canvas), new Promise((r) => setTimeout(r, 2200))]);
      setAnalysis(result);
      setTab('face');
    } catch (e) {
      setPhoto(null);
      setAnalysis(null);
      setError(
        e.message === 'NO_FACE'
          ? "We couldn't find a face. Try a well-lit, front-facing photo with your hair pulled back."
          : "Couldn't analyze that photo. Check your connection (the AI model downloads on first use) and try again."
      );
    } finally {
      setBusy(false);
    }
  }, []);

  const reset = () => {
    setPhoto(null);
    setAnalysis(null);
    setError('');
    setTab('face');
  };

  if (busy) return <Analyzing photo={photo} />;

  const hasResult = photo && analysis;

  return (
    <div className="app">
      <main className="screen" key={tab + (hasResult ? '1' : '0')}>
        {tab === 'face' &&
          (hasResult ? (
            <Results photo={photo} analysis={analysis} onStyles={() => setTab('styles')} onReset={reset} />
          ) : (
            <Home onFile={scan} error={error} />
          ))}
        {tab === 'styles' && (
          <Styles analysis={analysis} prefs={prefs} setPrefs={setPrefs} onScan={() => setTab('face')} onTryOn={() => setTab('tryon')} />
        )}
        {tab === 'tryon' && <TryOn photo={photo} onScan={() => setTab('face')} />}
        {tab === 'community' && <Community />}
      </main>
      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <button key={t.id} className={'tab' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
