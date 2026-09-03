import * as stylex from "@stylexjs/stylex";
import type { MDXComponents } from "mdx/types";

import { colors, radius } from "@/app/tokens.stylex";

const styles = stylex.create({
    image: {
        marginBlock: 24,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
    },
});

const components: MDXComponents = {
    img: ({ alt, ...props }) => (
        /* eslint-disable-next-line @next/next/no-img-element -- static export, images ship unoptimized */
        <img
            {...props}
            alt={alt ?? ""}
            loading="lazy"
            {...stylex.props(styles.image)}
        />
    ),
};

export function useMDXComponents(): MDXComponents {
    return components;
}
