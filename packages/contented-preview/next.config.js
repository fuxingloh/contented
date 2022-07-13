const { join } = require('node:path');
const { createContentlayerPlugin } = require('next-contentlayer');

/** @type {ContentedPreview} */
const preview = require(join(process.env.CONTENTED_CWD, 'package.json'))?.['contented-preview'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts'],
  swcMinify: true,
  env: {
    SITE_URL: preview?.url ?? 'https://contented.dev',
    SITE_NAME: preview?.name ?? 'Contented',
    GITHUB_URL: preview?.github?.url ?? 'https://github.com/BirthdayResearch/contented',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withContentlayer = createContentlayerPlugin({
  configPath: join(__dirname, 'contentlayer.config.js'),
});

module.exports = withContentlayer(nextConfig);
