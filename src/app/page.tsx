import Hero from './+Hero';
import SocialButtons from './+SocialButtons';

export default async function Home(): Promise<JSX.Element> {
  return (
    <>
      <Hero />
      <SocialButtons />
    </>
  );
}
