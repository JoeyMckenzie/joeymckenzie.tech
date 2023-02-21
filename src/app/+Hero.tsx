import Header from '@/components/Header';
import InlineBold from '@/components/InlineBold';
import Paragraph from '@/components/Paragraph';

export default function Hero(): JSX.Element {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="prose mx-auto max-w-2xl lg:mx-0">
          <Header title="Joey McKenzie" />
          <Paragraph>
            Hi, I&apos;m Joey. I&apos;m a{' '}
            <InlineBold>Senior Software Engineer</InlineBold> based in Northern
            California working in FinTech. I enjoy writing about software,
            design, dad jokes, and cheap beer among a few other things.
          </Paragraph>
          <Paragraph>
            I like building fast and efficient web services, learning new
            things, and writing code in the open source ecosystem. If you&apos;d
            like to get in touch, feel free to reach on on any of my socials.
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
