import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { allBlogs } from 'contentlayer/generated';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return allBlogs.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = allBlogs.find((b) => b.slug === params.slug);

  if (!post) {
    return;
  }

  const { title } = post;

  //   const ogImage = image
  //     ? `https://leerob.io${image}`
  //     : `https://leerob.io/api/og?title=${title}`;

  return {
    title,
    // description,
    openGraph: {
      title,
      //   description,
      type: 'article',
      //   publishedTime,
      url: `https://joeymckenzie.tech/blog/${params.slug}`,
      images: [
        {
          //   url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      //   description,
      //   images: [ogImage],
    },
  };
}

// @ts-expect-error
export default function PostLayout({ params }): JSX.Element {
  const blog = allBlogs.find((b) => b.slug === params.slug);

  if (!blog) {
    return notFound();
  }

  return (
    <>
      <article className="mx-auto max-w-2xl py-16">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="text-center text-sm font-bold uppercase text-blue-700"
          >
            Home
          </Link>
        </div>
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-3xl font-bold">{blog.title}</h1>
          <time dateTime={blog.date} className="text-sm text-slate-600">
            {format(parseISO(blog.date), 'LLLL d, yyyy')}
          </time>
        </div>
        <div
          className="cl-post-body"
          dangerouslySetInnerHTML={{ __html: blog.body.html }}
        />
      </article>
    </>
  );
}
