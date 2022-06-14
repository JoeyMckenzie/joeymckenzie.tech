import { VFC } from 'react';
import Image from 'next/image';
import profileImage from '@/public/portfolio_pic.jpg';

const HEIGHT_WIDTH_PROFILE_IMAGE_SIZE = 150;

const Intro: VFC = () => (
  <div className="mx-auto flex max-w-4xl flex-row justify-center px-4 pt-36 sm:px-6 lg:px-8">
    <div className="my-auto hidden px-4 sm:block">
      <Image
        height={HEIGHT_WIDTH_PROFILE_IMAGE_SIZE}
        width={HEIGHT_WIDTH_PROFILE_IMAGE_SIZE}
        className="rounded-full"
        src={profileImage}
        alt="Joey McKenzie software engineer joeymckenzie.tech"
      />
    </div>
    <div className="text-center sm:tracking-tight">
      <h2 className="block text-3xl font-extrabold text-gray-900 dark:text-gray-200 sm:text-4xl">
        Joey McKenzie
      </h2>
      <div className="text-gray-900 dark:text-gray-400">
        <p className="block font-semibold">
          Developer. Content creator. Dad joke connoisseur.
        </p>
        <p className="block max-w-sm pt-2">
          Breaking production environments professionally since 2016, creating
          content for other developers and engineers, and building things for the
          web that go really, really fast.
        </p>
      </div>
    </div>
  </div>
);

export default Intro;
