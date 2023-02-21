import { PropsWithChildren } from 'react';

export default function Paragraph({
  children,
}: PropsWithChildren): JSX.Element {
  return <p className="mt-6 text-sm leading-6 text-gray-300">{children}</p>;
}
