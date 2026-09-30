import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { outlinePoints, P, toPath } from './lib/outline.js';

const ICONS = {
  scan: 'M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 10h.01M15 10h.01M9.5 15c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1',
  scissors: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12',
  palette: 'M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.8 1.7-1.6 0-.5-.2-.8-.5-1.2-.3-.4-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4-4-7.4-9-7.4ZM7.5 11.5h.01M10.5 7.5h.01M15.5 7.5h.01',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  camera: 'M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.5-2ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21 15l-5-5L5 21',
  lock: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  glasses: 'M6 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM18 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM10 14c1.3-1 2.7-1 4 0M2 14l1.5-7M22 14l-1.5-7',
  face: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9 10h.01M15 10h.01M9 15h6',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5',
  alert: 'M12 8v5M12 16.5h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  chevron: 'm9 6 6 6-6 6',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  message: 'M21 12a8 8 0 0 1-11.8 7L3 21l2-6.2A8 8 0 1 1 21 12Z',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
  heart: 'M12 20s-7.5-4.6-9.4-9.3A5 5 0 0 1 12 6.2a5 5 0 0 1 9.4 4.5C19.5 15.4 12 20 12 20Z',
  copy: 'M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1ZM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  download: 'M12 3v12M7 10l5 5 5-5M4 21h16',
  sliders: 'M9 6l-6 6 6 6M15 6l6 6-6 6',
  check: 'm5 12 5 5L20 7',
};

export function Icon({ name, size = 22, stroke = 1.8, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function Button({ variant = 'primary', className = '', children, ...rest }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 600, damping: 30 }} className={`btn ${variant} ${className}`} {...rest}>
      {children}
    </motion.button>
  );
}

/* ---------- navigation ---------- */

