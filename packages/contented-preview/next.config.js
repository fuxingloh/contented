const { join } = require('node:path');
const { createContentlayerPlugin } = require('next-contentlayer');

/** @type {ContentedConfig} */
// const contentedConfig = require(join(process.env.CONTENTED_CWD, 'contented.js'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts'],
  swcMinify: true,
  env: {
    // SITE_URL: contentedConfig.preview?.url ?? 'https://contented.dev',
    // SITE_NAME: contentedConfig.preview?.name ?? 'Contented',
    // GITHUB_URL: contentedConfig.preview?.github?.url ?? 'https://github.com/BirthdayResearch/contented',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withContentlayer = createContentlayerPlugin({
  configPath: join(__dirname, 'contentlayer.config.js'),
});

module.exports = withContentlayer(nextConfig);
