/**
 * Shape the redesigned blog surfaces consume (JOEY-4.1).
 *
 * The index (JOEY-4.2) and post (JOEY-4.3) pages map the read endpoints
 * from JOEY-8 onto this. `publishedLabel` is the pre-formatted display
 * string; `publishedAt` stays ISO for `datetime` attributes and sorting.
 */
export interface BlogPost {
    title: string;
    slug: string;
    description: string;
    tag: string;
    cover: string | null;
    publishedAt: string;
    publishedLabel: string;
    readingMinutes: number;
    views: number;
}

/** Compact view-count label, e.g. 1200 → "1.2k". */
export function formatViews(views: number): string {
    if (views < 1000) {
        return String(views);
    }

    return `${(views / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}
