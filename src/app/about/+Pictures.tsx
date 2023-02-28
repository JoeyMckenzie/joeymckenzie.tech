import Image from 'next/image';
import withEinstein from './me.jpg';
import atWinery from './winery_me.jpg';

const imageSources = [withEinstein, atWinery];

export default function Pictures(): JSX.Element {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <ul
        role="list"
        className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        {imageSources.map((src, index) => (
          <li key={`about-image-${index}`}>
            <Image
              className="w-full rounded-lg object-cover shadow-md"
              src={src}
              width="200"
              height="200"
              alt=""
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
