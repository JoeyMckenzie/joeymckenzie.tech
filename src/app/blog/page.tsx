import { meta } from './first-blog-post/page.mdx';

export default function Blog() {
  return <h1>{meta.title}</h1>;
}
