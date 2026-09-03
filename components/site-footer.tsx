import * as stylex from "@stylexjs/stylex";

import { colors, fonts, text, tracking } from "@/app/tokens.stylex";
import { SocialLinks } from "@/components/social-links";
import { site } from "@/lib/site";

const styles = stylex.create({
    footer: {
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: colors.border,
    },
    inner: {
        marginInline: "auto",
        display: "flex",
        width: "100%",
        maxWidth: "48rem",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        paddingInline: 16,
        paddingBlock: 40,
    },
    line: {
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
    },
    slash: { paddingInline: 8, opacity: 0.4 },
    rss: {
        color: { default: "inherit", ":hover": colors.primary },
        transitionProperty: "color",
        transitionDuration: "200ms",
    },
});

export function SiteFooter() {
    return (
        <footer {...stylex.props(styles.footer)}>
            <div {...stylex.props(styles.inner)}>
                <p {...stylex.props(styles.line)}>
                    &copy; {new Date().getFullYear()} {site.author}
                    <span {...stylex.props(styles.slash)} aria-hidden="true">
                        /
                    </span>
                    <a href="/rss.xml" {...stylex.props(styles.rss)}>
                        rss
                    </a>
                </p>
                <SocialLinks size={16} />
            </div>
        </footer>
    );
}
