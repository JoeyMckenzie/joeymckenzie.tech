import { allBlogs, Blog } from 'contentlayer/generated';
import { compareDesc, format, parseISO } from 'date-fns';
import Link from 'next/link';
import BlogPreview from './+BlogPreview';
import Hero from './+Hero';
import JobTimeline from './+JobTimeline';
import NotificationSignUp from './+NotificationSignUp';
import Panel from './+Panel';

function BlogCard({ blog }: { blog: Blog }): JSX.Element {
  const route = `/blog/${blog.slug}`;

  return (
    <div className="mb-6">
      <time dateTime={blog.date} className="block text-sm text-slate-600">
        {format(parseISO(blog.date), 'LLLL d, yyyy')}
      </time>
      <h2 className="text-lg">
        <Link href={route} className="text-blue-700 hover:text-blue-900">
          {blog.title}
        </Link>
      </h2>
    </div>
  );
}

export default function Home(): JSX.Element {
  const blogs = allBlogs.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <>
      <Hero />
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <BlogPreview />
        <div className="flex flex-col">
          <Panel>
            <JobTimeline />
          </Panel>
          <NotificationSignUp />
        </div>
      </div>
      {/* <div className="mx-auto max-w-2xl py-16 text-center">
        <h1 className="mb-8 text-3xl font-bold">Contentlayer Blog Example</h1>
        {blogs.map((blog, index) => (
          <BlogCard key={index} blog={blog} />
        ))}
      </div> */}
    </>
  );
}
