import { Head, usePage } from '@inertiajs/react';

interface SeoProps {
    /** Page title; omit to fall back to the site name (home page). */
    title?: string;
    description: string;
    /** Absolute image URL; falls back to the shared default site image. */
    image?: string | null;
    type?: 'website' | 'article';
    /** ISO 8601 date; only rendered for articles. */
    publishedTime?: string;
    /** Article tag; only rendered for articles. */
    tag?: string;
}

/**
 * Shared social/SEO head block (JOEY-20): canonical link plus Open Graph and
 * Twitter Card tags. The canonical URL, site name, and fallback image come
 * from the `seo` prop shared by HandleInertiaRequests, so pages only supply
 * what's specific to them. Rendered server-side via Inertia SSR, which is
 * what makes these visible to non-JS crawlers (Reddit, Slack, X, etc.).
 */
export function Seo({
    title,
    description,
    image,
    type = 'website',
    publishedTime,
    tag,
}: SeoProps) {
    const { seo } = usePage().props;
    const socialTitle = title ?? seo.siteName;
    const socialImage = image ?? seo.defaultImage;

    return (
        <Head title={title}>
            <meta name="description" content={description} />
            <link rel="canonical" href={seo.url} />

            <meta property="og:title" content={socialTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={socialImage} />
            <meta property="og:url" content={seo.url} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={seo.siteName} />

            {/* summary_large_image only when we have a real cover; the fallback icon is square. */}
            <meta
                name="twitter:card"
                content={image ? 'summary_large_image' : 'summary'}
            />
            <meta name="twitter:title" content={socialTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={socialImage} />

            {type === 'article' && publishedTime && (
                <meta
                    property="article:published_time"
                    content={publishedTime}
                />
            )}
            {type === 'article' && tag && (
                <meta property="article:tag" content={tag} />
            )}
        </Head>
    );
}
