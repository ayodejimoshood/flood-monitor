/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports for Electron
  distDir: 'out',    // Output directory for the static export
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  // Ensure the app works properly when running in Electron
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : undefined,
};

module.exports = nextConfig; 