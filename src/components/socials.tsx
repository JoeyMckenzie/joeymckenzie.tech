'use client';

import Link from 'next/link';
import * as React from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

export function Socials() {
  return (
    <NavigationMenu className="mx-auto p-8">
      <NavigationMenuList>
        <NavigationMenuItem>
          <a href="https://github.com/joeymckenie">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <span className="flex flex-row items-center justify-center gap-x-2">
                <FaGithub className="h-4 w-4" />
                GitHub
                <FiExternalLink className="h-4 w-4" />
              </span>
            </NavigationMenuLink>
          </a>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              LinkedIn
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Twitter
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = 'ListItem';
