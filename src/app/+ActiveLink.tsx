'use client';

import { usePathname } from 'next/navigation';
import Link, { LinkProps } from 'next/link';
import { PropsWithChildren, useState, useEffect } from 'react';

type ActiveLinkProps = LinkProps & {
  className?: string;
  activeClassName: string;
};

export default function ActiveLink({
  children,
  activeClassName,
  className,
  ...props
}: PropsWithChildren<ActiveLinkProps>) {
  const pathname = usePathname();
  const [computedClassName, setComputedClassName] = useState(className);

  useEffect(() => {
    // Check if the router fields are updated client-side
    // Dynamic route will be matched via props.as
    // Static route will be matched via props.href
    const linkPathname = new URL(props.href as string, location.href).pathname;

    // Using URL().pathname to get rid of query and hash
    const activePathname = new URL(pathname ?? '', location.href).pathname;

    const newClassName =
      linkPathname === activePathname
        ? `${className} ${activeClassName}`.trim()
        : className;

    if (newClassName !== computedClassName) {
      setComputedClassName(newClassName);
    }
  }, [props.href, pathname, activeClassName, className, computedClassName]);

  return (
    <Link className={computedClassName} {...props}>
      {children}
    </Link>
  );
}
