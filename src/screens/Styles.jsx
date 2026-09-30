import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Chip, EmptyState, FitBars, Icon, Screen, Segmented, Sheet } from '../components.jsx';
import { HAIR_TYPES, recommend } from '../lib/styles.js';
import { SHAPES } from '../lib/face.js';
import { load, save, toast } from '../lib/store.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const article = (w) => (/^[aeiou]/.test(w) ? 'an' : 'a');
const fitLabel = (n) => (n >= 5 ? 'Best fit' : n >= 4 ? 'Good fit' : n >= 3 ? 'Works' : 'Tricky');

function Heart({ on, onClick }) {
  return (
    <motion.button
      className={'heart' + (on ? ' on' : '')}
      onClick={onClick}
      whileTap={{ scale: 0.8 }}
      aria-label={on ? 'Remove from saved' : 'Save'}
      aria-pressed={on}
    >
      <motion.span key={on ? 'on' : 'off'} initial={on ? { scale: 0.4 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 12 }}>
        <Icon name="heart" size={20} fill={on ? 'currentColor' : 'none'} />
      </motion.span>
    </motion.button>
  );
}

export default function Styles({ analysis, prefs, setPrefs, onScan, onTryOn }) {
  const [open, setOpen] = useState(null);
  const [saved, setSaved] = useState(() => load('bp.saved', []));
  const [onlySaved, setOnlySaved] = useState(false);

  useEffect(() => save('bp.saved', saved), [saved]);

  const list = useMemo(() => {
    if (!analysis) return [];
    const all = recommend(analysis.shape, prefs);
    return onlySaved ? all.filter((s) => saved.includes(s.id)) : all;
  }, [analysis, prefs, onlySaved, saved]);

  const toggleSave = useCallback((id) => {
    setSaved((s) => {
      const on = s.includes(id);
      if (!on) toast('Saved');
      return on ? s.filter((x) => x !== id) : [...s, id];
    });
  }, []);

  const close = useCallback(() => setOpen(null), []);

  if (!analysis) {
    return (
      <EmptyState icon="scissors" title="No scan yet" body="Take a selfie first and we'll sort these cuts by what suits your face." cta="Take a selfie" onClick={onScan} />
    );
  }

  const shape = analysis.shape;
  const cut = open && list.find((s) => s.id === open);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied. Show it to your barber');
    } catch {
      toast("Couldn't copy");
    }
  };

  return (
    <Screen title="Haircuts" subtitle={`Sorted for your ${SHAPES[shape].label.toLowerCase()} face`}>
      <div className="filters">
        <Segmented
          id="length"
          value={prefs.length}
          onChange={(v) => setPrefs((p) => ({ ...p, length: v }))}
          options={[
            { value: null, label: 'All' },
            { value: 'short', label: 'Short' },
            { value: 'medium', label: 'Medium' },
            { value: 'long', label: 'Long' },
          ]}
        />
        <div className="chip-row">
          <Chip active={onlySaved} onClick={() => setOnlySaved((v) => !v)}>
            <Icon name="heart" size={14} fill={onlySaved ? 'currentColor' : 'none'} /> Saved
          </Chip>
          <span className="chip-sep" />
          {HAIR_TYPES.map((t) => (
            <Chip key={t} active={prefs.hairType === t} onClick={() => setPrefs((p) => ({ ...p, hairType: p.hairType === t ? null : t }))}>
              {cap(t)}
            </Chip>
          ))}
        </div>
      </div>

      <motion.ul className="cut-list" layout>
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((s, i) => {
            const n = s.fit[shape];
            return (
              <motion.li
                key={s.id}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(i, 8) * 0.035 } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              >
                <motion.div className="cut" whileTap={{ scale: 0.985 }} onClick={() => setOpen(s.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setOpen(s.id)}>
                  <div className="cut-main">
                    <h3>{s.name}</h3>
                    <p>{s.desc}</p>
                    <div className={'fit' + (n >= 5 ? ' best' : '')}>
                      <FitBars n={n} best={n >= 5} />
                      <span>{fitLabel(n)}</span>
                    </div>
                  </div>
                  <Heart
                    on={saved.includes(s.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(s.id);
                    }}
                  />
                </motion.div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {list.length === 0 && (
        <motion.p className="empty-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {onlySaved ? 'Nothing saved yet. Tap the heart on a cut to keep it here.' : 'Nothing matches those filters. Try removing one.'}
        </motion.p>
      )}

      <Sheet open={!!cut} onClose={close}>
        {cut && (
          <div className="sheet-body">
            <div className="sheet-head">
              <div>
                <h2>{cut.name}</h2>
                <div className={'fit' + (cut.fit[shape] >= 5 ? ' best' : '')}>
                  <FitBars n={cut.fit[shape]} best={cut.fit[shape] >= 5} />
                  <span>
                    {fitLabel(cut.fit[shape])} for {article(shape)} {SHAPES[shape].label.toLowerCase()} face
                  </span>
                </div>
              </div>
              <Heart on={saved.includes(cut.id)} onClick={() => toggleSave(cut.id)} />
            </div>
            <p className="sheet-desc">{cut.desc}</p>
            <div className="say">
              <div className="say-head">
                <b>Tell your barber</b>
                <button className="copy" onClick={() => copy(cut.tip)}>
                  <Icon name="copy" size={15} /> Copy
                </button>
              </div>
              <p>{cut.tip}</p>
            </div>
            <div className="meta-row">
              <span>{cap(cut.length)}</span>
              {cut.types.map((t) => (
                <span key={t}>{cap(t)} hair</span>
              ))}
            </div>
            <Button
              variant="secondary"
              className="block"
              onClick={() => {
                close();
                onTryOn();
              }}
            >
              <Icon name="palette" size={18} /> Try a hair color
            </Button>
          </div>
        )}
      </Sheet>
    </Screen>
  );
}
