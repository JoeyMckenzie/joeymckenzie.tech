import { Link } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { index } from '@/actions/App/Http/Controllers/BlogController';
import { PageTransition } from '@/components/motion';
import { SpotifyNowPlaying } from '@/components/spotify-now-playing';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cv, home, now, uses } from '@/routes';
import { LaravelLogo } from '@/components/laravel-icon';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { cn } from '@/lib/utils';

const navItems = [
    { href: home(), label: '/home', prefixMatch: false },
    { href: now(), label: '/now', prefixMatch: false },
    { href: index(), label: '/blog', prefixMatch: true },
    { href: uses(), label: '/uses', prefixMatch: false },
    { href: cv(), label: '/cv', prefixMatch: false },
];

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isCurrentUrl, isCurrentOrParentUrl, currentUrl } = useCurrentUrl();
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
            <AnimatedGridPattern
                className={cn(
                    'absolute inset-0 h-full w-full fill-gray-400/[0.04] stroke-gray-400/[0.04]',
                    'mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,white,transparent)]',
                )}
                width={40}
                height={40}
                numSquares={40}
                maxOpacity={0.025}
                duration={3}
                repeatDelay={0.5}
            />
            <header className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <Link
                        href={home()}
                        className="font-semibold tracking-tight text-foreground"
                    >
                        jm.
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        {navItems.map((item) => {
                            const isActive = item.prefixMatch
                                ? isCurrentOrParentUrl(item.href)
                                : isCurrentUrl(item.href);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        'relative transition-colors hover:text-foreground',
                                        isActive
                                            ? 'font-medium text-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {item.label}
                                    {isActive && !shouldReduceMotion && (
                                        <motion.span
                                            layoutId="nav-active"
                                            className="absolute -bottom-1 left-0 h-0.5 w-full bg-foreground"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 30,
                                            }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>
            <PageTransition
                key={currentUrl}
                className="relative z-10 mx-auto w-full max-w-3xl grow px-6 py-10"
            >
                {children}
            </PageTransition>
            <footer className="relative z-10 bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <SpotifyNowPlaying />
                    <a
                        href="https://laravel.com"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <span>Powered by</span>
                        <LaravelLogo className="size-4 fill-current text-[#FF2D20]" />
                    </a>
                </div>
            </footer>
        </div>
    );
}
