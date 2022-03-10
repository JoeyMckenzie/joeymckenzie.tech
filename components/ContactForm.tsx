import { VFC } from 'react';
import ContactFormInput from './ContactFormInput';

const ContactForm: VFC = () => (
  <div className="relative">
    <div className="absolute inset-0">
      <div className="absolute inset-y-0 left-0 w-1/2" />
    </div>
    <div className="relative mx-auto max-w-7xl lg:grid lg:grid-cols-5">
      <div className="px-4 sm:px-6 lg:col-span-2 lg:px-8 xl:pr-12">
        <div className="mx-auto max-w-lg">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-3xl">
            Get in touch
          </h2>
          <p className="mt-3 leading-6 text-gray-500 dark:text-gray-400">
            Gotta question for me? Shoot me a message! I&apos;m happy to help
            the developer community however I can, I&apos;ll do my best to get
            back to you in a timely fashion.
          </p>
          <p className="mt-3 pb-6 leading-6 text-gray-500 dark:text-gray-400">
            Interesting in <span className="font-bold">working</span> with me?
            Let me know in the comment!
          </p>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:col-span-3 lg:px-8 xl:pl-12">
        <div className="mx-auto max-w-lg lg:max-w-none">
          <ContactFormInput />
        </div>
      </div>
    </div>
  </div>
);

export default ContactForm;
