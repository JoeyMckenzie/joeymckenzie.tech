import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { VFC } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const CustomApp: VFC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Navbar />
    <Component {...pageProps} />
    <Footer />
  </>
);

export default CustomApp;
