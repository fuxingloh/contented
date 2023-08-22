import '../styles/globals.css';

import Head from 'next/head';

import Header from './_components/Header';
import { MenuProvider } from './_components/MenuContext';
import { ThemeProvider } from './_components/ThemeContext';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{process.env.CONTENTED_PREVIEW_SITE_NAME}</title>
      </Head>
      <ThemeProvider>
        <MenuProvider>
          <Header />
          <main className="bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-300">
            <Component {...pageProps} />
          </main>
        </MenuProvider>
      </ThemeProvider>
    </>
  );
}
