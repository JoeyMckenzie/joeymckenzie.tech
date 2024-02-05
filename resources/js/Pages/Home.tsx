import BlogPreviews from "@/Components/BlogPreviews";
import NotesToSelf from "@/Components/NotesToSelf";
import SocialButtons from "@/Components/SocialButtons";
import MainLayout from "@/Layouts/MainLayout";
import { type FrontMatter } from "@/models";
import { type Note } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import * as React from "react";

export default function Home({
    frontMatters,
}: {
    frontMatters: FrontMatter[];
}): React.JSX.Element {
    const page = usePage();
    const notes = (page.props.notes as Note[]) ?? ([] as Note[]);

    return (
        <>
            <Head>
                <title>
                    Bears. Beets. Battlestar Galactiga. | joeymckenzie.tech
                </title>
                <meta
                    content="A blog about software, technology, and sometimes beer. Mostly beer."
                    name="description"
                />
                <meta
                    content="software, programming, technology"
                    name="keywords"
                />
            </Head>

            <MainLayout>
                <>
                    <h2 className="text-4xl font-bold tracking-tight sm:text-center">
                        Hi, I&apos;m Joey.
                    </h2>
                    <p className="prose mx-auto mt-6 text-justify leading-6 dark:prose-invert">
                        I&apos;m a{" "}
                        <span className="font-semibold">
                            Senior Software Engineer
                        </span>{" "}
                        based in Northern California working in fintech. I enjoy
                        writing about software, design, dad jokes, and cheap
                        beer among a few other things. I like building fast,
                        efficient web services, learning new things, and writing
                        code in the open source ecosystem.
                    </p>
                    <SocialButtons />
                    <h2 className="pb-4 pt-8 text-right text-4xl font-bold tracking-tight sm:text-center">
                        Latest thoughts.
                    </h2>
                    <BlogPreviews frontMatters={frontMatters} />
                    <NotesToSelf notes={notes} />
                </>
            </MainLayout>
        </>
    );
}