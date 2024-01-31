/** @type {import('prettier').Config} */
const config = {
  printWidth: 120,
  trailingComma: 'all',
  singleQuote: true,
  plugins: [import('prettier-plugin-tailwindcss'), import('prettier-plugin-packagejson')],
};

module.exports = config;
