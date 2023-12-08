import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import * as React from 'react';
import { links } from './Navbar';

export default function DesktopMenu(): React.JSX.Element {
    return (
        <div className="space-x-2">
            {links.map(({ display, name }) => (
                <Link key={name} href={route(name)}>
                    <Button variant="outline">{display}</Button>
                </Link>
            ))}
        </div>
    );
}
