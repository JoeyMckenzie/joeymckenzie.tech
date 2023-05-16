import type { Component, ParentProps } from 'solid-js';

const ResumeDownload: Component<ParentProps> = (props) => {
  return (
    <a
      href="/resume.pdf"
      download="resume"
      target="_blank"
      type="button"
      class="inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-700 focus:outline-none sm:px-4"
    >
      Resume
      {props.children}
    </a>
  );
};

export default ResumeDownload;
