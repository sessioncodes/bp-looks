import React from 'react';
import { motion } from 'framer-motion';
import { Icon, Screen } from '../components.jsx';

const SOON = [
  { icon: 'grid', t: 'Before and afters', d: 'Post your new cut and see what worked for people with your face shape.' },
  { icon: 'message', t: 'Honest feedback', d: 'Ask which of two cuts looks better and get real answers.' },
  { icon: 'bookmark', t: 'Shared boards', d: 'Build a board of cuts and send it to your barber.' },
];

export default function Community() {
  return (
    <Screen title="Community" subtitle="Still being built. Here's what's coming.">
      <div className="group">
        {SOON.map((s, i) => (
          <motion.div
            className="soon"
            key={s.t}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="ic">
              <Icon name={s.icon} size={18} />
            </span>
            <div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Screen>
  );
}
