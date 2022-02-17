import { VFC } from 'react';
import Image from 'next/image';

interface BlogImageProps {
  height: string;
  width: string;
  src: string | StaticImageData;
  alt: string;
}

const BlogImage: VFC<BlogImageProps> = ({ height, width, src, alt }) => (
  <div className="mx-auto w-1/2">
    <Image height={height} width={width} src={src} alt={alt} />
  </div>
);

export default BlogImage;
