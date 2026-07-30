import { Head, Link } from '@inertiajs/react';
import { home } from '@/routes';
import { index as blogIndex } from '@/routes/blog';

const messages: Record<number, string> = {
    404: 'This buffer does not exist.',
    500: 'The server hit an unexpected branch.',
    503: 'The site is briefly off the air.',
};

export default function ErrorPage({ status }: { status: number }) {
    const message = messages[status] ?? 'Something went sideways.';

    return (
        <>
            <Head title={`${status} · Error`} />

            <div className="mx-auto flex min-h-[70svh] max-w-3xl items-center px-6 py-16">
                <div className="w-full">
                    <p className="font-mono text-xs tracking-widest text-subtle uppercase">
                        app/error.tsx
                    </p>
                    <p className="mt-6 font-display text-[clamp(6rem,25vw,12rem)] leading-none font-medium tracking-[-0.07em] text-prose">
                        {status}
                    </p>
                    <div className="nocturne-sweep mt-5 w-40 rounded-full" />
                    <h1 className="mt-7 font-display text-3xl font-medium text-prose sm:text-4xl">
                        {message}
                    </h1>
                    <p className="mt-3 max-w-xl text-subtle">
                        The route may have moved, or the server needs a minute.
                        Either way, there are safer buffers to visit.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
                        <Link
                            href={home.url()}
                            className="rounded-lg border border-iris bg-iris/10 px-4 py-2 text-iris transition-colors hover:bg-iris/20"
                        >
                            ~/home
                        </Link>
                        <Link
                            href={blogIndex.url()}
                            className="rounded-lg border border-hairline px-4 py-2 text-subtle transition-colors hover:border-iris/50 hover:text-prose"
                        >
                            ~/blog
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
