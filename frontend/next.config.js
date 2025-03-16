/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig 