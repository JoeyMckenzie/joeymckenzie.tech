import * as stylex from "@stylexjs/stylex";

const revealIn = stylex.keyframes({
    from: { opacity: 0, transform: "translateY(12px)" },
    to: { opacity: 1, transform: "none" },
});

const STEP_MS = 60;
const MAX_STEPS = 6;

const styles = stylex.create({
    base: {
        // `both` holds the from-frame during the delay, which is why reduced
        // motion drops the animation rather than shortening it.
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

export function reveal(index: number) {
    return [styles.base, styles.delay(index)];
}
