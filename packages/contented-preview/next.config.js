/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CONTENTED_PREVIEW_SITE_URL: process.env.CONTENTED_PREVIEW_SITE_URL,
    CONTENTED_PREVIEW_SITE_NAME: process.env.CONTENTED_PREVIEW_SITE_NAME,
    CONTENTED_PREVIEW_GITHUB_URL: process.env.CONTENTED_PREVIEW_GITHUB_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
