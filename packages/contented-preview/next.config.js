/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.jsx'],
  swcMinify: true,
  env: {
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME,
    GITHUB_URL: process.env.GITHUB_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
