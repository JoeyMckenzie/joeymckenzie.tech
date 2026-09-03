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
