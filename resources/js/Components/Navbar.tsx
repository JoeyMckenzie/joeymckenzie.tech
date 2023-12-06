import * as React from 'react';
import { ThemeToggle } from '@/Components/ThemeToggle';
import DesktopMenu from '@/Components/DesktopMenu';
import MobileMenu from '@/Components/MobileMenu';

type NavLinkProps = {
    name: string;
    display: string;
};

export const links: NavLinkProps[] = [
    {
        display: 'Home',
        name: 'home',
    },
    {
        display: 'About',
        name: 'about',
    },
    {
        display: 'Now',
        name: 'now',
    },
    {
        display: 'Blog',
        name: 'blogs',
    },
];

export function Navbar(): React.JSX.Element {
    return (
        <header>
            <nav className="flex flex-row items-center justify-center gap-x-2 px-6 py-8">
                <span className="hidden sm:block">
                    <DesktopMenu />
                </span>
                <span className="block sm:hidden">
                    <MobileMenu />
                </span>
                <ThemeToggle />
            </nav>
        </header>
    );
}
