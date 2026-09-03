import * as stylex from "@stylexjs/stylex";

// An inline SVG turbulence filter rather than an image request: it is a few
// hundred bytes in the stylesheet and costs no round trip.
const NOISE =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const styles = stylex.create({
    grain: {
        position: "fixed",
        inset: 0,
        zIndex: 40,
        backgroundImage: NOISE,
        // Low enough to read as texture on the flat canvas and to disappear
        // entirely over text, which is why it can sit above the content.
        opacity: 0.028,
        pointerEvents: "none",
    },
});

export function Grain() {
    return <div aria-hidden="true" {...stylex.props(styles.grain)} />;
}
