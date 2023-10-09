/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '100rem',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            wordWrap: 'break-word',
            p: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
            },
            h1: {
              marginBottom: theme('spacing.4'),
            },
            h2: {
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.2'),
            },
            h3: {
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.2'),
            },
          }
        }
      })
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
