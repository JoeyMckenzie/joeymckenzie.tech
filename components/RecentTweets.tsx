import { getTimeline } from '@/lib/services/twitter.service';
import { useEffect, VFC } from 'react';
import useSWR from 'swr';
import TweetCard from './TweetCard';

const RecentTweets: VFC = () => {
  const { data } = useSWR('/api/twitter/timeline', getTimeline, {
    revalidateIfStale: false,
  });

  return data ? (
    <div className="flex flex-col space-y-2 pb-8">
      <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200 sm:text-4xl">
        Recent tweets
      </h2>
      <div className="space-2 mx-auto flex flex-col md:flex-row">
        {data.tweets.map((tweet) => (
          <a
            key={tweet.id}
            target="_blank"
            rel="noreferrer"
            href={`https://twitter.com/${data.profileMeta.username}/status/${tweet.id}`}
          >
            <TweetCard tweet={tweet} profileMeta={data.profileMeta} />
          </a>
        ))}
      </div>
    </div>
  ) : null;
};

export default RecentTweets;
