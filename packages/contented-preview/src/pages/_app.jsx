import '../styles/globals.css';

import Head from 'next/head';

import Header from '../components/Header';
import { MenuProvider } from '../components/MenuContext';
import { ThemeProvider } from '../components/ThemeContext';

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
