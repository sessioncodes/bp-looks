import React, { useEffect, useRef } from 'react';

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
  check: 'm5 12 5 5L20 7',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5',
  alert: 'M12 8v5M12 16.5h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  chevron: 'm6 9 6 6 6-6',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  message: 'M21 12a8 8 0 0 1-11.8 7L3 21l2-6.2A8 8 0 1 1 21 12Z',
  bookmark: 'M6 3h12v18l-6-4-6 4V3Z',
};

export function Icon({ name, size = 22, stroke = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

// Draws the photo on a canvas, with optional measurement lines on top.
export function PhotoCard({ photo, pts, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !photo) return;
    c.width = photo.width;
    c.height = photo.height;
    c.getContext('2d').drawImage(photo, 0, 0);
  }, [photo]);

  const line = (a, b, delay) => (
    <line className="mline" style={{ animationDelay: delay + 's' }} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" />
  );

  return (
    <div className="photocard" style={{ aspectRatio: photo ? `${photo.width} / ${photo.height}` : '3 / 4' }}>
      <canvas ref={ref} />
      {pts && (
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="overlay">
          {line(pts.top, pts.chin, 0.1)}
          {line(pts.foreL, pts.foreR, 0.3)}
          {line(pts.cheekL, pts.cheekR, 0.5)}
          {line(pts.jawL, pts.jawR, 0.7)}
          {['top', 'chin', 'cheekL', 'cheekR', 'foreL', 'foreR', 'jawL', 'jawR'].map((k) => (
            <circle key={k} cx={pts[k].x} cy={pts[k].y} r="0.006" className="mdot" />
          ))}
        </svg>
      )}
      {children}
    </div>
  );
}

export function Chip({ active, onClick, children }) {
  return (
    <button className={'chip' + (active ? ' active' : '')} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

export function EmptyState({ icon = 'face', title, body, cta, onClick }) {
  return (
    <div className="empty">
      <div className="empty-ic">
        <Icon name={icon} size={26} />
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
      {cta && (
        <button className="btn primary" onClick={onClick}>
          {cta}
        </button>
      )}
    </div>
  );
}
