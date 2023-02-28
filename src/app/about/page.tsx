import Image from 'next/image';
import AboutMe from './+AboutMe';
import atWinery from './winery_me.jpg';

export default function About(): JSX.Element {
  return (
    <div className="py-12">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center px-6 sm:flex-row lg:px-8">
        <AboutMe />
        <div className="ml-0 sm:ml-6">
          <figure className="mt-16">
            <Image
              className="rounded-lg object-cover shadow-md"
              src={atWinery}
              width="300"
              height="300"
              alt=""
            />
            <figcaption className="mt-2 flex gap-x-2 text-center text-xs leading-6 text-neutral-500">
              &quot;Wine improves with age. The older I get, the better I like
              it.&quot;
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
