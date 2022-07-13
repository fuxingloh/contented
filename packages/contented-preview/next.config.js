const { withContentlayer } = require("next-contentlayer");

/** @type {ContentedConfig} */
const contentedConfig = JSON.parse(process.env.CONTENTED_CONFIG);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts"],
  swcMinify: true,
  env: {
    SITE_URL: contentedConfig.url,
    SITE_NAME: contentedConfig.name,
    GITHUB_URL: contentedConfig.github_url,
  },
};

module.exports = withContentlayer(nextConfig);
