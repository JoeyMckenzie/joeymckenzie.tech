import * as stylex from "@stylexjs/stylex";
import type { Metadata } from "next";
import Link from "next/link";

import { breakpoints, colors, fonts } from "@/app/tokens.stylex";
import { Main } from "@/components/main";
import { PageHeader } from "@/components/page-header";
import { Prose } from "@/components/prose";
import { SectionLabel } from "@/components/section-label";
import { alternates } from "@/lib/metadata";

const description =
    "What this site is built out of, and why each piece is here.";

export const metadata: Metadata = {
    title: "Colophon",
    description,
    alternates: alternates("/colophon/"),
};

const stack = [
    { name: "Next.js 16", note: "App Router, statically exported" },
    { name: "StyleX", note: "Compiled atomic CSS, no runtime" },
    { name: "MDX + Shiki", note: "Plain markdown, highlighted at build" },
    { name: "Base UI", note: "Unstyled primitives, three of them" },
    { name: "Motion", note: "Exactly one component earns it" },
    { name: "Geist Sans / Mono", note: "Display and instrumentation" },
    { name: "Cloudflare Pages", note: "Serving a folder of files" },
    { name: "nix + devenv", note: "CI and my laptop run the same thing" },
];

const sections = [
    {
        title: "Static by default",
        body: (
            <>
                <p>
                    The whole site is <code>output: &quot;export&quot;</code>.
                    There&apos;s no server runtime, so there are no route
                    handlers that read the request, no server actions, and no
                    server-side <code>searchParams</code>. Every route is a file
                    on disk before anyone asks for it.
                </p>
                <p>
                    That&apos;s also why the build is the real test. A static
                    export fails loudly on anything it can&apos;t represent, so
                    a green build is what guarantees the site ships. A dev
                    server that renders proves nothing. Same reason search and
                    tag filtering on the writing page run in your browser:
                    there&apos;s no server here to read a query string on.
                </p>
            </>
        ),
    },
    {
        title: "Styling",
        body: (
            <>
                <p>
                    StyleX, which replaced Tailwind and a pile of shadcn
                    components. It&apos;s a compiler, so the style objects get
                    read at build time and extracted to atomic CSS. Nothing
                    ships a styling runtime.
                </p>
                <p>
                    The catch is that it fails silently. An invalid property, or
                    a style object nothing reads, compiles to no CSS instead of
                    an error. Two lint rules for valid and unused styles are all
                    that stands between a typo and an unstyled element in
                    production. StyleX has no descendant selectors either, by
                    design, so the last hand-written stylesheet on the site is
                    the one for post bodies. Markdown output gives you nothing
                    to hang a style on.
                </p>
            </>
        ),
    },
    {
        title: "Color and type",
        body: (
            <>
                <p>
                    A warm near-black canvas and one amber accent. I computed
                    the contrast instead of eyeballing it. Body text sits at
                    18.51:1 against the background, the amber at 8.93:1, muted
                    text at 8.72:1, and the hairline borders clear 3:1. That
                    last number does more work than it looks like it should,
                    because this design uses rules where most would use cards.
                    The hairlines are structure.
                </p>
                <p>
                    Geist Sans does the display work and Geist Mono does the
                    instrumentation. Most of the look comes down to the two
                    letter-spacing values. Display type is pulled tight so the
                    counters close up at size. Mono labels are opened right out
                    so they read as machine annotation instead of small prose.
                </p>
            </>
        ),
    },
    {
        title: "Motion",
        body: (
            <>
                <p>
                    Three layers, split by what each tool is good at. Entrances
                    are compiled CSS keyframes, so the prerendered HTML never
                    waits on JavaScript. Turn scripting off and the writing page
                    still lists all 33 posts. Route changes use native view
                    transitions, with the header pinned as a fixed reference
                    point while the content crossfades underneath.
                </p>
                <p>
                    Motion gets used exactly once, on the writing page filter. I
                    tried named view transitions there first and they lost. The
                    search box filters as you type, and every keystroke starts a
                    fresh transition that queues instead of interrupting. A
                    spring just retargets mid-flight. That one component costs
                    38.9 KB gzipped, and it&apos;s the only route that pays for
                    it.
                </p>
                <p>
                    All of it respects <code>prefers-reduced-motion</code>. The
                    reading-progress bar on posts is the one exception, since a
                    scroll timeline drives it instead of a clock. It only moves
                    when you do.
                </p>
            </>
        ),
    },
    {
        title: "Readable by machines",
        body: (
            <p>
                Every post is also its own markdown source. Add{" "}
                <code>index.md</code> to any post URL, or hit the button at the
                top of one. There&apos;s an <a href="/rss.xml">RSS feed</a> and
                an <a href="/llms.txt">llms.txt</a> index of the whole site.
                It&apos;s a folder of static files, so it may as well be
                readable by something that isn&apos;t a browser.
            </p>
        ),
    },
    {
        title: "Lineage",
        body: (
            <p>
                The writing here goes back to October 2019 and has outlived a
                few versions of the site around it, including an Astro one I{" "}
                <Link href="/blog/migrating-to-astro">wrote about in 2023</Link>
                . The posts are markdown in a git repo so that the next rewrite
                is a rendering problem instead of a migration.
            </p>
        ),
    },
];

const styles = stylex.create({
    sections: {
        marginTop: 48,
        display: "flex",
        flexDirection: "column",
        gap: 40,
    },
    section: { display: "flex", flexDirection: "column", gap: 20 },
    list: { display: "flex", flexDirection: "column", gap: 16 },
    row: {
        display: "grid",
        gap: { default: 2, [breakpoints.sm]: 20 },
        gridTemplateColumns: { default: null, [breakpoints.sm]: "11rem 1fr" },
        fontSize: "0.875rem",
    },
    name: { color: colors.foreground, fontFamily: fonts.mono },
    note: { color: colors.mutedForeground },
});

export default function Colophon() {
    return (
        <Main>
            <PageHeader heading="Colophon" intro={description} />

            <div {...stylex.props(styles.sections)}>
                <section {...stylex.props(styles.section)}>
                    <SectionLabel>Stack</SectionLabel>
                    <ul {...stylex.props(styles.list)}>
                        {stack.map((item) => (
                            <li key={item.name} {...stylex.props(styles.row)}>
                                <span {...stylex.props(styles.name)}>
                                    {item.name}
                                </span>
                                <span {...stylex.props(styles.note)}>
                                    {item.note}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                {sections.map((section) => (
                    <section
                        key={section.title}
                        {...stylex.props(styles.section)}
                    >
                        <SectionLabel>{section.title}</SectionLabel>
                        <Prose>{section.body}</Prose>
                    </section>
                ))}
            </div>
        </Main>
    );
}
