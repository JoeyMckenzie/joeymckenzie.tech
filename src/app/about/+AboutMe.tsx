import Header from '@/components/Header';
import InlineBold from '@/components/InlineBold';
import Paragraph from '@/components/Paragraph';
import SimpleLink from '@/components/SimpleLink';
import Link from 'next/link';

export default function AboutMe(): JSX.Element {
  return (
    <div className="prose mx-auto max-w-lg lg:mx-0">
      <Header title="About" />
      <Paragraph>
        I&apos;m Joey. I&apos;ve got a passion for the web and developing
        services and applications with performance in mind. I&apos;ve spent
        nearly a decade working on technologies across the stack, from Java,
        IBM, .NET, and most of the major web frontend frameworks you&apos;ll see
        folks arguing about over on{' '}
        <SimpleLink href="https://reddit.com/r/webdev">r/webdev</SimpleLink>.
      </Paragraph>
      <Paragraph>
        By day, I&apos;m a <InlineBold>Senior Software Engineer</InlineBold>{' '}
        working on mostly .NET technologies. In my spare time, I work primarily
        within the TypeScript and Rust ecosystems (I&apos;m even writing a{' '}
        <SimpleLink href="https://fullstackrust.netlify.app/">
          Rust web series!
        </SimpleLink>
        ), contributing to projects I find interesting and exploring new
        technologies. I like to write about things I come across in the wild (of
        software), design, frameworks, and language features among other things.
        If I find the time, you can catch any of my content on{' '}
        <SimpleLink href="https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#">
          YouTube
        </SimpleLink>{' '}
        or streaming live on{' '}
        <SimpleLink href="https://twitch.tv/JoeTheDevMan">Twitch</SimpleLink>.
        Checkout my{' '}
        <Link href="/blog" className="text-indigo-400 hover:text-indigo-500">
          blog
        </Link>{' '}
        for things I publish that mostly deal with my questionable takes on
        development.
      </Paragraph>
      <Paragraph>
        Outside of refactoring legacy code and convincing managers that
        estimates are not deadlines, I enjoy spending time with family and
        friends, walking our dog Moose, and sampling the latest installment of
        adult beverages at my local breweries.
      </Paragraph>
    </div>
  );
}
