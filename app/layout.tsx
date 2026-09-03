import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ViewTransition } from "react";

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
    return (
        <html
            lang="en"
            className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <SiteHeader />
                {/* Activating a view transition is what makes route changes
                    animate at all -- React only calls the browser API when a
                    <ViewTransition> is in the tree during a navigation. This
                    one wraps the content rather than living in each page.tsx
                    because the animation wanted here is an update crossfade on
                    a container that persists, not an enter/exit pair. The
                    `page` class it assigns is styled in `app/globals.css`. */}
                <ViewTransition update="page">
                    <div className="flex-1">{children}</div>
                </ViewTransition>
                <SiteFooter />
            </body>
        </html>
    );
}
