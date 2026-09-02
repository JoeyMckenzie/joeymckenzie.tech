export const site = {
    title: "joeymckenzie.tech",
    description: "Writing about software, mostly.",
    url: "https://joeymckenzie.tech",
    author: "Joey McKenzie",
} as const;

export const nav = [
    { href: "/", label: "home" },
    { href: "/blog", label: "blog" },
    { href: "/now", label: "now" },
    { href: "/uses", label: "uses" },
    { href: "/cv", label: "cv" },
] as const;
