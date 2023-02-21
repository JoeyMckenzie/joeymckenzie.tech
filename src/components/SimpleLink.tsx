import { PropsWithChildren } from 'react';

type SimpleLinkProps = {
  href: string;
};

export default function SimpleLink({
  href,
  children,
}: PropsWithChildren<SimpleLinkProps>): JSX.Element {
  return (
    <a
      href={href}
      className="text-indigo-400 hover:text-indigo-500"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
