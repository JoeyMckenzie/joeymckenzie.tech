import { Socials } from '@/components/socials';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hi, I'm Joe. | joeymckenzie.tech",
  description: 'A blog about software, technology, and sometimes beer.',
};

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-4xl font-bold tracking-tight">Hi, I&apos;m Joe.</h2>
      <p className="mt-6 text-sm leading-8">
        Hi, I&apos;m Joey. I&apos;m a{' '}
        <span className="font-semibold">Senior Software Engineer</span> based in
        Northern California working in fintech. I enjoy writing about software,
        design, dad jokes, and cheap beer among a few other things. I like
        building fast and efficient web services, learning new things, and
        writing code in the open source ecosystem. If you&apos;d like to get in
        touch, feel free to reach on on any of my socials.
      </p>
      <Socials />
    </div>
  );
}
