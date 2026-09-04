# Voice evidence

Measured across all 33 posts in `content/blog/`, 2019-08 through 2026-08, on 2026-09-04.
Prose only: code fences were stripped before counting. 113,079 words total, 77,648 with
code removed. "Files" means files containing the pattern, out of 33.

Recount before trusting these after a batch of new posts. The commands are inline so
they can be rerun.

## Hard rules

### Em dashes: 1 file of 33

```
rg -l '—' content/blog/*.md
```

The lone hit is `content-driven-websites-with-php-and-laravel.md`. Across 77k words of
prose he restructures instead: comma, parenthesis, colon, or a new sentence. This is the
highest-signal rule in the file.

### Sign-off: 25 files of 33

Exact closing line frequency:

| Closing                                                                                                              | Count |
| -------------------------------------------------------------------------------------------------------------------- | ----- |
| `Until next time, friends!`                                                                                          | 17    |
| `Until next time, amigos!`                                                                                           | 3     |
| variants: `Until next, friends!`, `Until next time friends!`, `Until next time, friend!`                             | 3     |
| preceded by a clause: "Well, I think I've rambled on long enough.", "Stay tuned for another one of these ramblings." | 2     |
| genuinely different (all 2019-2022, before the habit set)                                                            | 8     |

The early exceptions show the habit forming, not an alternative he still uses:
"Crack open a cold, you deserve it." (2019), "And with that... I think it's time for a
beer. Cheers everyone!" (2020), "Happy dark mode-ing, friends!" (2021).

### Descriptions are jokes, never summaries

Every one of the 33. A sample across the years:

- "Beer and code... a match made in heaven." (2019)
- "Redux... redux ALL the things!" (2020)
- "If you're website doesn't have dark, it's a no for me dawg." (2021, typo his)
- "Believe it not, it's actual legal to use RxJS outside of Angular." (2022)
- "Identity theft is not a joke, Jim!" (2023)
- "I like my PHP like I like my Rust... statically analyzed." (2025)
- "This blog post could have been tweet, but yet here I am." (2025)
- "Neovim (btw)" (2026)
- "We have Herd at home." (2026)

Note how many trail off with "..." into the punchline. That is the dominant shape.

## Signatures

| Pattern                                              | Files | Occurrences                |
| ---------------------------------------------------- | ----- | -------------------------- |
| italic stress on a single word (`_not_`, `_really_`) | —     | 469                        |
| `heck`                                               | —     | 120                        |
| parenthetical aside                                  | —     | 135 (excluding links/code) |
| `ole`                                                | —     | 60                         |
| `Until next time`                                    | 25    | —                          |
| `I'll leave` (deferral)                              | 13    | —                          |
| `rainy day`                                          | 11    | —                          |
| `exercise for the reader`                            | 9     | —                          |
| `scratch` (an itch)                                  | 9     | —                          |
| `gonna`                                              | —     | 10                         |
| `imo`                                                | —     | 8                          |
| `no pun intended`                                    | 6     | —                          |
| `smarter than` (me)                                  | 6     | —                          |
| `btw`                                                | —     | 5                          |
| `as the kids say`                                    | 4     | —                          |
| `curmudgeon`                                         | 3     | —                          |
| `ain't`                                              | —     | 3                          |

Most-italicised words: `_not_` (9), `_could_` (9), `_really_` (7), `_how_` (7), `_also_` (7).

## Openings

Every post opens on a person, not a technology. The full first-clause list is worth
skimming when a draft's opening feels off:

- "So I've been looking for a reason to write code to keep me sane while in the thick of parental leave..."
- "During a recent quarter (third?) life crisis, I decided to do what every developer does..."
- "I'm back on my bullshit (as the kids say)..."
- "Back from a hard fought battle against writer's block..."
- "I'm finally back from paternity leave..."
- "As an unapologetic wrestling fan, I felt exactly like A.J. Styles burying Undertaker in Wrestlemania 36..."
- "It's almost 5 o'clock, you've just deployed the latest API build... Then, the Slack messages begin."
- "I've been on a spiritual journey this past year or so really tinkering with my dev workflow..."
- "Welcome to buzzword bingo, a.k.a. how many resume keywords can we fit in one blog post before someone stops reading."

The one structural exception is a series continuation ("Two layers down, two to go."),
which is its own valid opening move.

## Vocabulary that is his

Corpus-verified. Flagging any of these as generated prose is a false positive:

`utilize` 18 files · `in essence` 10 · `essentially` 9 · `however,` 8 · `more or less` 6 ·
`leverage` 6 · `basically` 4 · `robust` 4 · `simply put` 3 · `that said` 3 · `dive into` 2 ·
`seamless` 2 · `delve` 1 · `furthermore` 1

## Vocabulary that never appears

Zero hits in 33 posts:

`it's worth noting` · `in this article` · `moreover` · `in conclusion` · `crucial` ·
`unlock` · `elevate` · `game-changer` · `in today's landscape`

## Structure

149 H2 headings across 33 posts, roughly 4.5 per post. Sentence case, short, frequently
a joke or a pun: "Rusti-fying our .NET code", "Refactoring on easy mode", "Backlogging the
backlog", "Something something profit", "Not your dad's web server", "Liquid motivation",
"B.Y.O.C. (Bring Your Own Client)", "The never ending configuration", "Tearing down".

The recurring skeleton, most consistent in posts after 2023:

1. Personal hook, why he was even doing this
2. A pivot line: "Okay, that's enough talk. Let's get into it!" / "Okay, rant aside" / "To the code!"
3. Body sections, each usually one tool or one problem
4. `## Wrapping up` with bulleted takeaways
5. Sign-off

## Voice drift over time

2019-2020 posts read noticeably more formal and tutorial-shaped: heavy "let's go ahead
and", instructional "we", almost no jokes in the body, no sign-off habit. The current
voice consolidates around 2022-2023. When calibrating a draft, weight posts from 2024
onward and treat the Clean Architecture series as historical.

## Corrections

Notes Joey has rejected, and what that taught. Append with dates; do not rewrite the
counts above.

_(none yet)_
