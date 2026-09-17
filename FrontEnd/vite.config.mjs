import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  root: __dirname,
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
}));
