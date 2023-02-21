import { RxCode } from 'react-icons/rx';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps): JSX.Element {
  return (
    <span className="inline-flex flex-row items-center space-x-2 text-neutral-400">
      <RxCode className="h-8 w-8 sm:h-10 sm:w-10" />
      <h2 className="font-merriweather text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </span>
  );
}
