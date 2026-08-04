/**
 * Locates the first exact occurrence of `excerpt` in `doc` and computes the
 * document that results from swapping it for `replacement`. Pure and
 * framework-free so it can be unit-tested without CodeMirror; the editor turns
 * the returned offsets into a transaction (JOEY-18.3).
 *
 * Matching is deliberately an exact substring search, first occurrence only —
 * no normalization — so the author sees exactly what changes. Returns `null`
 * when the excerpt is empty or absent, which the panel renders as a disabled,
 * "passage has changed" note.
 */
export type AppliedReplacement = {
    /** Offset of the first excerpt occurrence in the source document. */
    from: number;
    /** Offset just past the matched excerpt in the source document. */
    to: number;
    /** The full document after the replacement is applied. */
    doc: string;
};

export const applyReplacement = (
    doc: string,
    excerpt: string,
    replacement: string,
): AppliedReplacement | null => {
    if (excerpt === '') {
        return null;
    }

    const from = doc.indexOf(excerpt);

    if (from === -1) {
        return null;
    }

    const to = from + excerpt.length;

    return {
        from,
        to,
        doc: doc.slice(0, from) + replacement + doc.slice(to),
    };
};
