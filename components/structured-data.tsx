import type { Post } from "@/lib/posts";
import { site } from "@/lib/site";
import { socials } from "@/components/social-links";

// One `<script type="application/ld+json">`. Rendered on the server, so it
// costs no client JavaScript.
//
// `<` is escaped because JSON-LD sits in a raw text element: a title containing
// `</script>` would otherwise close the tag early and inject the rest as markup.
function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    );
}

const LANGUAGE = "en-US";

// `@id`s so the nodes can reference each other instead of repeating themselves,
// which is what lets a post name its author without inlining the whole Person.
const personId = `${site.url}/#person`;
const siteId = `${site.url}/#website`;

const person = {
    "@type": "Person",
    "@id": personId,
    name: site.author,
    url: `${site.url}/`,
    sameAs: socials.map((social) => social.href),
};

export function SiteStructuredData() {
    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@graph": [
                    person,
                    {
                        "@type": "WebSite",
                        "@id": siteId,
                        name: site.title,
                        url: `${site.url}/`,
                        description: site.description,
                        inLanguage: LANGUAGE,
                        publisher: { "@id": personId },
                    },
                ],
            }}
        />
    );
}

export function PostStructuredData({ post }: { post: Post }) {
    const url = `${site.url}/blog/${post.slug}/`;

    return (
        <JsonLd
            data={{
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "BlogPosting",
                        "@id": `${url}#post`,
                        headline: post.title,
                        description: post.description,
                        image: post.heroImage
                            ? new URL(post.heroImage, site.url).href
                            : undefined,
                        datePublished: post.pubDate,
                        author: { "@id": personId },
                        publisher: { "@id": personId },
                        isPartOf: { "@id": siteId },
                        mainEntityOfPage: { "@type": "WebPage", "@id": url },
                        keywords: post.tags.join(", "),
                        inLanguage: LANGUAGE,
                        url,
                    },
                    {
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            { name: "Home", item: `${site.url}/` },
                            { name: "Writing", item: `${site.url}/blog/` },
                            { name: post.title, item: url },
                        ].map((crumb, index) => ({
                            "@type": "ListItem",
                            position: index + 1,
                            ...crumb,
                        })),
                    },
                ],
            }}
        />
    );
}
