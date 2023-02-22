import { BsBoxArrowInUpRight, BsFileEarmarkArrowDown } from 'react-icons/bs';

export default function SocialButtons(): JSX.Element {
  return (
    <div className="mx-auto grid max-w-screen-md grid-cols-1 space-y-2 px-6 md:grid-cols-3">
      <button
        type="button"
        className="inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2"
      >
        Follow me on Twitter
        <BsBoxArrowInUpRight
          className="ml-3 -mr-1 h-5 w-5"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        className="inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2"
      >
        Find me on GitHub
        <BsBoxArrowInUpRight
          className="ml-3 -mr-1 h-5 w-5"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        className="inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2"
      >
        Connect on LinkedIn
        <BsBoxArrowInUpRight
          className="ml-3 -mr-1 h-5 w-5"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        className="inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2"
      >
        Resume
        <BsFileEarmarkArrowDown
          className="ml-3 -mr-1 h-5 w-5"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
