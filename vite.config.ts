
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables from the current directory. 
  // The empty string as third argument allows loading variables without the VITE_ prefix.
  // This correctly picks up variables set in the Vercel Dashboard during build time.
  // Cast process to any to bypass typing errors where cwd() is missing from the identified Process type.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // This injects the API_KEY into your client-side code at build time.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "")
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      target: 'esnext'
    },
    server: {
      port: 3000
    }
  };
});
