import type { CSSProperties } from "react";

// Entrance animations are a class plus a custom property rather than a wrapper
// component, so nothing extra enters the layout and nothing has to become a
// client component to fade in. The keyframes live in `app/globals.css`; the
// reason they are CSS and not Motion is in the MOTION block there.
//
// The stagger is capped on purpose. `/blog` renders all 33 posts into the
// static HTML, and an uncapped 60ms step would leave the last row waiting
// almost two seconds before it appeared.
const STEP_MS = 60;
const MAX_STEPS = 6;

export function revealDelay(index: number): CSSProperties {
    return {
        "--reveal-delay": `${Math.min(index, MAX_STEPS) * STEP_MS}ms`,
    } as CSSProperties;
}
