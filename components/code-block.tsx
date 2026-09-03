"use client";

import * as stylex from "@stylexjs/stylex";
import { CheckIcon, CopyIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { isValidElement, useEffect, useRef, useState } from "react";

import { colors, fonts, text, tracking } from "@/app/tokens.stylex";

const styles = stylex.create({
    // Positioned ancestor for the controls, and the hover target that brings
    // the copy button up to full strength.
    wrapper: { position: "relative" },
    // Sits over the strip `[data-prose] pre` reserves with its top padding, so
    // it needs the same inline padding the code itself has.
    controls: {
        position: "absolute",
        top: 10,
        insetInline: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // The strip spans the full block; only the button should take a click.
        pointerEvents: "none",
    },
    language: {
        color: colors.mutedForeground,
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
    },
    copy: {
        pointerEvents: "auto",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        marginInlineStart: "auto",
        color: {
            default: colors.mutedForeground,
            ":hover": colors.primary,
            ":focus-visible": colors.primary,
        },
        fontFamily: fonts.mono,
        fontSize: text.label,
        lineHeight: text.labelLineHeight,
        letterSpacing: tracking.label,
        textTransform: "uppercase",
        // Quiet until wanted, but never fully hidden -- a pointer is not the
        // only way to reach this and touch has no hover to reveal it with.
        opacity: {
            default: 0.45,
            [stylex.when.ancestor(":hover")]: 1,
            ":focus-visible": 1,
        },
        cursor: "pointer",
        transitionProperty: "color, opacity",
        transitionDuration: "150ms",
        outlineWidth: { default: 0, ":focus-visible": 2 },
        outlineStyle: "solid",
        outlineOffset: 3,
        outlineColor: `color-mix(in oklab, ${colors.ring} 50%, transparent)`,
    },
    copied: { color: colors.primary, opacity: 1 },
});

const RESET_MS = 1600;
const LANGUAGE_PREFIX = "language-";

export function CodeBlock({
    className,
    children,
    ...props
}: ComponentPropsWithoutRef<"pre">) {
    const wrapper = useRef<HTMLDivElement>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [copied, setCopied] = useState(false);

    useEffect(() => () => clearTimeout(timer.current), []);

    // `addLanguageClass` in `next.config.ts` is what puts this here, and it
    // puts it on the inner `code` rather than on this `pre` -- so the label is
    // read off the child element, not off our own `className`.
    const language = isValidElement<{ className?: string }>(children)
        ? children.props.className
              ?.split(" ")
              .find((name) => name.startsWith(LANGUAGE_PREFIX))
              ?.slice(LANGUAGE_PREFIX.length)
        : undefined;
    // Shiki falls back to `plaintext` for a fence with no language, which is an
    // implementation detail rather than something worth labelling.
    const label =
        language && language !== "plaintext" && language !== "text"
            ? language
            : undefined;

    async function copy() {
        const code = wrapper.current?.querySelector("code")?.textContent;

        if (code == null) return;

        try {
            await navigator.clipboard.writeText(code);
        } catch {
            // Denied permission or an insecure origin. Nothing useful to say.
            return;
        }

        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), RESET_MS);
    }

    return (
        <div
            ref={wrapper}
            {...stylex.props(styles.wrapper, stylex.defaultMarker())}
        >
            {/* Shiki owns this element's class and inline colours, so it is the
                one element here that cannot take a `stylex.props()` spread. */}
            <pre className={className} {...props}>
                {children}
            </pre>
            <div {...stylex.props(styles.controls)}>
                {label && (
                    <span {...stylex.props(styles.language)}>{label}</span>
                )}
                <button
                    type="button"
                    onClick={copy}
                    aria-label={copied ? "Copied" : "Copy code"}
                    {...stylex.props(styles.copy, copied && styles.copied)}
                >
                    {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                    <span aria-hidden="true">{copied ? "copied" : "copy"}</span>
                </button>
            </div>
        </div>
    );
}
