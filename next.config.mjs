/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for Vercel/Netlify
  images: {
    unoptimized: true, // Required for static export
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Compress output
  compress: true,
  // Enable SWC minification
  swcMinify: true,
  // Generate sitemap
  trailingSlash: true,
};

export default nextConfig;
