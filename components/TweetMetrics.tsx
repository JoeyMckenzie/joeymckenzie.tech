import { TweetMetricsMeta } from '@/lib/types/twitter.types';
import { VFC } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaRetweet } from 'react-icons/fa';

const TweetMetrics: VFC<{ metrics: TweetMetricsMeta }> = ({ metrics }) => {
  const metricMarkup = (icon: JSX.Element, metric?: number) =>
    metric ? (
      <>
        {metric > 0 && (
          <span className="flex flex-row gap-x-0.5 align-middle text-xs">
            {icon} {metric}
          </span>
        )}
      </>
    ) : null;

  return (
    <div className="flex flex-row gap-x-2 pt-2 align-middle">
      {metricMarkup(<AiFillHeart className="h-4 w-4" />, metrics.like_count)}
      {metricMarkup(<FaRetweet className="h-4 w-4" />, metrics.retweet_count)}
    </div>
  );
};

export default TweetMetrics;
