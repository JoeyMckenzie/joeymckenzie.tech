import { SOCIALS } from '@/lib/constants';
import { VFC } from 'react';

const SocialsIcons: VFC<{ containerClassName: string }> = ({
  containerClassName,
}) => (
  <div className={containerClassName}>
    {SOCIALS.social.map((item) => (
      <a
        key={item.name}
        href={item.href}
        rel="noreferrer noopener"
        target="_blank"
        className="text-gray-400 transition duration-150 ease-in-out hover:text-gray-500"
      >
        <span className="sr-only">{item.name}</span>
        <item.icon className="h-6 w-6" aria-hidden="true" />
      </a>
    ))}
  </div>
);

export default SocialsIcons;
