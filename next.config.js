
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // This allows process.env.API_KEY to be accessed in the browser
    // as required by the Gemini SDK integration rules.
    API_KEY: process.env.API_KEY,
  },
  // Optimizations for Vercel deployment
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
