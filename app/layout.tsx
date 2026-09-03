import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";

import { colors } from "@/app/tokens.stylex";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const styles = stylex.create({
    body: {
        display: "flex",
        minHeight: "100%",
        flexDirection: "column",
        backgroundColor: colors.background,
        color: colors.foreground,
        // `::selection` has no component to live on -- it applies to text
        // everywhere. The rule itself is one line in `app/globals.css`; these
        // hand it the palette, and custom properties inherit, so the single
        // bare rule reaches the whole page.
        "--selection-bg": colors.primary,
        "--selection-fg": colors.primaryForeground,
    },
    content: { flex: "1" },
});

export const metadata: Metadata = {
    title: {
        default: site.title,
        template: `%s · ${site.title}`,
    },
    description: site.description,
    metadataBase: new URL(site.url),
    alternates: {
        types: { "application/rss+xml": "/rss.xml" },
    },
    openGraph: {
        type: "website",
        siteName: site.title,
        images: ["/images/blog-placeholder-1.jpg"],
    },
    twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    // Dark-only for now, matching the astro site's default. The theme toggle
    // it shipped is not ported yet.
    //
    // `<html>` keeps a `className` rather than a `stylex.props()` spread: it
    // carries nothing but the two font-variable class names next/font
    // generates at build time, and nothing but a class can carry those. The
    // element's own styling, `color-scheme` included, lives with the other
    // element defaults in `app/globals.css`.
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body {...stylex.props(styles.body)}>
                <SiteHeader />
                {/* Activating a view transition is what makes route changes
                    animate at all -- React only calls the browser API when a
                    <ViewTransition> is in the tree during a navigation. This
                    one wraps the content rather than living in each page.tsx
                    because the animation wanted here is an update crossfade on
                    a container that persists, not an enter/exit pair. The
                    `page` class it assigns is styled in `app/globals.css`. */}
                <ViewTransition update="page">
                    <div {...stylex.props(styles.content)}>{children}</div>
                </ViewTransition>
                <SiteFooter />
            </body>
        </html>
    );
}
