export const site = {
    title: "joeymckenzie.tech",
    description: "Writing about software, mostly.",
    url: "https://joeymckenzie.tech",
    author: "Joey McKenzie",
    // Used for `twitter:creator` / `twitter:site`. The profile URL it belongs
    // to lives in `components/social-links.tsx`.
    handle: "@_joeyMcKenzie",
    // Where the "view source" link on each post points. `branch` is separate
    // because the Next rewrite still lives on a branch -- promoting it to
    // `main` is a one-word change here rather than a hunt through the post route.
    repo: "https://github.com/JoeyMckenzie/joeymckenzie.tech",
    branch: "poc/nextjs-again",
} as const;

export const nav = [
    { href: "/", label: "home" },
    { href: "/blog", label: "blog" },
    { href: "/now", label: "now" },
    { href: "/uses", label: "uses" },
    { href: "/cv", label: "cv" },
] as const;
