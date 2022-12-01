import Script from "next/script";
import "../styles/globals.css";

import { ThemeProvider } from "next-themes";
import Head from "next/head";

import { Navbar, Footer } from "../components";
import { NotificationProvider } from "@web3uikit/core";
import { MoralisProvider } from "react-moralis";
import { Provider } from "react-redux";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

import "../styles/globals.css";
import { AppProps } from "next/app";
import { store } from "../redux/store";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/norvirae/realincom-subgraph",
});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <ThemeProvider attribute="class">
          <div className="dark:bg-nft-dark bg-white min-h-screen">
            <Head>
              <title>RealIncom</title>
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
              />
            </Head>
            <Navbar />
            <div className="pt-65">
              <NotificationProvider>
                <Component {...pageProps} />
              </NotificationProvider>
            </div>
            {/* <scrollToTop /> */}
            <Footer />
          </div>

          <Script
            src="https://kit.fontawesome.com/77a74156e4.js"
            crossOrigin="anonymous"
          />
        </ThemeProvider>
      </ApolloProvider>
    </MoralisProvider>
  </Provider>
);

MyApp.displayName = "RealIncom";

export default MyApp;
