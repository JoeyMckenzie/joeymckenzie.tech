import InlineBold from '@/components/InlineBold';
import Header from '@/components/Header';
import { allBlogs } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';
import BlogPreview from './+BlogPreviews';

export default function BlogHeader(): JSX.Element {
  const blogs = allBlogs.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="py-12 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <Header title="Blog" />
          <p className="mt-6 text-sm leading-6 text-neutral-300">
            Thoughts about things, stuff, nicknacks, and other.
          </p>
          <p className="mt-6 text-sm leading-6 text-neutral-300">
            I like building fast and efficient web services, learning new
            things, and writing code in the open source ecosystem. If you&apos;d
            like to get in touch, feel free to reach on on any of my socials.
          </p>
        </div>
        <BlogPreview blogs={blogs} />
      </div>
    </div>
  );
}
