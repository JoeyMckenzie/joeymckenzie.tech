import * as stylex from "@stylexjs/stylex";

import { colors } from "@/app/tokens.stylex";

const fill = stylex.keyframes({
    from: { transform: "scaleX(0)" },
    to: { transform: "scaleX(1)" },
});

const styles = stylex.create({
    bar: {
        position: "fixed",
        insetInline: 0,
        top: 0,
        zIndex: 50,
        height: 2,
        backgroundColor: colors.primary,
        transformOrigin: "left",
        pointerEvents: "none",
        // A scroll timeline needs no script, but it also has no graceful
        // degradation: without it the animation runs on time and paints a full
        // bar immediately. `@supports` is what keeps that from shipping.
        display: {
            default: "none",
            "@supports (animation-timeline: scroll())": "block",
        },
        animationName: fill,
        animationTimeline: "scroll(root block)",
        animationTimingFunction: "linear",
        // Ignored by a progress timeline, but a required part of the shorthand
        // longhands StyleX emits -- the timeline drives the position instead.
        animationDuration: "auto",
        animationFillMode: "both",
    },
});

// Scroll position, not motion: it tracks a gesture the reader is already
// making rather than animating on its own, so reduced motion keeps it. The
// `data-scroll-driven` hook is what exempts it from the blanket
// `animation-duration` override in `globals.css`.
export function ReadingProgress() {
    return (
        <div
            data-scroll-driven
            aria-hidden="true"
            {...stylex.props(styles.bar)}
        />
    );
}
