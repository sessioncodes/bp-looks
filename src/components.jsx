import React, { useEffect, useRef } from 'react';

const ICONS = {
  scan: 'M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 10h.01M15 10h.01M9.5 15c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1',
  scissors: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12',
  palette: 'M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.8 1.7-1.6 0-.5-.2-.8-.5-1.2-.3-.4-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5c0-4-4-7.4-9-7.4ZM7.5 11.5h.01M10.5 7.5h.01M15.5 7.5h.01',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  camera: 'M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.5-2ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21 15l-5-5L5 21',
  lock: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8Z',
  check: 'm5 12 5 5L20 7',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5',
  alert: 'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  chevron: 'm6 9 6 6 6-6',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  share: 'M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14',
};

export function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

// Draws the photo on a canvas and lays measurement lines on top.
export function PhotoCard({ photo, pts, scanning, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !photo) return;
    c.width = photo.width;
    c.height = photo.height;
    c.getContext('2d').drawImage(photo, 0, 0);
  }, [photo]);

  const line = (a, b, cls, delay) => (
    <line key={cls} className={'mline ' + cls} style={{ animationDelay: delay + 's' }} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" />
  );

  return (
    <div className="photocard" style={{ aspectRatio: photo ? `${photo.width} / ${photo.height}` : '3 / 4' }}>
      <canvas ref={ref} />
      {pts && (
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="overlay">
          {line(pts.top, pts.chin, 'l1', 0.1)}
          {line(pts.cheekL, pts.cheekR, 'l2', 0.4)}
          {line(pts.foreL, pts.foreR, 'l3', 0.7)}
          {line(pts.jawL, pts.jawR, 'l4', 1.0)}
          {['top', 'chin', 'cheekL', 'cheekR', 'foreL', 'foreR', 'jawL', 'jawR'].map((k) => (
            <circle key={k} cx={pts[k].x} cy={pts[k].y} r="0.007" className="mdot" />
          ))}
        </svg>
      )}
      {scanning && <div className="scanline" />}
      {children}
    </div>
  );
}

export function Chip({ active, onClick, children }) {
  return (
    <button className={'chip' + (active ? ' active' : '')} onClick={onClick}>
      {children}
    </button>
  );
}

export function EmptyState({ title, body, cta, onClick }) {
  return (
    <div className="empty">
      <div className="empty-ring">
        <Icon name="scan" size={30} />
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
      {cta && (
        <button className="btn primary" onClick={onClick}>
          {cta} <Icon name="arrow" size={18} />
        </button>
      )}
    </div>
  );
}
