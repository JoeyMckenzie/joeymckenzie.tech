import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FC } from 'react';
import { classNames } from '@/lib/utilities';

interface ActiveLinkProps {
  className: string;
  activeClassName: string;
  defaultClassName: string;
  href: string;
}

const ActiveLink: FC<ActiveLinkProps> = ({
  children,
  className,
  activeClassName,
  defaultClassName,
  href,
}) => {
  const { pathname } = useRouter();

  const activeClass = (href: string) =>
    pathname === href ? activeClassName : defaultClassName;

  return (
    <Link href={href} passHref>
      <a className={classNames(activeClass(href), className)}>{children}</a>
    </Link>
  );
};

ActiveLink.propTypes = {
  activeClassName: PropTypes.string.isRequired,
};

export default ActiveLink;
