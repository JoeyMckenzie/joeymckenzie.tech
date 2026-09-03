import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";

import { colors } from "@/app/tokens.stylex";

// LinkedIn is deliberately not shipped by simple-icons (pulled over a
// trademark request), so all three stay as raw paths rather than half the row
// coming from an icon package.
const socials = [
    {
        label: "GitHub",
        href: "https://github.com/joeymckenzie",
        viewBox: "0 0 16 16",
        path: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z",
    },
    {
        label: "X",
        href: "https://x.com/_joeyMcKenzie",
        viewBox: "0 0 24 24",
        path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/joeymckenzie",
        viewBox: "0 0 24 24",
        path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
];

const styles = stylex.create({
    row: { display: "flex", alignItems: "center", gap: 14 },
    link: {
        display: "flex",
        color: { default: colors.mutedForeground, ":hover": colors.foreground },
        transitionProperty: "color",
        transitionDuration: "150ms",
    },
});

export function SocialLinks({
    size = 18,
    style,
}: {
    size?: number;
    style?: StyleXStyles;
}) {
    return (
        <div {...stylex.props(styles.row, style)}>
            {socials.map((social) => (
                <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    {...stylex.props(styles.link)}
                >
                    <svg
                        viewBox={social.viewBox}
                        width={size}
                        height={size}
                        aria-hidden="true"
                        fill="currentColor"
                    >
                        <path d={social.path} />
                    </svg>
                </a>
            ))}
        </div>
    );
}
