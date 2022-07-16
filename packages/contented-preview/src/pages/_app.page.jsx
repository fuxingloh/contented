import '../styles/globals.css';

import Head from 'next/head';

import Header from './_components/Header';
import { ThemeProvider } from './_components/ThemeContext';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{process.env.SITE_NAME}</title>
      </Head>
      <ThemeProvider>
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
