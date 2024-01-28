import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import * as React from "react";

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
                            A few things I&apos;m working on{" "}
                            <a href="https://nownownow.com/about">now</a>:
                        </p>
                        <ul className="px-8">
                            <li>
                                I&apos;m part of team modernizing fintech
                                systems from legacy .NET to modern .NET running
                                on{" "}
                                <a href="https://docs.aws.amazon.com/">AWS</a>.
                                I spend most of time architecting serverless
                                workloads with the likes of things like{" "}
                                <a href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-rust.html">
                                    Lambda
                                </a>
                                , <a href="https://www.docker.com/">Docker</a>,{" "}
                                <a href="https://aws.amazon.com/sqs/">SQS</a>,{" "}
                                <a href="https://aws.amazon.com/sns/">SNS</a>,
                                and the whole lot.
                            </li>
                            <li>
                                I&apos;m learning PHP and{" "}
                                <a href="https://laravel.com">Laravel</a> and
                                very unexpectedly having an absolute blast doing
                                so. The website you&apos;re currently reading is
                                written with Laravel and React with the help of{" "}
                                <a href="https://inertiajs.com/">Inertia</a>{" "}
                                served from a droplet on{" "}
                                <a href="https://digitalocean.com/">
                                    DigitalOcean
                                </a>{" "}
                                - I even{" "}
                                <Link
                                    href={route("post", {
                                        slug: "content-driven-websites-with-php-and-laravel",
                                    })}
                                >
                                    wrote about it
                                </Link>{" "}
                                on my blog!
                            </li>
                            <li>
                                In the name of learning of PHP, I&apos;m also
                                working on a{" "}
                                <a href="https://packagist.org/packages/bubblehearth/bubblehearth">
                                    Composer package
                                </a>{" "}
                                that wraps the{" "}
                                <a href="https://develop.battle.net/">
                                    Blizzard Game Data APIs
                                </a>{" "}
                                with an easy-to-use and (hopefully) elegant PHP
                                library.
                            </li>
                            <li>
                                I like beer - and as such, I wrote a{" "}
                                <a href="https://github.com/JoeyMckenzie/openbrewerydb-php-api">
                                    PHP library
                                </a>{" "}
                                that wraps the{" "}
                                <a href="https://openbrewerydb.org/">
                                    Open Brewery DB
                                </a>{" "}
                                API providing brewery data from pubs across the
                                world.
                            </li>
                            <li>
                                I write a lot of{" "}
                                <a href="https://www.rust-lang.org/">Rust</a> in
                                my spare time and have contributed some small
                                libraries and crates{" "}
                                <a href="https://crates.io/crates/newswrap">
                                    here
                                </a>{" "}
                                and{" "}
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
