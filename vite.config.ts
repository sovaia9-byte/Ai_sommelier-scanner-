
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load environment variables from the system (like Vercel) during build
  // Using node:process ensures cwd() is available in the type system for the Vite config
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Expose process.env.API_KEY to the client code
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || "undefined")
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      target: 'esnext'
    }
  };
});
