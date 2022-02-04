import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { VFC } from 'react';
import MainLayout from '../layouts/MainLayout';

const CustomApp: VFC<AppProps> = ({ Component, pageProps }) => (
  <MainLayout>
    <Component {...pageProps} />
  </MainLayout>
);

export default CustomApp;
