import type { MDXComponents } from "mdx/types";

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
            className="my-6 rounded-lg border"
        />
    ),
};

export function useMDXComponents(): MDXComponents {
    return components;
}
