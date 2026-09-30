import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// Dev-only endpoint used by tools/hair.html to write processed hair assets
// into public/. Never part of the production build.
const saveAssets = () => ({
  name: 'save-assets',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__save', (req, res) => {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Private-Network': 'true' });
        return res.end();
      }
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        const rel = new URL(req.url, 'http://x').searchParams.get('path') || '';
        const target = resolve('public', rel);
        if (!rel || !target.startsWith(resolve('public'))) {
          res.statusCode = 400;
          return res.end('bad path');
        }
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, Buffer.concat(chunks));
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        res.end('ok');
      });
    });
  },
});

export default defineConfig({ plugins: [react(), saveAssets()] });
