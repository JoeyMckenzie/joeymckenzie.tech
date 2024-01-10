import Link from "next/link";
import * as React from "react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

type NavLinkProps = {
  href: string;
  display: string;
};

export const links: NavLinkProps[] = [
  {
    display: "Home",
    href: "/",
  },
  {
    display: "Now",
    href: "/now",
  },
  {
    display: "Blog",
    href: "/blog",
  },
];

export function Navbar(): React.JSX.Element {
  return (
    <header>
      <nav className="flex flex-row items-center justify-center gap-x-2 px-6 py-8">
        <div className="space-x-2">
          {links.map(({ display, href }) => (
            <Link key={display} href={href}>
              <Button variant="outline">{display}</Button>
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
