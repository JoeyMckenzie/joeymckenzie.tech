import * as stylex from "@stylexjs/stylex";

// Entrance animations are a compiled animation plus a delay, not a wrapper
// component, so nothing extra enters the layout and nothing has to become a
// client component to fade in. They stay CSS rather than Motion because the
// prerendered HTML must not be gated on JavaScript: `/blog` ships all 33 posts
// in the static markup and a JS-driven reveal starting at `opacity: 0` would
// leave that page blank with JS off. A CSS animation always resolves to its
// `to` frame whether or not anything hydrates.
const revealIn = stylex.keyframes({
    from: { opacity: 0, transform: "translateY(12px)" },
    to: { opacity: 1, transform: "none" },
});

// The stagger is capped on purpose. `/blog` renders all 33 posts into the
// static HTML, and an uncapped 60ms step would leave the last row waiting
// almost two seconds before it appeared.
const STEP_MS = 60;
const MAX_STEPS = 6;

const styles = stylex.create({
    base: {
        // `both` holds the from-frame during the delay, so a staggered item
        // does not flash at full opacity before its turn. That same fill is
        // why reduced motion has to drop the animation outright rather than
        // shorten it: at a near-zero duration a delayed item can still be
        // caught mid-from-frame and left invisible.
        animationName: {
            default: revealIn,
            "@media (prefers-reduced-motion: reduce)": "none",
        },
        animationDuration: "620ms",
        animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        animationFillMode: "both",
    },
    delay: (index: number) => ({
        animationDelay: `${Math.min(index, MAX_STEPS) * STEP_MS}ms`,
    }),
});

/** Spread into `stylex.props()` alongside the element's own styles. */
export function reveal(index: number) {
    return [styles.base, styles.delay(index)];
}
