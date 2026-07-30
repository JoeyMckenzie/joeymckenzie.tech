import { Link, usePage } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import SocialLinks from '@/components/social-links';
import SpotifyNowPlaying from '@/components/spotify-now-playing';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

const NAV = [
    { href: '/', label: 'home', prefix: false },
    { href: '/blog', label: 'blog', prefix: true },
    { href: '/now', label: 'now', prefix: false },
    { href: '/uses', label: 'uses', prefix: false },
    { href: '/cv', label: 'cv', prefix: false },
];

function isActive(pathname: string, href: string, prefix: boolean): boolean {
    if (prefix) {
        return pathname === href || pathname.startsWith(`${href}/`);
    }

    return pathname === href;
}

/**
 * Shared Nocturne chrome for every public page (JOEY-13.1): header nav + a
 * light/dark toggle, and a site-wide mono statusline footer (Spotify slot +
 * socials + colophon). Applied via the layout resolver in app.tsx.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
    const pathname = usePage().url.split('?')[0];
    const { resolvedAppearance, updateAppearance } = useAppearance();

    return (
        <div className="flex min-h-svh flex-col bg-canvas font-body text-prose">
            <header className="border-b border-hairline">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <Link
                        href="/"
                        className="font-mono text-sm font-semibold tracking-tight text-prose"
                    >
                        jm.
                    </Link>

                    <div className="flex items-center gap-5">
                        <nav className="flex items-center gap-5 font-mono text-sm">
                            {NAV.map((item) => {
                                const active = isActive(
                                    pathname,
                                    item.href,
                                    item.prefix,
                                );

                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={cn(
                                            'relative py-1 transition-colors',
                                            active
                                                ? 'text-iris'
                                                : 'text-subtle hover:text-prose',
                                        )}
                                    >
                                        {item.label}
                                        {active && (
                                            <span className="absolute -bottom-[calc(1rem+1px)] left-0 h-px w-full bg-iris" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <button
                            type="button"
                            onClick={() =>
                                updateAppearance(
                                    resolvedAppearance === 'dark'
                                        ? 'light'
                                        : 'dark',
                                )
                            }
                            aria-label="Toggle colour scheme"
                            className="text-subtle transition-colors hover:text-iris"
                        >
                            {resolvedAppearance === 'dark' ? (
                                <Sun className="size-4" aria-hidden />
                            ) : (
                                <Moon className="size-4" aria-hidden />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="grow">{children}</main>

            <footer className="border-t border-hairline">
                <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3 font-mono text-xs text-subtle">
                    <SpotifyNowPlaying />
                    <div className="flex items-center gap-3.5">
                        <SocialLinks />
                        <span aria-hidden className="text-hairline">
                            ·
                        </span>
                        <Link
                            href="/style-guide"
                            className="transition-colors hover:text-iris"
                        >
                            colophon
                        </Link>
                        <span className="nocturne-cursor text-prose">▮</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
