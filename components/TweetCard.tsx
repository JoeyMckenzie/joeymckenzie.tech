import { ProfileMeta, TweetMeta } from '@/lib/types/twitter.types';
import { VFC } from 'react';
import TweetMetrics from './TweetMetrics';

const TweetCard: VFC<{
  tweet: TweetMeta;
  profileMeta: ProfileMeta;
}> = ({ tweet, profileMeta }) => {
  const { image, name, username } = profileMeta;

  const createdDate = new Date(tweet.createdAt).toDateString();

  return (
    <div className="flex max-w-md items-center justify-center px-5 py-5">
      <div className="mx-auto w-full rounded-lg bg-gray-50 p-5 text-gray-800 shadow-lg dark:bg-gray-800 dark:text-gray-300">
        <div className="mb-4 flex w-full">
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img src={image} alt="Joey McKenzie Twitter profile picture" />
          </div>
          <div className="flex-grow pl-3">
            <h6 className="text-md font-bold">{name}</h6>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              @{username}
            </p>
          </div>
          <div className="w-12 text-right">
            <i className="mdi mdi-twitter text-3xl text-blue-400"></i>
          </div>
        </div>
        <div className="mb-4 w-full">
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: tweet.text }}
          ></p>
        </div>
        <div className="w-full">
          <div className="flex flex-col">
            <p className="text-right text-xs text-gray-500 dark:text-gray-400">
              <time dateTime={createdDate}>{createdDate}</time>
            </p>
            {tweet.metrics && (
              <div className="ml-auto">
                <TweetMetrics metrics={tweet.metrics} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
