"use client";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    breakpoints,
    colors,
    fonts,
    text,
    tracking,
} from "@/app/tokens.stylex";
import { SocialLinks } from "@/components/social-links";
import { nav } from "@/lib/site";

const styles = stylex.create({
    // `site-header` pins the header during route transitions so it stays a
    // fixed reference point while the content crossfades under it. The CSS that
    // suppresses its animation is in `app/globals.css`.
    header: {
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: colors.border,
        viewTransitionName: "site-header",
    },
    nav: {
        marginInline: "auto",
        display: "flex",
        width: "100%",
        maxWidth: "48rem",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        paddingInline: 16,
    },
    list: { display: "flex", alignItems: "center" },
    item: { position: "relative" },
    link: {
        display: "block",
        paddingInline: 12,
        paddingBlock: 16,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        transitionProperty: "color",
        transitionDuration: "200ms",
    },
    linkActive: { color: colors.primary },
    linkIdle: {
        color: { default: colors.mutedForeground, ":hover": colors.foreground },
    },
    // Named separately from the header, which lifts it out of the pinned
    // snapshot and lets the browser slide it between nav items across a route
    // change. That is the whole reason this is not a Motion `layoutId`: the
    // pinned header would freeze a Motion animation mid-flight and snap it when
    // the transition ended.
    indicator: {
        position: "absolute",
        insetInline: 12,
        bottom: -1,
        height: 1,
        backgroundColor: colors.primary,
        viewTransitionName: "nav-active",
    },
    socials: { display: { default: "flex", [breakpoints.belowSm]: "none" } },
});

// A client component only because the active route has to be read on the
// client -- a static export has no request to read it from on the server.
//
// The nav links are plain anchors rather than ghost buttons: a ghost button
// paints a rounded chip on hover, which fights a design built out of hairline
// rules. The indicator below does that job instead.
export function SiteHeader() {
    const pathname = usePathname();

    return (
        <header {...stylex.props(styles.header)}>
            <nav {...stylex.props(styles.nav)}>
                <ul {...stylex.props(styles.list)}>
                    {nav.map((item) => {
                        // `/` would prefix-match every route, so it is exact.
                        const active =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                        return (
                            <li key={item.href} {...stylex.props(styles.item)}>
                                <Link
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    {...stylex.props(
                                        styles.link,
                                        active
                                            ? styles.linkActive
                                            : styles.linkIdle
                                    )}
                                >
                                    {item.label}
                                </Link>
                                {active && (
                                    <span
                                        aria-hidden="true"
                                        {...stylex.props(styles.indicator)}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
                <SocialLinks size={16} style={styles.socials} />
            </nav>
        </header>
    );
}
