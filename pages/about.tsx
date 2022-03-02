import { VFC } from 'react';
import Head from 'next/head';
import AboutHeader from '@/components/AboutHeader';
import AboutDescription from '@/components/AboutDescription';
import AboutTimeline from '@/components/AboutTimeline';

const About: VFC = () => (
  <>
    <Head>
      <title>joeymckenzie.tech &middot; About</title>
      <meta title="joeymckenzie.tech About page" />
    </Head>
    <div className="min-h-full">
      <div className="pt-24">
        <AboutHeader />

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <AboutDescription />
          <AboutTimeline />
        </div>
      </div>
    </div>
  </>
);

export default About;
