import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load all env variables including those from Vercel system env
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Use the key from Vercel (env.API_KEY) or fallback to local process.env
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || "")
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      target: 'esnext'
    }
  };
});