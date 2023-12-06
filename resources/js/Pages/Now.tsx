import * as React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function About(): React.JSX.Element {
    return (
        <>
            <Head title="Now | joeymckenzie.tech" />

            <MainLayout>
                <div>
                    <h2 className="text-4xl font-bold tracking-tight sm:text-center">
                        Now.
                    </h2>
                    <div className="prose mx-auto flex max-w-2xl flex-col leading-6 dark:prose-invert">
                        <p className="mt-6">
                            A few things I&apos;m working on{' '}
                            <a href="https://nownownow.com/about">now</a>:
                        </p>
                        <ul role="list" className="px-8">
                            <li>
                                I&apos;m part of team modernizing fintech
                                systems from legacy .NET applications to modern
                                .NET microservices running on AWS. I spend most
                                of time architecting serveless workloads with
                                the likes of things like Lambda, Docker, SQS,
                                SNS, and the whole lot.
                            </li>
                            <li>
                                I&apos;m learning PHP and{' '}
                                <a href="https://laravel.com">Laravel</a> and
                                very unexpectedly having an absolute blast doing
                                so. The website you&apos;re currently reading is
                                written with Laravel and React with the help of{' '}
                                <a href="https://inertiajs.com/">Inertia</a>{' '}
                                served from an image on{' '}
                                <a href="hhtps://fly.io/">Fly.io</a> and backed
                                by a MySQL database hosted on{' '}
                                <a href="https://planetscale.com/">
                                    PlanetScale
                                </a>
                                . I&apos;ll get around to writing about it
                                eventually...
                            </li>
                            <li>
                                I&apos;m doing{' '}
                                <a href="https://adventofcode.com/">
                                    Advent of Code
                                </a>{' '}
                                this year in{' '}
                                <a href="https://github.com/JoeyMckenzie/advent-of-code-2023">
                                    PHP
                                </a>
                                . Another year, another round of string split
                                mania...
                            </li>
                            <li>
                                I write a lot of{' '}
                                <a href="https://www.rust-lang.org/">Rust</a> in
                                my spare time and have contributed some small
                                libraries and crates{' '}
                                <a href="https://crates.io/crates/newswrap">
                                    here
                                </a>{' '}
                                and{' '}
                                <a href="https://github.com/JoeyMckenzie/bubblehearth">
                                    there
                                </a>
                                .
                            </li>
                        </ul>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}
