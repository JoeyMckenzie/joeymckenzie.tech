import * as React from 'react';

import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import { links } from '@/Components/Navbar';
import { Icon } from '@iconify/react';

export default function MobileMenu(): React.JSX.Element {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Icon icon="ep:menu" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-6">
                {links.map(({ display, name }) => (
                    <DropdownMenuItem
                        className="flex justify-center"
                        key={name}
                    >
                        <Link
                            v-for="{ display, name } of links"
                            href={route(name)}
                        >
                            {display}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
