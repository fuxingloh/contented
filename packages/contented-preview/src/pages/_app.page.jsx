import '../styles/globals.css';

import Head from 'next/head';

import Header from './_components/Header';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>{process.env.SITE_NAME}</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
