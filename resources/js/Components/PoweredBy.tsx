import * as React from 'react';
import { usePage } from '@inertiajs/react';
import { Icon } from '@iconify/react';

const poweredBy = [
    {
        display: 'Larvel',
        href: 'https://laravel.com',
        icon: 'logos:laravel',
    },
    {
        display: 'React',
        href: 'https://reactjs.org',
        icon: 'logos:react',
    },
    {
        display: 'Inertia.js',
        href: 'https://inertiajs.com',
        icon: 'simple-icons:inertia',
    },
    {
        display: 'Fly.io',
        href: 'https://fly.io',
        icon: 'logos:fly-icon',
    },
];

export default function PoweredBy(): React.JSX.Element {
    const page = usePage();
    const commitSha = (page.props.commit as string) ?? '';
    const commitShaForDisplay = commitSha.substring(0, 6);
    const commitUrl = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${commitSha}`;

    return (
        <div className="mx-auto inline-flex flex-row items-center gap-x-3 md:mx-0">
            <p className="font-ubuntu text-center text-xs leading-5">
                Powered by
            </p>
            {poweredBy.map(({ icon, href, display }) => (
                <a key={icon} href={href}>
                    <span className="sr-only">{display}</span>
                    <Icon
                        icon={icon}
                        className="h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    />
                </a>
            ))}

            <a
                href={commitUrl}
                className="font-ubuntu text-center text-xs leading-5 hover:underline"
            >
                {commitShaForDisplay}
            </a>
        </div>
    );
}
