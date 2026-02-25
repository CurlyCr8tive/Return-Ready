/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router enabled by default in Next.js 14
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig
