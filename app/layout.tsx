import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
                <div className="flex-1">{children}</div>
                <SiteFooter />
            </body>
        </html>
    );
}
