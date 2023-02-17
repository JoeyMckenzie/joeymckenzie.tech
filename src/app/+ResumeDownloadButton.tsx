import { EnvelopeIcon } from '@heroicons/react/20/solid';

export default function ResumeDownloadButton(): JSX.Element {
  return (
    <button
      type="button"
      className="mx-auto inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Download resume
      <EnvelopeIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
    </button>
  );
}
