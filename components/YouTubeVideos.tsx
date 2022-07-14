import { fetchPlaylist } from '@/lib/services/youtube.service';
import { VFC } from 'react';
import useSWR from 'swr';
import { YouTubeViedoMeta } from '../lib/types/youtube.types';

const YouTubeVideos: VFC = () => {
  const { data } = useSWR<YouTubeViedoMeta[]>('playlist', fetchPlaylist);

  return data ? (
    <div className="mx-auto flex justify-center pt-12 align-middle">
      {data.map((meta, index) => (
        <iframe
          className="inline-flex justify-center"
          key={index}
          width="600"
          height="400"
          src={meta.src}
          title={meta.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ))}
    </div>
  ) : null;
};

export default YouTubeVideos;
