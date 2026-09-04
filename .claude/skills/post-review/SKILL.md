---
name: post-review
description: "Editorial notes on a joeymckenzie.tech draft: voice drift, mechanics, and where the piece can be sharpened. Use when asked to review, edit, critique, proofread, or give feedback on a post in content/blog/ or any draft written in Joey's voice."
---

<what-to-do>

Give **notes, not rewrites**. Joey writes the prose; this skill tells him where it is not working and why. Editing the file directly is out of scope unless he asks for a specific fix after reading the note.

1. **Read the draft end to end before writing a single note.** A note about the opening is wrong if the piece earns it back in section four.
2. **Read two published posts for calibration**, picked from `content/blog/` by closest topic and most recent date. The voice profile below is the summary; the posts are the source of truth. Skip this only when the draft is under ~300 words.
3. **Pass one, drift.** Walk the draft against [Voice](#voice). Every drift note quotes the offending text and names which rule it breaks.
4. **Pass two, mechanics.** Grammar, agreement, tense slips, mangled parallel lists, broken markdown, dead or wrong links, code fences whose language tag does not match their contents. Three errors are already published and recur, so check them by name every time:
    - **`it's own` for `its own`.** Five occurrences across three posts, his most repeated mistake by a wide margin.
    - **`you're` for `your`.** Shipped in the dark-mode post's frontmatter description.
    - **Doubled words**, "the the" and "we we". Ignore matches inside code fences, where `flex flex` and `btn btn` are Tailwind, not typos.
5. **Pass three, the piece itself.** This is where the value is, so spend the most effort here. See [Sharpening](#sharpening).
6. **Report** in the format under [Note format](#note-format). Then stop. Do not apply the notes.

Done when every section of the draft has been accounted for, and every note quotes a location and gives a reason. A pass that produces no notes for a section says so rather than staying silent.

</what-to-do>

<supporting-info>

## Voice

Grounded in all 33 published posts, 2019-2026. Counts are files containing the pattern, out of 33. Full evidence and quotations: [references/voice-evidence.md](references/voice-evidence.md).

**Hard rules.** These are near-absolutes in the corpus, so a violation is always a note:

- **No em dashes.** 1 file of 33 contains one, almost certainly a slip. He restructures with commas, parentheses, colons, or a full stop. An em dash in a draft is the single strongest tell that a passage was not written by him.
- **Sign off with "Until next time, friends!"** 25 of 33. Variants exist ("amigos", "friend") but the default is that exact line. A draft ending without it needs a note.
- **Every `description` in frontmatter is a joke.** A meme, a pop-culture quote, a groaner pun. Never a summary of the post. "We have Herd at home." / "Neovim (btw)" / "Identity theft is not a joke, Jim!" A descriptive description is a note.

**Signatures to protect.** Present enough to be his, not so mandatory that their absence is a defect. Flag only when a draft reads flat and one of these would fix it:

- **Italic stress on single words.** 469 instances: `_not_`, `_really_`, `_could_`, `_how_`. This is his main emphasis tool.
- **Parenthetical asides** for jokes and hedges: "(obviously)", "(and probably not long enough)", "(poor man's)".
- **Deferral**: "I'll save that for a rainy day" (11 files), "I'll leave that as an exercise for the reader" (9), "I'll let someone smarter than me" (6).
- **Register**: `heck` (120 uses), `ole` (60), `gonna` (10), `imo` (8), `btw` (5). Profanity is rare and self-censored: `f#@k`, `s@$t`, `shit` in 6 files.
- **Openings put the human first.** Paternity leave, a quarter-life crisis, boredom with .NET, writer's block, "So I've been working on a lot of weird, fun, and random side projects lately". Never "In this article, we will explore." A draft that opens on the technology is a note.
- **"we" while walking through code, "I" while holding an opinion.**
- **Headings are short, sentence case, and often a joke**: "Rusti-fying our .NET code", "Refactoring on easy mode", "Something something profit", "Backlogging the backlog".

**Words that are his, not tells.** Do not flag these as generated prose. They are corpus-verified: `utilize` (18 files), `in essence` (10), `essentially` (9), `more or less` (6), `leverage` (6), `basically` (4), `robust` (4), `simply put` (3), `that said` (3).

**Words that never appear.** Zero hits across all 33. Any of these in a draft is drift: "it's worth noting", "in this article", "moreover", "in conclusion", "crucial", "unlock", "elevate", "game-changer", "in today's landscape".

## Sharpening

The notes Joey cannot get from a linter. Look for:

- **A section that explains what a tool is when a link would do.** He links generously and trusts the reader to click. Recurring failure mode: three paragraphs of "what is X" before the actual content.
- **The setup that never pays off.** He opens on a personal hook. Check it gets a callback, the way "boom, callback" does in the Hetzner post.
- **The buried lede.** His best posts front-load the surprising bit. The Postgres `PGGSSENCMODE` TL;DR in the nix post is the whole reason someone finds that article, and it sits two-thirds down.
- **Code blocks with nothing said about them.** Every fence should have a line before it saying what to look at, or a line after saying what happened.
- **Unearned length.** He knows this about himself ("this giant wall of text", "I've rambled on long enough"). If a section could go and the post would not miss it, say so and name the section.
- **A missing wrap-up.** Longer posts close with a `## Wrapping up` that lists takeaways before the sign-off.
- **Honest hedges are a feature, not a weakness.** "I'm still a nix noob myself", "I have no idea what I'm doing with Zig". Never note these as lacking authority.

## Note format

Group by pass. Lead each note with the location, quote the text, then the reason. No severity scores, no rubric, no praise section.

```
## Drift
- **Opening, ¶2** — "In this article we'll explore the tradeoffs of..."
  Nothing in 33 posts opens on the technology. Compare the Zig post: the
  linked list shows up only after parental leave and tech-bro Twitter.

## Mechanics
- **§ Setting up hooks** — "your worktrees become a reversible environments"
  Article/plural disagreement.

## Sharpening
- **§ The tools** — Six tools listed, four explained. Deptrac and Infection
  get sections; Rector and Backlog get a sentence. Either cut them from the
  list or give them the same treatment.
```

Close with one line naming the single change that would most improve the piece.

## Keeping this current

When Joey rejects a note as wrong about his voice, that is new evidence. Append it to `references/voice-evidence.md` under "Corrections" with the date and what he said, and adjust the rule above if it was stated too strongly. Do not delete the corpus counts; they are the baseline.

Running under the `blog-editor` agent, this step is not available: it is read-only and it exits before Joey can reject anything. It returns a `## Proposed corrections` section instead, and the corrections are applied here, in a session where he can push back.

</supporting-info>
