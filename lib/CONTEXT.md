# lib/

## posts

Reading time is the same formula the astro site used: 200wpm, rounded up, never
below one. `countWords` matches alphabetic runs rather than splitting on
whitespace, which keeps posts with box-drawing characters in terminal output from
inflating the count.

`pubDate` stays a string through the whole pipeline so it survives the RSC
boundary intact. Normalizing it in `readPost` is not optional: gray-matter's YAML
parse turns an unquoted `2026-08-05` into a `Date` and leaves a quoted one as a
string, so frontmatter written either way has to end up as `YYYY-MM-DD`.

`slug` is the filename without its extension, which is also the route segment.

`getPostSource` reads the file again rather than threading the raw body through
`readPost`. Only the two markdown routes want it, and every other caller would
be carrying a post-sized string it never looks at.

`getPostNeighbors` names its results `older` / `newer` instead of previous /
next. The list is sorted by date, so direction is the only thing a reader can
predict from the label — "previous" is ambiguous about whether it means earlier
in the list or earlier in time.

## site

`repo` and `branch` back the "view source" link on each post. `branch` is
separate because the Next rewrite still lives on `poc/nextjs-again` while `main`
is the Laravel app; promoting it is a one-word change here rather than a hunt
through the post route.
