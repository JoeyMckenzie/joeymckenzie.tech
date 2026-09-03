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
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body {...stylex.props(styles.body)}>
                <SiteHeader />
                <ViewTransition update="page">
                    <div {...stylex.props(styles.content)}>{children}</div>
                </ViewTransition>
                <SiteFooter />
            </body>
        </html>
    );
}
