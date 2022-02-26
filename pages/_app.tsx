import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { VFC } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogSearchContextProvider from '@/lib/contexts/blog-search.context';
import AlertContextProvider from '@/lib/contexts/alert.context';
import Modal from '@/components/Modal';
import Notification from '@/components/Notification';

const CustomApp: VFC<AppProps> = ({ Component, pageProps }) => (
  <BlogSearchContextProvider>
    <AlertContextProvider>
      <Modal />
      <Notification />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </AlertContextProvider>
  </BlogSearchContextProvider>
);

export default CustomApp;
