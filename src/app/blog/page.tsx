import InlineBold from '@/components/InlineBold';
import Header from '@/components/Header';

export default function Blog(): JSX.Element {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="prose mx-auto max-w-2xl lg:mx-0">
          <Header title="Blog" />
          <p className="mt-6 text-sm leading-6 text-gray-300">
            Hi, I&apos;m Joey. I&apos;m a{' '}
            <InlineBold>Senior Software Engineer</InlineBold> based in Northern
            California working in FinTech. I enjoy writing about software,
            design, dad jokes, and cheap beer among a few other things.
          </p>
          <p className="mt-6 text-sm leading-6 text-gray-300">
            I like building fast and efficient web services, learning new
            things, and writing code in the open source ecosystem. If you&apos;d
            like to get in touch, feel free to reach on on any of my socials.
          </p>
        </div>
      </div>
    </div>
  );
}
