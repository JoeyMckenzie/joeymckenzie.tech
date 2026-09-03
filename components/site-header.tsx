"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SocialLinks } from "@/components/social-links";
import { nav } from "@/lib/site";
import { cn } from "@/lib/utils";

// A client component only because the active route has to be read on the
// client -- a static export has no request to read it from on the server.
//
// The nav links are plain anchors rather than ghost `Button`s: a ghost button
// paints a rounded chip on hover, which fights a design built out of hairline
// rules. The indicator below does that job instead.
export function SiteHeader() {
    const pathname = usePathname();

    return (
        // `site-header` pins the header during route transitions so it stays a
        // fixed reference point while the content crossfades under it. The CSS
        // that suppresses its animation is in `app/globals.css`.
        <header
            className="border-b"
            style={{ viewTransitionName: "site-header" }}
        >
            <nav className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4">
                <ul className="flex items-center">
                    {nav.map((item) => {
                        // `/` would prefix-match every route, so it is exact.
                        const active =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                        return (
                            <li key={item.href} className="relative">
                                <Link
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "text-label tracking-label block px-3 py-4 font-mono transition-colors duration-200",
                                        active
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                                {active && (
                                    // Named separately from the header, which
                                    // lifts it out of the pinned snapshot and
                                    // lets the browser slide it between nav
                                    // items across a route change. That is the
                                    // whole reason this is not a Motion
                                    // `layoutId`: the pinned header would
                                    // freeze a Motion animation mid-flight and
                                    // snap it when the transition ended.
                                    <span
                                        aria-hidden="true"
                                        style={{
                                            viewTransitionName: "nav-active",
                                        }}
                                        className="bg-primary absolute inset-x-3 -bottom-px h-px"
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
                <SocialLinks size={16} className="max-sm:hidden" />
            </nav>
        </header>
    );
}
