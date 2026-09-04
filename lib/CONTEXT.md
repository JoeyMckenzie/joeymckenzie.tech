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

## drafts

`draft: true` in a post's frontmatter hides it from everything downstream of
`getPosts`: the index, the archive, the feed, the sitemap, `llms.txt`, and
`generateStaticParams`, which is what denies it a route. The gate is
`SHOW_DRAFTS`, read from `NODE_ENV` once at module scope, so `next dev` shows
drafts at their real URLs and `next build` omits them.

Two consequences worth knowing. Tag counts on the blog index include drafts in
dev, since `getTags` runs off the same list. And a draft file is compiled into
the bundle in both modes, because the post route's dynamic import is a context
module over the whole of `content/blog`; in production nothing renders it, so
the cost is a few KB rather than an exposure.

`components/post-card.tsx` and the post route both render a `draft` badge off
`post.draft`. It can only ever be true under `next dev`, so it costs the
production build nothing.

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
