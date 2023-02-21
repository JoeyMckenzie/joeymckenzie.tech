import { PropsWithChildren } from 'react';

export default function InlineBold({
  children,
}: PropsWithChildren): JSX.Element {
  return <span className="font-bold">{children}</span>;
}
