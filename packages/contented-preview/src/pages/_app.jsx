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
          <main>
            <Component {...pageProps} />
          </main>
        </MenuProvider>
      </ThemeProvider>
    </>
  );
}
