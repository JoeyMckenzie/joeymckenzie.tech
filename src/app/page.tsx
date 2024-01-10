import { BlogPreviews } from "@/components/blog-previews";
import { SocialButtons } from "@/components/social-buttons";

export default function Home() {
  return (
    <>
      <h2 className="text-4xl font-semibold tracking-tight sm:text-center">
        Hi, I&apos;m Joey.
      </h2>
      <p className="prose mx-auto mt-6 text-justify leading-6 dark:prose-invert">
        I&apos;m a{" "}
        <span className="font-semibold">Senior Software Engineer</span> based in
        Northern California working in fintech. I enjoy writing about software,
        design, dad jokes, and cheap beer among a few other things. I like
        building fast, efficient web services, learning new things, and writing
        code in the open source ecosystem.
      </p>
      <SocialButtons />
      <h2 className="pb-4 pt-8 text-right text-4xl font-semibold tracking-tight sm:text-center">
        Latest thoughts.
      </h2>
      <BlogPreviews includeLatest={true} />
      {/* <NotesToSelf notes={notes} /> */}
    </>
  );
}
