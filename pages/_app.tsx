import Script from 'next/script';
import '../styles/globals.css'

import { ThemeProvider } from 'next-themes';
import Head from 'next/head';

import { Navbar, Footer } from '../components';

import '../styles/globals.css';
import { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => (
    <ThemeProvider attribute="class">
      <div className="dark:bg-nft-dark bg-white min-h-screen">
        <Head>
          <title>RealIncom</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Navbar />
        <div className="pt-65">
          <Component {...pageProps} />
        </div>
        {/* <scrollToTop /> */}
        <Footer />
      </div>

      <Script src="https://kit.fontawesome.com/77a74156e4.js" crossOrigin="anonymous" />
    </ThemeProvider>
);

export default MyApp;
