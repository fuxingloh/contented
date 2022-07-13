/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["page.tsx", "page.ts"],
  swcMinify: true,
  env: {
    SITE_URL: "https://contented.dev",
    SITE_NAME: "Contented Documentation",
    GITHUB_URL: "https://github.com/BirthdayResearch/contented",
  },
};

module.exports = nextConfig;
