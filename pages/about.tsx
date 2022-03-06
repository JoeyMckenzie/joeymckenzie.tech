import { VFC } from 'react';
import Head from 'next/head';
import AboutHeader from '@/components/AboutHeader';
import AboutDescription from '@/components/AboutDescription';
import AboutTimeline from '@/components/AboutTimeline';
import { NextSeo } from 'next-seo';

const About: VFC = () => (
  <>
    <NextSeo
      title="joeymckenzie.tech - About"
      description="About Joey McKenzie software engineer joeymckenzie.tech"
    />
    <div className=" min-h-full">
      <div className=" pt-24">
        <AboutHeader />

        <div
          className=" mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense
             lg:grid-cols-3"
        >
          <AboutDescription />
          <AboutTimeline />
        </div>
      </div>
    </div>
  </>
);

export default About;