export function TabBar({ tabs, active, onChange }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button key={t.id} className={'tab' + (on ? ' on' : '')} onClick={() => onChange(t.id)} aria-current={on ? 'page' : undefined}>
            <motion.span animate={on ? { scale: [1, 0.8, 1.12, 1], y: [0, 1, -2, 0] } : { scale: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Icon name={t.icon} size={24} stroke={on ? 2 : 1.7} />
            </motion.span>
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// iOS-style large title that hands off to a compact bar when scrolled.
export function Screen({ title, subtitle, children }) {
  const ref = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { rootMargin: '-52px 0px 0px 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {createPortal(
        <div className={'navbar' + (scrolled ? ' scrolled' : '')}>
          <span>{title}</span>
        </div>,
        document.body
      )}
      <header className="large-title">
        <h1 ref={ref}>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </header>
      {children}
    </>
  );
}

export function Segmented({ id, options, value, onChange, scroll }) {
  return (
    <div className={'segmented' + (scroll ? ' scroll' : '')} role="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={String(o.value)} role="tab" aria-selected={on} className={on ? 'on' : ''} onClick={() => onChange(o.value)}>
            {on && <motion.span layoutId={id} className="seg-pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <span className="seg-label">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Chip({ active, onClick, children }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} className={'chip' + (active ? ' on' : '')} onClick={onClick} aria-pressed={active}>
      {children}
    </motion.button>
  );
}

/* ---------- overlays ---------- */

export function Sheet({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="sheet"
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 340 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <div className="grabber" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function Toaster() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    let t;
    const on = (e) => {
      setMsg({ text: e.detail, id: Date.now() });
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 1900);
    };
    window.addEventListener('bp-toast', on);
    return () => {
      window.removeEventListener('bp-toast', on);
      clearTimeout(t);
    };
  }, []);
  return (
    <div className="toast-wrap" aria-live="polite">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg.id}
            className="toast"
            initial={{ y: -30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          >
            <Icon name="check" size={16} stroke={2.4} /> {msg.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- data display ---------- */

export function CountUp({ value, decimals = 0, duration = 1, delay = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, value, { duration, delay, ease: [0.2, 0.8, 0.2, 1], onUpdate: setV });
    return () => c.stop();
  }, [value, duration, delay]);
  return <>{v.toFixed(decimals)}</>;
}

export function FitBars({ n, best }) {
  return (
    <span className={'fitbars' + (best ? ' best' : '')} aria-label={`${n} out of 5`}>
      {[1, 2, 3, 4, 5].map((k) => (
        <i key={k} className={k <= n ? 'on' : ''} />
      ))}
    </span>
  );
}

/* ---------- face outline that morphs between shapes ---------- */

// easeOutBack: a little overshoot so the morph feels springy
const ease = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;

function useMorph(target, duration = 750) {
  const [pts, setPts] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    const from = cur.current;
    let raf;
    let start;
    const step = (ts) => {
      start ??= ts;
      const t = Math.min(1, (ts - start) / duration);
      const e = ease(t);
      const next = from.map((p, i) => [p[0] + (target[i][0] - p[0]) * e, p[1] + (target[i][1] - p[1]) * e]);
      cur.current = next;
      setPts(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return pts;
}

export function ShapeMorph({ shape, from = null, guides = true, className = '' }) {
  const [current, setCurrent] = useState(from ?? shape);
  useEffect(() => {
    // lets a caller start from one shape and morph into another on mount
    const t = setTimeout(() => setCurrent(shape), from ? 250 : 0);
    return () => clearTimeout(t);
  }, [shape, from]);
  const target = useMemo(() => outlinePoints(current), [current]);
  const p = useMorph(target);
  const L = (a, b) => <line x1={p[a][0]} y1={p[a][1]} x2={p[b][0]} y2={p[b][1]} />;

  return (
    <svg viewBox="-4 0 208 244" className={'morph ' + className} aria-hidden="true">
      <path d={toPath(p)} className="outline" />
      {guides && (
        <g className="guides">
          {L(P.top, P.chin)}
          {L(P.foreL, P.foreR)}
          {L(P.cheekL, P.cheekR)}
          {L(P.jawL, P.jawR)}
          {[P.top, P.chin, P.cheekL, P.cheekR].map((i) => (
            <circle key={i} cx={p[i][0]} cy={p[i][1]} r="4.5" />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ---------- photo with face overlay ---------- */

const LINES = [
  ['top', 'chin'],
  ['foreL', 'foreR'],
  ['cheekL', 'cheekR'],
  ['jawL', 'jawR'],
];

export function PhotoCard({ photo, pts, mesh, reveal, children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !photo) return;
    c.width = photo.width;
    c.height = photo.height;
    c.getContext('2d').drawImage(photo, 0, 0);
  }, [photo]);

  const W = photo?.width ?? 3;
  const H = photo?.height ?? 4;
  const r = W / 260;

  return (
    <div className={'photocard ' + className} style={{ aspectRatio: `${W} / ${H}` }}>
      <canvas ref={ref} />
      <svg viewBox={`0 0 ${W} ${H}`} className="overlay" aria-hidden="true">
        {mesh && (
          <g className={'mesh' + (reveal ? ' reveal' : '')}>
            {mesh.map(([x, y], i) => (
              <circle key={i} cx={x * W} cy={y * H} r={r * 0.8} style={reveal ? { animationDelay: (y * 1.2).toFixed(3) + 's' } : undefined} />
            ))}
          </g>
        )}
        {pts && (
          <g className="measure">
            {LINES.map(([a, b], i) => (
              <motion.path
                key={a}
                d={`M${pts[a].x * W},${pts[a].y * H} L${pts[b].x * W},${pts[b].y * H}`}
                strokeWidth={W / 320}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.12, ease: 'easeOut' }}
              />
            ))}
            {LINES.flat().map((k, i) => (
              <motion.circle
                key={k}
                cx={pts[k].x * W}
                cy={pts[k].y * H}
                r={r * 2.2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.3 + i * 0.05 }}
                style={{ transformOrigin: `${pts[k].x * W}px ${pts[k].y * H}px` }}
              />
            ))}
          </g>
        )}
      </svg>
      {children}
    </div>
  );
}

export function EmptyState({ icon = 'face', title, body, cta, onClick }) {
  return (
    <motion.div className="empty" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
      <motion.div className="empty-ic" animate={{ y: [0, -6, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}>
        <Icon name={icon} size={28} />
      </motion.div>
      <h2>{title}</h2>
      <p>{body}</p>
      {cta && <Button onClick={onClick}>{cta}</Button>}
    </motion.div>
  );
}
