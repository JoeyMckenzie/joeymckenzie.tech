import { SVGProps } from 'react';
import {
  BsBoxArrowInUpRight,
  BsFileEarmarkArrowDown,
  BsTwitter,
  BsLinkedin,
  BsGithub,
} from 'react-icons/bs';

type SocialButton = {
  display: string;
  name: string;
  href: string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

const socialButtons: SocialButton[] = [
  {
    display: 'Twitter',
    name: 'Twitter',
    href: 'https://twitter.com/_joeyMcKenzie',
    icon: (props) => <BsTwitter {...props} />,
  },
  {
    display: 'GitHub',
    name: 'GitHub',
    href: 'https://github.com/JoeyMcKenzie',
    icon: (props) => <BsGithub {...props} />,
  },
  {
    display: 'LinkedIn',
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/JoeyMcKenzie',
    icon: (props) => <BsLinkedin {...props} />,
  },
];

export default function SocialButtons(): JSX.Element {
  return (
    <div className="mx-auto grid max-w-screen-md grid-cols-1 space-y-2 px-6 sm:grid-cols-4 sm:gap-x-2 sm:space-y-0">
      {socialButtons.map((social, index) => (
        <a
          href={social.href}
          key={`social-button-${index}`}
          type="button"
          className="inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-700 focus:outline-none"
        >
          <span className="sr-only">{social.name}</span>
          <social.icon className="mr-3 h-5 w-5" />
          {social.display}
          <BsBoxArrowInUpRight
            className="ml-3 -mr-1 h-5 w-5"
            aria-hidden="true"
          />
        </a>
      ))}
      <a
        href="/resume.pdf"
        download="resume"
        target="_blank"
        type="button"
        className="inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-700 focus:outline-none"
      >
        Resume
        <BsFileEarmarkArrowDown
          className="ml-3 -mr-1 h-5 w-5"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
