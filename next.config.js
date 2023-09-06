/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    SITE_TITLE: 'P.E Control',
    API_URL: 'http://localhost:3333',
    // API_URL: 'https://backend-portfolio-v3-production.up.railway.app',
  },
}

module.exports = nextConfig
