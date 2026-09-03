import type { Metadata } from "next";
import Link from "next/link";

import { revealDelay } from "@/components/reveal";

export const metadata: Metadata = {
    title: "Lost",
    description: "That page does not exist.",
};

// `output: "export"` renders this to `out/404.html`. Cloudflare Pages serves
// that file automatically for any path it cannot match, so this needs no
// routing config -- unlike Workers static assets, which would need an explicit
// `not_found_handling` setting to reach it.
export default function NotFound() {
    return (
        <main className="mx-auto flex w-full max-w-3xl flex-col px-4 pt-20 pb-24">
            {/* Not `aria-hidden`: with no eyebrow above it, this is the only
                thing on the page that says 404, so it has to be readable.
                Each digit reveals on its own beat -- the one bit of showing
                off on the site. */}
            <p
                className="text-primary/90 flex font-mono leading-none font-medium tracking-tighter select-none"
                style={{ fontSize: "clamp(5rem, 26vw, 13rem)" }}
            >
                {["4", "0", "4"].map((digit, index) => (
                    <span
                        key={index}
                        className="reveal"
                        style={revealDelay(index)}
                    >
                        {digit}
                    </span>
                ))}
            </p>

            <h1
                className="font-heading text-display reveal mt-8 font-semibold"
                style={revealDelay(3)}
            >
                You must be lost
                <span className="text-primary">.</span>
            </h1>

            <p
                className="text-muted-foreground reveal mt-6 max-w-md leading-relaxed"
                style={revealDelay(4)}
            >
                This one is on me. Either I moved it, or you have found a link I
                broke somewhere along the way. Happens more often than I would
                like to admit.
            </p>

            <div
                className="reveal mt-10 flex flex-wrap items-center gap-6"
                style={revealDelay(5)}
            >
                <Link
                    href="/"
                    className="text-primary text-label tracking-label decoration-primary/40 hover:decoration-primary font-mono uppercase underline underline-offset-4 transition-colors duration-200"
                >
                    go home
                </Link>
                <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground text-label tracking-label font-mono uppercase transition-colors duration-200"
                >
                    or read something instead
                </Link>
            </div>
        </main>
    );
}
