import type { Metadata } from "next";

// Next merges `metadata` down the tree per top-level key, not deeply: a page
// that sets `alternates.canonical` replaces the layout's whole `alternates`
// object, silently taking the RSS autodiscovery `<link>` with it. Every route
// therefore builds its alternates through here rather than by hand.
export function alternates(canonical: string): Metadata["alternates"] {
    return {
        canonical,
        types: { "application/rss+xml": "/rss.xml" },
    };
}
