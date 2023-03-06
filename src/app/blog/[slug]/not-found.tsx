import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <main className="grid min-h-full place-items-center py-24 px-6 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-200 sm:text-5xl">
          Looks like you're lost...
        </h1>
        <p className="mt-6 text-base leading-7 text-neutral-400">
          I can assure you won't find any honey pots here.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-neutral-800 px-3.5 py-2.5 text-sm font-semibold text-neutral-200 shadow-sm hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="rounded-md bg-neutral-800 px-3.5 py-2.5 text-sm font-semibold text-neutral-200 shadow-sm hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700"
          >
            Blogs
          </Link>
        </div>
      </div>
    </main>
  );
}
