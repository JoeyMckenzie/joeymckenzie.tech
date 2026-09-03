# components/

Most of these replaced a shadcn component. The through-line: shadcn ships a
generic slot system sized for a design system, and this is one person's blog with
one design, so each replacement keeps the shape actually used and drops the rest.
Palette and motion notes are in `app/CONTEXT.md`.

## StyleX conventions

Several components declare `style?: StyleXStyles`, shadowing the DOM `style`
prop. That is deliberate: an element carrying a `stylex.props()` spread must not
also receive a `style` or `className`, so the only styling a caller can pass is
StyleX styles.

Where shadcn reached for a `group-hover:` variant, `stylex.when.ancestor(":hover")`
is the equivalent, and it needs the `stylex.defaultMarker()` on the ancestor.
Where shadcn used `:has(input:focus-visible)`, `:focus-within` is used instead —
StyleX generates no `:has()`, and for a text input the two coincide because it is
only ever focused by typing into it.

Descendant selectors do not exist in StyleX by design, so anything that needs one
either restructures (`search-input` lets the icon size itself, since the parent
has no business reaching in) or moves to `globals.css` (`prose`).

## badge

Tag chips on the blog index, the post cards and the post pages are the same
object — a mono, uppercase, label-sized chip — so the three call sites share one
definition rather than repeating four utilities each.

Hover belongs to the element the badge renders _as_, not to the badge. shadcn
scoped that with an `[a]:hover:` variant so a plain informational chip would not
light up under the pointer. StyleX cannot generate that selector and does not
need to: a badge is interactive exactly when a caller hands it something
interactive to render as.

## button

One button, one look. shadcn shipped six variants and nine sizes; the site
renders exactly one — the "clear filters" action in the blog empty state — so the
rest were variants nobody could see and nobody had checked. Add a variant when a
second look actually appears in a design.

The focus ring is a real `outline`. Tailwind's `ring` is a box-shadow emulating
one; this is the thing it was emulating.

## formatted-date

`pubDate` is a bare `YYYY-MM-DD`, which `new Date()` reads as UTC midnight.
Formatting in UTC keeps a post dated the 5th from rendering as the 4th for anyone
west of Greenwich.

## main

Every route renders the same column. It was seven copies of the same six
utilities; it is one component now.

## post-card

A row divided by a rule rather than a card. The rule comes from the list wrapper,
not from the article — the reveal animation wraps each row in its own element, so
a `:last-child` rule on the article would never match.

The stretched-link `::after` is the one pseudo-element worth keeping. It makes
the row a single click target while the tag below stays separately clickable;
nesting the tag inside the link would be invalid HTML and would swallow its
clicks, and no real element can do this without becoming the thing that swallows
them. Two positioning rules exist only to serve it: `position: relative` on the
article (the positioned ancestor it anchors to — remove it and the link covers
the whole page) and `position: relative` on the tag (which keeps it above the
`::after` and clickable in its own right).

The thumbnail morphs into the hero on the post page, which is what makes a click
feel like the same object opening rather than one page replacing another.
`default="none"` keeps it from crossfading on every unrelated navigation. The
other half of the pair is in `app/blog/[slug]/page.tsx`, matched by `name`.

`onTagClick` is supplied by `PostFilters`, where a tag click has to set filter
state rather than navigate: the blog index is already `/blog`, and a same-route
`<Link>` does not remount the filters, so the URL would change without the list
following. Elsewhere (the home page) the tag is a plain link to the filtered
index, which mounts the filters fresh.

## post-filters

The whole post list is already in the page, so filtering is a client-side concern
— a static export has no server to read `searchParams` on.

Both filters start empty so the component prerenders with every post in the
static HTML, which is what crawlers and readers without JS get. A `?tag=&search=`
deep link is applied on mount from `location.search` rather than with
`useSearchParams`, because reading search params during render opts the whole
list out of prerendering and leaves an empty page behind. Filters are mirrored
back into the URL with `replaceState` rather than a router navigation: the App
Router syncs with it and there is no payload to refetch.

