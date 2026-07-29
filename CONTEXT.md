# Website

Joey McKenzie's personal site: a blog plus static pages (now, uses, cv). This glossary covers the blog domain, where posts, their views, and reactions are persisted in MySQL.

## Language

**Post**:
A single blog article. Its body is authored in markdown and rendered to HTML for display. Blog-only — talks, "now", and "uses" pages are not Posts.
_Avoid_: Article, Entry, Content

**Tag**:
A single topic label classifying a Post. Exactly one Tag per Post.
_Avoid_: Category, Topic

**Draft**:
A Post with no `published_at`. Visible only to the authenticated author (previewable on the live site), hidden from guests.
_Avoid_: Unpublished, Private

**Published**:
A Post whose `published_at` is set and not in the future. A future `published_at` schedules the go-live and stays a Draft to guests until then.
_Avoid_: Live, Public

**View**:
A single read event of a Post by a visitor, recorded for analytics.
_Avoid_: Hit, Impression, Read

**Reaction**:
An emoji response (fire, thumbs up, mind blown, heart) a visitor leaves on a Post.
_Avoid_: Like, Vote
