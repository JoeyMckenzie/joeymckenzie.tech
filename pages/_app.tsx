import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { VFC } from 'react';
import Navbar from '@/components/Navbar';
import BlogSearchContextProvider from '@/lib/contexts/blog-search.context';
import AlertContextProvider from '@/lib/contexts/alert.context';
import Modal from '@/components/Modal';
import Notification from '@/components/Notification';
import FooterWithLinks from '@/components/FooterWithLinks';

const CustomApp: VFC<AppProps> = ({ Component, pageProps }) => (
  <BlogSearchContextProvider>
    <AlertContextProvider>
      <Modal />
      <Notification />
      <Navbar />
      <Component {...pageProps} />
      <FooterWithLinks />
    </AlertContextProvider>
  </BlogSearchContextProvider>
);

export default CustomApp;
