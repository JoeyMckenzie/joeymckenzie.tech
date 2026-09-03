"use client";

import { useEffect } from "react";

import { site } from "@/lib/site";

// For whoever opens devtools. Runs once per page load, logs nothing after.
//
// The two colours are literals rather than tokens on purpose: this is a
// devtools format string, not a stylesheet, so there is no StyleX variable for
// it to read. They mirror `primary` and `mutedForeground` in `tokens.stylex.ts`.
export function ConsoleSignature() {
    useEffect(() => {
        console.log(
            `%c${site.title}%c\nnext + stylex, statically exported\n${site.repo}`,
            "color:#f0b46a;font-weight:600",
            "color:#7d766c"
        );
    }, []);

    return null;
}