**This is the one place Motion earns its bundle, and the only route that pays for
it: +38.9 KB gzipped on `/blog`,** measured against the same build with Motion
removed. The home page and post pages are unchanged.

A named `<ViewTransition>` per row would do the same re-flow natively for
nothing, and that was tried first. It loses because the search box filters as you
type: every keystroke would start a fresh ~400ms view transition, and they queue
rather than interrupt. Motion's springs retarget mid-flight, which is what a live
filter needs. Route changes, which _are_ discrete, still use view transitions.

First paint is deliberately left to the CSS reveal.
`<AnimatePresence initial={false}>` is what keeps Motion from writing an
`opacity: 0` into the prerendered markup, which would blank all 33 posts for
anyone without JS. Verified against `out/blog/index.html` after a build: 33 post
links, zero `opacity:0`. `mode="popLayout"` takes a leaving row out of flow
immediately, so rows below slide up into the gap rather than waiting for the fade.

`useReducedMotion` reads the same media query the stylesheet does, so the two
motion layers stay in agreement rather than one animating while the other sits still.

The empty state was six shadcn components deep for one bordered box.

## prose

The one place the site still hands styling to a stylesheet, and the reason is
structural: this component renders markdown it never writes the elements for, so
there is no element to hang a `stylex.props()` spread on.

The split is deliberate rather than a retreat. StyleX still owns every _value_ —
this component sets the palette as custom properties from the same
`tokens.stylex.ts` the rest of the site reads, so there is one source of truth
for the colours. `app/globals.css` owns only the descendant selectors that CSS
alone can express.

It replaced `@tailwindcss/typography`, whose entire colour set had to be
re-pointed at the palette anyway: its `prose-invert` ramp is cool gray, and body
copy came out `#d1d5dc` against a warm `#0e0d0c` canvas, reading as a different
design from the rest of the page.

## reveal

Entrance animations are a compiled animation plus a delay, not a wrapper
component, so nothing extra enters the layout and nothing has to become a client
component to fade in.

They stay CSS rather than Motion because the prerendered HTML must not be gated
on JavaScript: `/blog` ships all 33 posts in the static markup, and a JS-driven
reveal starting at `opacity: 0` would leave that page blank with JS off. A CSS
animation always resolves to its `to` frame whether or not anything hydrates.

`animation-fill-mode: both` holds the from-frame during the delay so a staggered
item does not flash at full opacity before its turn. That same fill is why
reduced motion drops the animation outright rather than shortening it: at a
near-zero duration a delayed item can still be caught mid-from-frame and left
invisible.

The stagger is capped at six steps on purpose — `/blog` renders all 33 posts, and
an uncapped 60ms step would leave the last row waiting almost two seconds.

In `post-filters`, the CSS reveal sits on an inner element rather than the
`motion.div`. A finished reveal keeps its end frame, and a CSS animation outranks
inline styles — on the same node it would pin opacity and transform and silently
kill every Motion layout animation after the first paint.

## search-input

Replaces shadcn's InputGroup/Input/Textarea trio. Those were a generic slot
system — addons at four alignments, buttons, textareas, block layouts — and the
site uses one shape of it: a search field with a leading icon.

## section-label

The mono section marker used on every page that has sections. The rule is part of
the label rather than a separate element above it: in a design built out of
hairlines, one line that carries the heading reads as structure, where a line
plus a heading reads as two unrelated things.

## site-header

A client component only because the active route has to be read on the client —
a static export has no request to read it from on the server.

The nav links are plain anchors rather than ghost buttons: a ghost button paints
a rounded chip on hover, which fights a design built out of hairline rules. The
indicator does that job instead.

`viewTransitionName: "site-header"` pins the header during route transitions so
it stays a fixed reference point while content crossfades under it. The indicator
is named separately, which lifts it out of the pinned snapshot and lets the
browser slide it between nav items across a route change. That is the whole
reason it is not a Motion `layoutId`: the pinned header would freeze a Motion
animation mid-flight and snap it when the transition ended. The CSS for both is
in `app/globals.css`.

## social-links

LinkedIn is deliberately not shipped by simple-icons (pulled over a trademark
request), so all three stay as raw paths rather than half the row coming from an
icon package.
