import { VFC } from 'react';

const YouTubeVideo: VFC<{ src: string; title: string }> = ({ src, title }) => (
  <iframe
    width="600"
    height="400"
    src={src}
    title={title}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
);

export default YouTubeVideo;
