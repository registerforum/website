/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'registerforum.org',
      },
    ],
  },
  // Performance optimizations
  compress: true,
  // Static generation for better performance
  output: 'standalone',
};

module.exports = nextConfig;
