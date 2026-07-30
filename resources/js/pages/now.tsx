import { Head } from '@inertiajs/react';
import ScrollFade from '@/components/scroll-fade';

const linkClass =
    'text-iris underline decoration-iris/35 underline-offset-4 transition-colors hover:decoration-iris';

export default function Now() {
    return (
        <>
            <Head title="Now">
                <meta
                    name="description"
                    content="A living changelog of what I'm learning, tinkering with, and thinking about outside of client work."
                />
            </Head>

            <div className="mx-auto max-w-2xl px-6 py-16">
                <header>
                    <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs tracking-wide text-subtle">
                        <span>~/now</span>
                        <time dateTime="2026-07">updated jul 2026</time>
                    </div>
                    <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-prose">
                        Now
                    </h1>
                    <div className="nocturne-sweep mt-4 w-40 rounded-full" />
                    <p className="mt-5 max-w-xl text-lg leading-8 text-subtle">
                        A living changelog of what I&apos;m learning, tinkering
                        with, and thinking about outside of client work.
                    </p>
                </header>

                <div className="mt-14 divide-y divide-hairline">
                    <ScrollFade className="pb-10">
                        <h2 className="font-display text-2xl font-medium text-prose">
                            Work
                        </h2>
                        <div className="mt-4 space-y-4 leading-7 text-subtle">
                            <p>
                                I&apos;m currently a Senior Developer at{' '}
                                <a
                                    href="https://www.givebutter.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className={linkClass}
                                >
                                    Givebutter
                                </a>{' '}
                                building things with PHP, Laravel, TypeScript,
                                and React. Our goal is to make the world a
                                better place and empower the changemaker in all
                                of us.
                            </p>
                            <p>
                                I work on a lot of things, mainly Laravel and
                                React. I love my job and the people I get to
                                work with. I love working with PHP and
                                TypeScript, and do a lot to build our community
                                and empower our developers to be the best they
                                can be.
                            </p>
                        </div>
                    </ScrollFade>

                    <ScrollFade className="py-10">
                        <h2 className="font-display text-2xl font-medium text-prose">
                            Online
                        </h2>
                        <p className="mt-4 leading-7 text-subtle">
                            In my spare time, I write a lot of PHP and enjoy
                            tinkering on ideas with Laravel. I&apos;ve got quite
                            a few fun projects I&apos;ve worked on that usually
                            make their way over to the blog. Find me on{' '}
                            <a
                                href="https://github.com/joeymckenzie"
                                target="_blank"
                                rel="noreferrer"
                                className={linkClass}
                            >
                                GitHub
                            </a>
                            .
                        </p>
                    </ScrollFade>

                    <ScrollFade className="pt-10">
                        <h2 className="font-display text-2xl font-medium text-prose">
                            Offline
                        </h2>
                        <p className="mt-4 leading-7 text-subtle">
                            If I&apos;m not sitting in front of a terminal,
                            I&apos;m chasing around my kid and spending time
                            with my family. I enjoy fishing, grabbing a drink at
                            my local watering hole with friends, and posting mid
                            takes about software on{' '}
                            <a
                                href="https://x.com/_joeyMcKenzie"
                                target="_blank"
                                rel="noreferrer"
                                className={linkClass}
                            >
                                X
                            </a>
                            .
                        </p>
                    </ScrollFade>
                </div>
            </div>
        </>
    );
}
