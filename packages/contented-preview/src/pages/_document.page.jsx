import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

/**
 * @see pages/_components/ThemeSelector
 */
const colorSchemeScript = `
let mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function updateTheme(savedTheme) {
  let theme = 'system'
  try {
    if (!savedTheme) {
      savedTheme = window.localStorage.theme
    }
    if (savedTheme === 'dark') {
      theme = 'dark'
      document.documentElement.classList.add('dark')
    } else if (savedTheme === 'light') {
      theme = 'light'
      document.documentElement.classList.remove('dark')
    } else if (mediaQuery.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  } catch {
    theme = 'light'
    document.documentElement.classList.remove('dark')
  }
  return theme
}

function updateThemeWithoutTransitions(savedTheme) {
  updateTheme(savedTheme)
  document.documentElement.classList.add('[&_*]:!transition-none')
  window.setTimeout(() => {
    document.documentElement.classList.remove('[&_*]:!transition-none')
  }, 0)
}

document.documentElement.setAttribute('data-theme', updateTheme())

new MutationObserver(([{ oldValue }]) => {
  let newValue = document.documentElement.getAttribute('data-theme')
  if (newValue !== oldValue) {
    try {
      window.localStorage.setItem('theme', newValue)
    } catch {}
    updateThemeWithoutTransitions(newValue)
  }
}).observe(document.documentElement, { attributeFilter: ['data-theme'], attributeOldValue: true })

mediaQuery.addEventListener('change', updateThemeWithoutTransitions)
window.addEventListener('storage', updateThemeWithoutTransitions)
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/favicon/favicon-32x32.png" sizes="32x32" />
      </Head>

      <body className="bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-300">
        <Main />
        <NextScript />
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: colorSchemeScript }}
        />
      </body>
    </Html>
  );
}
