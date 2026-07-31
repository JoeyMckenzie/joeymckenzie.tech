# React Rules

## Exports

- **ALWAYS** use `export default` **only** for Inertia page components — the files under `resources/js/pages/` that `resolvePageComponent` loads in `app.tsx` and `ssr.tsx`. Inertia resolves those by path, so the default export is a framework requirement.
- **ALWAYS** use named exports for everything else: shared components, layouts, hooks, and utilities. They are imported explicitly by name, so the export should be named too.
- **NEVER** default-export a layout. Layouts live in `resources/js/layouts/` and are imported by pages, so they are ordinary modules, not pages.

❌ BAD - default export on a shared component

```tsx
// resources/js/components/social-links.tsx
export default function SocialLinks({ className }: { className?: string }) {
    // ...
}
```

✅ GOOD - named export on a shared component

```tsx
// resources/js/components/social-links.tsx
export function SocialLinks({ className }: { className?: string }) {
    // ...
}
```

✅ GOOD - default export on an Inertia page, because Inertia requires it

```tsx
// resources/js/pages/home.tsx
export default function Home({ posts }: { posts: BlogPost[] }) {
    // ...
}
```

Importers follow from this. Alias with `as` when a local name has to differ:

```tsx
import { SocialLinks } from '@/components/social-links';
import { AppSidebarLayout as AppLayoutTemplate } from '@/layouts/app/app-sidebar-layout';
```

## Data fetching

- **NEVER** fetch data inline in a component body or in an ad-hoc `useEffect` inside a UI component. Components render; they don't own transport, polling, or retry logic.
- **ALWAYS** extract fetching, polling, and the state it syncs into a hook in `resources/js/hooks/`, named `use-<thing>.ts`.
- **ALWAYS** have the hook absorb its own failures and return a single settled value the component can render directly, so the UI has no error branches to forget.
- **PREFER** Inertia's own primitives — page props, deferred props, `useHttp`, `useForm` — over hand-rolled `fetch`. Reach for `fetch` only for endpoints outside the Inertia request lifecycle, such as a polled JSON widget.

❌ BAD - transport and state syncing inside the component

```tsx
export function SpotifyNowPlaying() {
    const [playing, setPlaying] = useState<NowPlaying | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const poll = () =>
            fetch(nowPlaying.url(), { signal: controller.signal })
                .then((response) => response.json())
                .then((data) => setPlaying(data.nowPlaying))
                .catch(() => {});

        poll();
        const interval = setInterval(poll, 30_000);

        return () => {
            controller.abort();
            clearInterval(interval);
        };
    }, []);

    // ...
}
```

✅ GOOD - the hook owns polling and failure handling; the component only renders

```tsx
// resources/js/hooks/use-now-playing.ts
export const useNowPlaying = (): NowPlaying | null => {
    // Polls, aborts on unmount, and resolves every failure to null.
};

// resources/js/components/spotify-now-playing.tsx
export function SpotifyNowPlaying() {
    const playing = useNowPlaying();

    if (playing === null) {
        return <span>not listening</span>;
    }

    // ...
}
```

## Code Quality

- **ALWAYS** typecheck with `pnpm run types:check`
- **ALWAYS** lint with `pnpm run lint:check`
- **ALWAYS** format with `pnpm run fmt` or `pnpm run fmt:check`
