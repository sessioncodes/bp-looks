// Copies the Playbook app (hoops/) into the Vite output so it deploys at /hoops/.
// If Firebase env vars are set (e.g. in Vercel project settings), they are written
// into the deployed firebase-config.js so no keys need to be committed.
import { cpSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const src = resolve('hoops');
const out = resolve('dist', 'hoops');
const skip = new Set(['README.md', 'firebase.json', 'firestore.rules']);

if (!existsSync(resolve('dist'))) throw new Error('Run vite build first: dist/ is missing');
rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true, filter: (p) => !skip.has(p.split(/[\\/]/).pop()) });

const env = process.env;
if (env.FIREBASE_API_KEY) {
  const cfg = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN || `${env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: env.FIREBASE_PROJECT_ID || '',
    appId: env.FIREBASE_APP_ID || '',
    // api/fb-auth.js proxies /__/auth/* so sign-in runs on this domain (needed for iPhone home-screen apps)
    useAuthProxy: !!env.FIREBASE_AUTH_DOMAIN,
  };
  writeFileSync(resolve(out, 'firebase-config.js'), `window.FIREBASE_CONFIG = ${JSON.stringify(cfg, null, 2)};\n`);
  console.log('hoops: Firebase config written from environment');
} else {
  console.log('hoops: no FIREBASE_API_KEY set, team features stay off on the live site');
}
console.log('hoops: copied to dist/hoops');
