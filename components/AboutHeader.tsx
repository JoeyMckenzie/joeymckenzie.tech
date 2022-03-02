import { VFC } from 'react';
import Image from 'next/image';
import profileImage from '@/public/portfolio_pic.jpg';

const IMAGE_HEIGHT_WIDTH = 75;

const AboutHeader: VFC = () => (
  <div className="mx-auto flex max-w-3xl items-center justify-center px-4 sm:px-6 md:space-x-5 lg:max-w-7xl lg:px-8">
    <div className="flex items-center space-x-5">
      <div className="flex-shrink-0">
        <div className="relative">
          <Image
            width={IMAGE_HEIGHT_WIDTH}
            height={IMAGE_HEIGHT_WIDTH}
            className="rounded-full"
            src={profileImage}
            alt="Joey McKenzie profile pic"
          />
          <span
            className="absolute inset-0 rounded-full shadow-inner"
            aria-hidden="true"
          />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          Joey McKenzie
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Software Engineer at National Funding
        </p>
      </div>
    </div>
  </div>
);

export default AboutHeader;
