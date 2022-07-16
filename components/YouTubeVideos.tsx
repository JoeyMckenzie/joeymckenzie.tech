import { fetchPlaylist } from '@/lib/services/youtube.service';
import { useEffect, VFC } from 'react';
import useSWR from 'swr';
import YouTube, { YouTubeProps } from 'react-youtube';

const YouTubeVideos: VFC = () => {
  const { data } = useSWR('/api/youtube/latest', fetchPlaylist, {
    revalidateIfStale: false,
  });

  const onReady: YouTubeProps['onReady'] = (event) => event.target.pauseVideo();

  let videoOptions: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return data ? (
    <div className="relative mx-auto max-w-lg pb-16 lg:max-w-7xl">
      <h2 className="pb-8 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
        Fresh off the small screen
      </h2>
      <YouTube
        className="mx-auto flex justify-center align-middle"
        videoId={data[0].videoId}
        title={data[0].title}
        opts={videoOptions}
        onReady={onReady}
      />
    </div>
  ) : null;
};

export default YouTubeVideos;
