/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for Vercel/Netlify
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
