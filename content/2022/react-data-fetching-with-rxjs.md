---
title: 'React data fetching with RxJS'
description: 'Use RxJS to implement simple data fetching, making ALL THE THINGS reactive!'
pubDate: 'Mar 03 2022'
heroImage: '/images/react-data-fetching/react-data-fetching-meme.jpg'
category: 'react'
keywords:
    - react
    - nextjs
    - rxjs
---

Data fetching with React offers a wide selection of tools to do the job, from simple promises, to more sophisticated
caching libraries like [react-query](https://react-query.tanstack.com/) and [swr](https://swr.vercel.app/). With a
plethora of options, developers have their choice of favorite fetching tools to get the job done and make our
applications performant on all fronts. As an Angular developer, I make heavy usage of [RxJS](https://rxjs.dev/)
where I can, and luckily Angular treats the library as a first class citizen with many Angular internals (router
events, the `HttpClient`, etc.), making use of `Observables` to stream data in a reactive way.

Lately, however, I've taken the React-fork-in-the-road and have been experimenting with data fetching tools and
hooks for the React/next.js applications I've been working on. While, again, there are many tools that solve the
problem of data fetching and mutation made by people much, _much_ smarter than myself, I was looking to integrate
RxJS into the tools I use for such a task. What I found, coincidentally, was the perfect marriage between my data
fetching library of choice, Vercel's [swr](https://swr.vercel.app/) (a gift from the folks behind next.js), and
`fetch`-based `Observables`.

While [we can likely expect subscriptions to data sources from swr](https://github.com/vercel/swr/pull/1263)
sometime soon, I've found the utility offered by RxJS allows for incredible control over emissions of stream data to
subscribers that I would prefer _not_ to give up, if given the chance. While I'll definitely experiment with
subscriptions coming to swr, I decided to sandbox around with RxJS, next.js, and swr to see what was currently
possible with data fetching using `Observables` - what I found was _quite_ interesting.

## Starting with tradition

To keep things simple, I'll run through four scenarios using a sample next.js application:

1. SSR with traditional promises
2. SSR with `async`/`await`
3. SSR with RxJS
4. CSR with RxJS

Okay, timeout. SSR? CSR?

-   SSR - **S**erver-**s**ide **r**ending (or prerendering), the act of rendering the template data into said
    template _on_ the server before handing it back to the client. In essence, retrieving all the necessary data for an
    HTML page then rendering said data in the markup and handing it back to the browser.
-   CSR - **C**lient-**s**ide **r**endering, the act of rending template data _after_ the route has been served
    to/rendered by the client, or simply making our calls to fetch data after the markup is rendered, which we'll update
    once the data has been fetched.

Within the context of next.js, what this means is that we'll have three separate page routes that will invoke
`getServerSideProps` to fetch data for our page before serving it up to the client. This content is rendered on the
server, meaning the client receives a ready-to-go HTML document with all the appropriate data already in markup.

In our CSR scenario, we'll utilize `swr` as a data fetching hook to retrieve data for us once the page has been served,
where our fetching will happen once the page loads, meaning there will be two renders: one on page load, and again
once the data is available and the render hook forces a re-render of the page.

There's one glaring question we should probably take a crack at answering before going further: **why use RxJS in the
first place?**

## RxJS in a nutshell

Coming from the Angular world, devs have more than likely been heavily exposed to RxJS due to the
framework's tight integration with the library. RxJS implements, more or less, the publisher/subscriber pattern (or
pub/sub for short) to allow _subscribers_ of _publishers_ to tune into essential streams of data they may be
interested in. In plain english, instead of asking for some work to be done with the `Promise` of it completing sometime
in the near future and `await`ing the data's arrival, we listen in on select streams of data that emit things we're
interested in as
they happen -
we're simply _reacting_ to data as it's published through the stream. In code:

```js
import { interval, take } from 'rxjs'
import { finalize } from 'rxjs/operators'

const dataSource$ = interval(1000)

dataSource$
    .pipe(
        take(5),
        finalize(() => console.log('data captured!'))
    )
    .subscribe(console.log)

/**
 * Output:
 *
 * 0
 * 1
 * 2
 * 3
 * 4
 * data captured!
 */
```

Without going too deep into RxJS operators (the official documentation does a better job than I could ever do at
explaining operator functions), we have a source of data, `dataSource$`, that emits numbers every frame for 1000
frame, with a frame in this context being one second. We're `.subscribe`ing to those emissions, `take`ing only the
first five, then closing our stream to listen as
we're only interested in the five emissions. Our `dataSource$` in this case is an `Observerable`, a foundational
construct in pub/sub that is the publishing source for subscribers. With RxJS, `Observable`s are just streams, and
won't begin _emitting_ data until a subscriber, well, `.subscribe()`s to the stream.

Within the scope of this article, we're _barely_ scraping the surface of what RxJS is capable of and what benefits
it may offer over more traditional data flow models in our code. I'll leave it to the RxJS experts to speak on the
intricacies of the library as we'll mainly be focusing on fetching data within the context of RxJS.

## Getting started

Okay, enough talk. Let's code! For our demo, we'll tap into the amazing [GitHub API](https://docs.github.com/en/rest)
to explore repositories. I've spun up a simple next.js app:

```shell
npx create-next-app@latest --ts react-rxjs-data-fetching-demo
```

I'm using next.js in this case as we want to showcase data fetching in both the CSR and SSR contexts. Everything
we'll do within the scope of this blog post is similarly applicable to your average react project. With our project
scaffolded, let's add a few dependencies:

```shell
npm install swr rxjs
```

I'm partial to swr for data fetching, and you're more than welcome to use your own hook fetching library. I've also
added [Tailwind](https://tailwindcss.com/) out of habit in order to make things not look like a webpage from 1995.
With our dependencies installed, let's add a page for our first scenario: SSR with the tried-and-true
`Promise`-based data fetching:

#### pages/with-promises.tsx

```tsx
import { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import { githubBaseUrl } from '../lib/constants'
import { GitHubRepoMeta, WithFetcherProps } from '../lib/types'
import { mapRepos } from '../lib/utilities'

export const getServerSideProps: GetServerSideProps = async () => {
    const mappedGitHubRepos = await fetch(githubBaseUrl, {
        headers: {
            Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
    })
        .then((response) => response.json())
        .then(mapRepos)
        .catch((error) => {
            console.error(error)
            return [] as GitHubRepoMeta[]
        })

    return {
        props: {
            mappedGitHubRepos,
        },
    }
}

const WithPromises: NextPage<WithFetcherProps> = ({ mappedGitHubRepos }) => {
    useEffect(() => console.log(mappedGitHubRepos), [mappedGitHubRepos])

    return (
        <h2 className="text-2xl">
            Number of repos: {mappedGitHubRepos.length}
        </h2>
    )
}

export default WithPromises
```

I've added a few things to help us along the way underneath the `lib` directory:

#### lib/constants.ts

```ts
export const githubBaseUrl =
    'https://api.github.com/users/{{yourUsername}}/repos'
```

#### lib/utilities.ts

```ts
import { GitHubReposApiResponse } from './types'

export function mapRepos(repos: GitHubReposApiResponse[]) {
    return repos.map((repo) => ({
        name: repo.name,
        forks: repo.forks_count,
        stars: repo.stargazers_count,
    }))
}
```

#### lib/types.ts

```ts
interface Owner {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
}

interface Permissions {
    admin: boolean
    maintain: boolean
    push: boolean
    triage: boolean
    pull: boolean
}

export interface GitHubReposApiResponse {
    id: number
    node_id: string
    name: string
    full_name: string
    private: boolean
    owner: Owner
    html_url: string
    description: string
    fork: boolean
    url: string
    forks_url: string
    keys_url: string
    collaborators_url: string
    teams_url: string
    hooks_url: string
    issue_events_url: string
    events_url: string
    assignees_url: string
    branches_url: string
    tags_url: string
    blobs_url: string
    git_tags_url: string
    git_refs_url: string
    trees_url: string
    statuses_url: string
    languages_url: string
    stargazers_url: string
    contributors_url: string
    subscribers_url: string
    subscription_url: string
    commits_url: string
    git_commits_url: string
    comments_url: string
    issue_comment_url: string
    contents_url: string
    compare_url: string
    merges_url: string
    archive_url: string
    downloads_url: string
    issues_url: string
    pulls_url: string
    milestones_url: string
    notifications_url: string
    labels_url: string
    releases_url: string
    deployments_url: string
    created_at: Date
    updated_at: Date
    pushed_at: Date
    git_url: string
    ssh_url: string
    clone_url: string
    svn_url: string
    homepage: string
    size: number
    stargazers_count: number
    watchers_count: number
    language: string
    has_issues: boolean
    has_projects: boolean
    has_downloads: boolean
    has_wiki: boolean
    has_pages: boolean
    forks_count: number
    mirror_url?: any
    archived: boolean
    disabled: boolean
    open_issues_count: number
    license?: any
    allow_forking: boolean
    is_template: boolean
    topics: string[]
    visibility: string
    forks: number
    open_issues: number
    watchers: number
    default_branch: string
    permissions: Permissions
    temp_clone_token: string
    allow_squash_merge: boolean
    allow_merge_commit: boolean
    allow_rebase_merge: boolean
    allow_auto_merge: boolean
    delete_branch_on_merge: boolean
    allow_update_branch: boolean
    network_count: number
    subscribers_count: number
}

export interface GitHubRepoMeta {
    name: string
    stars: number
    forks: number
}

export interface WithFetcherProps {
    mappedGitHubRepos: GitHubRepoMeta[]
}
```

Breaking it down:

-   `constants.ts` is just a constant string, update it with your GitHub username
-   `utilties.ts` will house some common mapping/retrieving functions to be reused amongst components and pages
-   `types.ts` houses all the type information we expect back from the API and the prop shapes our pages will expect

Before you ask, no, I didn't manually write out the interface for the GitHub API response, I
used [json2ts](http://www.json2ts.com/) to quickly model out the response object to TypeScript based on the JSON data
returned
from calling my username repo endpoint. We also explicitly type our page props using `WithFetchProps` for sanity.
You can use `InferGetServerSidePropsType` from next.js, but I find intellisense from VS Code lacking so I swapped
out my own type.

Jumping back to `with-promises.tsx`, let's take a look at our fetcher function responsible for getting the data our
template will rely on:

#### with-promises.tsx

```ts
export const getServerSideProps: GetServerSideProps = async () => {
    const mappedGitHubRepos = await fetch(githubBaseUrl, {
        headers: {
            Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
    })
        .then((response) => response.json())
        .then(mapRepos)
        .catch((error) => {
            console.error(error)
            return [] as GitHubRepoMeta[]
        })

    return {
        props: {
            mappedGitHubRepos,
        },
    }
}
```

We're utilizing next.js's mechanism
for [server-side data fetching](https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props)
with `getServerSideProps`, simply calling out to the GH
API endpoint for our repositories, streaming the JSON response, and mapping the response to a simple object for our
page to display while appropriately handling any errors that may occur. While this suffices for our need to retrieve
data, we're using promise resolution in its most primitive form. I'm still `await` the promise to resolve itself
before returning the props data back to the page, as promises are asynchronous and will jump to the next resolution
scope whenever they can, so we need to block the next lines of code execution until our promise has fully been
resolved.

I'm sure we've all
seen a `Promise`
handled the
traditional way before, and after having used RxJS for a number of years now, I'm going to say something rather
controversial: I prefer `.then()/.catch()` over `try`/`catch` \*_pauses for gasps_\*.

Okay, this is fine, but what about using `try`/`catch` with a few more `async`/`await`s sprinkled in?

#### pages/with-try-catch.tsx

```tsx
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useEffect } from 'react'
import { githubBaseUrl } from '../lib/constants'
import {
    GitHubRepoMeta,
    GitHubReposApiResponse,
    WithFetcherProps,
} from '../lib/types'
import { mapRepos } from '../lib/utilities'

export const getServerSideProps: GetServerSideProps = async () => {
    let mappedGitHubRepos: GitHubRepoMeta[] = []

    try {
        const response = await fetch(githubBaseUrl, {
            headers: {
                Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
            },
        })

        const githubRepos: GitHubReposApiResponse[] = await response.json()

        mappedGitHubRepos = mapRepos(githubRepos)
    } catch (error: any) {
        console.error(error)
    }

    return {
        props: {
            mappedGitHubRepos,
        },
    }
}

const WithTryCatch: NextPage<WithFetcherProps> = ({ mappedGitHubRepos }) => {
    useEffect(() => console.log(mappedGitHubRepos), [mappedGitHubRepos])

    return (
        <h2 className="text-2xl">
            Number of repos: {mappedGitHubRepos.length}
        </h2>
    )
}

export default WithTryCatch
```

Again, not much change from using promises, as all we've done is throw in a `try`/`catch` block and an extra `await`
to read the JSON stream from the API response before mapping to the expected type our page expects. Nothing out of
the ordinary, and in fact, we _may_ be able to argue this is the most common convention amongst data fetching
functions in react projects, though I'll leave that for a debate topic on a rainy day.

Okay, great... we're not breaking new ground here, just fetching data for a page to render like we've been doing for
years. Let's finally break the mold.

## Reactive react

Alright, let's finally integrate a little RxJS into one of our pages. Let's add a new page and render, again, the
same data from the same GH API endpoint:

#### pages/with-rxjs.tsx

```tsx
import { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import { githubBaseUrl } from '../lib/constants'
import { WithFetcherProps } from '../lib/types'
import { fetchFirstReposValue } from '../lib/utilities'

export const getServerSideProps: GetServerSideProps = async () => ({
    props: {
        mappedGitHubRepos: await fetchFirstReposValue(githubBaseUrl),
    } as WithFetcherProps,
})

const WithRxJS: NextPage<WithFetcherProps> = ({ mappedGitHubRepos }) => {
    useEffect(() => console.log(mappedGitHubRepos), [mappedGitHubRepos])

    return (
        <h2 className="text-2xl">
            Number of repos: {mappedGitHubRepos.length}
        </h2>
    )
}

export default WithRxJS
```

With `fetchFirstReposValue` coming from our `utilities`:

#### lib/utilities.ts

```ts
// ...other stuff

export function fetchRepos(key: string): Observable<GitHubRepoMeta[]> {
    return fromFetch<GitHubReposApiResponse[]>(key, {
        headers: {
            Authorization: `token ${
                process.env.GITHUB_ACCESS_TOKEN ??
                process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN
            }`,
        },
        selector: (response) => response.json(),
    }).pipe(
        map(mapRepos),
        catchError((error) => {
            console.error(error)
            return EMPTY
        })
    )
}

export function fetchFirstReposValue(key: string) {
    return firstValueFrom(fetchRepos(key))
}
```

Okay, hold on - why are we still `await`ing something after we just went through a primer about how awesome RxJS is?
Well, we're still _technically_ utilizing RxJS, however, our purpose is one time data fetching: we need data for the
page to be rendered, that's it. No subscribers, open observable streams, or anything else reactive about
_reactive_ JS (hence the _Rx_ in _RxJS_). So why the heck don't we just stick to our good ole fashioned `Promises`?

## fromFetch&lt;T&gt; to the rescue

The beauty of RxJS data fetching comes from the relatively new API `fromFetch<T>`, which in facts takes the
`Promise` returned `from` the native `fetch` API, and turns it into an `Observable` for us to use all of the awesome
stuff RxJS offers up for us.

Back in our SSR fetcher `getServerSideProps` in `with-rxjs.tsx`, we utilize our wrapper function
`fetchFirstReposValue`, passing in the base URL for the endpoint we need repo data from. This wrapper is itself a
wrapper around `firstValueFrom`, which comes from the RxJS library turning an `Observable` back into a `Promise` by
internally `subscribe()`ing to the stream and emitting the first captured value back to the `await`ing caller.

Okay... so let's get this straight - we're wrapping an `Observable` into a `Promise` so we can return data to a
function that expects a `Promise` in the first place, so why the heck are we even using `Observable`s in the first
place? _My_ answer to this question would be "because I like RxJS," but a much smarter person than myself well versed in
RxJS may retort with something along the lines of being able to tap into the incredible power of RxJS operator
functions, in flight HTTP request cancellation, and response manipulation to our heart's desire that plain old
`Promise`s simply cannot do as tersely as RxJS.

Because `getServerSideProps` expects data as props either in its raw form as a `Promise`, we need to use
`firstValueFrom` to extract the HTTP response value that `fromFetch` streams to its subscribers. Recall that with
`Observable`s, values do not technically _exist_ in place - values are _emitted_ as they become available by the
`Observable` with `.subscribe()`ers listening for said values. Simply put, `Observable`s do not _store_ data, they
pass data onto listeners. Luckily for us, `firstValueFrom` allows us to treat our `Observable`s as _if_ were storing
data, allowing us to extract it and do with it what we please.

While there is another class of special observables,
referred to as [subjects](https://rxjs.dev/guide/subject) in RxJS that allow us to retrieve current stream values, data
fetching in react couples pretty tightly to the `await`ing of promises to resolve, so to make our lives easy, we can use
our friendly RxJS utilities to convert
between promises and observables, with `firstValueFrom`/`lastValueFrom` converting observables to promises, and
`from`/`delay` converting promises to observables. We get to have our observable cake, with the promise of eating it
too!

Let's dig into our functions utilizing `fromFetch`:

```ts
export function fetchRepos(key: string): Observable<GitHubRepoMeta[]> {
    return fromFetch<GitHubReposApiResponse[]>(key, {
        headers: {
            Authorization: `token ${
                process.env.GITHUB_ACCESS_TOKEN ??
                process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN
            }`,
        },
        selector: (response) => response.json(),
    }).pipe(
        map(mapRepos),
        catchError((error) => {
            console.error(error)
            return EMPTY
        })
    )
}
```

Breaking this function down, we utilize the generic type version of `fromFetch` so we can benefit from typing our
HTTP responses _explicitly_ without having to manually type cast after a `response.json()` call. `fromFetch` does
exactly what you think it does - wraps `fetch` (a promise) in the promise converting RxJS operator `from` so we can
treat `fetch` as if it were an `Observable`. `fromFetch` expects the same optional configuration object as `fetch`
does, meaning we can attach headers, specify HTTP methods, etc. while _additionally_ allowing us to project the
response into anything available from the `Response` object `fetch` returns.

In our case, we project `response.json()`,
which internally is more or less the same as calling a `switchMap()/exhaustMap()` after `fromFetch` emits a value,
saving us a line of inner observable mapping operator functions so that we can jump right into `map()`ing the
deserialized response into the prop types our pages expect. If any error occurs, we log out to console and do
nothing (probably want to perform _some_ sort of recovery in a real world scenario).

This gives us a few benefits over using just a normal old `fetch`:

1. We can _explicitly_ statically type the HTTP response
2. We can project response data in an efficient manner, blocking further inner mappings from happening until the
   body response stream has been read entirely
3. We can easily cancel long running requests with a `timeout()` operator function, if we wanted to

Among with a few others, we quickly see how data fetching with `fromFetch` provides a powerful reactive wrapper
around the native `fetch`, boosting its ability to be efficiently used for simple data retrieval.

But about within the context of CSR? Let's build out one more page to explore integrating RxJS with swr as a fetcher
function:

#### pages/with-csr.tsx

```tsx
import { NextPage } from 'next'
import useSWR from 'swr'
import { githubBaseUrl } from '../lib/constants'
import { fetchFirstReposValue } from '../lib/utilities'

const WithCSR: NextPage = () => {
    const { data: mappedGitHubRepos } = useSWR(
        githubBaseUrl,
        fetchFirstReposValue
    )

    return mappedGitHubRepos ? (
        <h2 className="text-2xl">
            Number of repos: {mappedGitHubRepos.length}
        </h2>
    ) : (
        <h2 className="text-2xl">Loading...</h2>
    )
}

export default WithCSR
```

We tap into the `useSWR` hook, supplying the base URL for the endpoint as the key, and reuse our `fromFetch` as the
fetcher function `useSWR` expects. `swr` caches the returned data using the `stale-while-revalidating` HTTP strategy,
but instead, we tap into RxJS to fetch the data for us for all the aforementioned reasons and benefits in the SSR
context, but this time on the client.

## Wrapping up

I like RxJS, and love more so RxJS-ifying anything and everything I can. While there are existing RxJS/react
integration libraries, I prefer simply using RxJS in its natural form, allowing me to fully customize how I `.pipe()`
streams of data however I like. RxJS, again, is a _huge_ library of utilities for pub/sub and reactive programming
with JS, and is not meant to _replace_ promises, but rather offer an alternative, or in our case, complimentary
functionality that promises provide in the first place. I love RxJS, and will definitely be using it wherever I can
in my
react projects.

Until next time, friends!
