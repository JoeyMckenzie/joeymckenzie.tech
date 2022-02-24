import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { VFC } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogSearchContextProvider from '@/lib/contexts/blog-search.context';

const CustomApp: VFC<AppProps> = ({ Component, pageProps }) => (
  <BlogSearchContextProvider>
    <Navbar />
    <Component {...pageProps} />
    <Footer />
  </BlogSearchContextProvider>
);

export default CustomApp;
