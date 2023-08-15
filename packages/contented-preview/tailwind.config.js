/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '100rem',
      },
      colors: {
        primary: {
          50: '#FFE5F7',
          100: '#FFCCEF',
          200: '#FF99DF',
          300: '#FF66CF',
          400: '#FF33BF',
          500: '#FF00AF',
          600: '#D60093',
          700: '#AD0077',
          800: '#85005B',
          900: '#5C003F',
        },
        'dark-primary': {
          25: '#2F0421',
          50: '#460632',
          100: '#751657',
          200: '#8F1A6A',
          300: '#CD1F96',
          400: '#D6249E',
          500: '#EE2CB1',
          600: '#F268C7',
          700: '#F8ABE0',
          900: '#FFDFF5',
        },
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
