import * as React from 'react';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { ThemeToggle } from '@/Components/ThemeToggle';

type NavLinkProps = {
    name: string;
    display: string;
};

const links: NavLinkProps[] = [
    {
        display: 'Home',
        name: 'home',
    },
    {
        display: 'About',
        name: 'about',
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
                {links.map(({ display, name }) => (
                    <Link
                        v-for="{ display, name } of links"
                        key={name}
                        href={route(name)}
                    >
                        <Button variant="outline">{display}</Button>
                    </Link>
                ))}
                <ThemeToggle />
            </nav>
        </header>
    );
}
