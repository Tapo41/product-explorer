/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['worldofbooks.com', 'cdn.worldofbooks.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.worldofbooks.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
};

module.exports = nextConfig;