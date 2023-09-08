/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SITE_TITLE: 'Personal Economy Control',
    // API_URL: 'http://localhost:3333',
    API_URL: 'https://pec-backend-production-6de7.up.railway.app',
  },
}

module.exports = nextConfig
