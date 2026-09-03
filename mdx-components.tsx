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
        /* eslint-disable-next-line @next/next/no-img-element -- post images
           live in `public/` and a static export ships them unoptimized, so
           next/image would buy nothing while demanding intrinsic dimensions
           the markdown does not carry. */
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
