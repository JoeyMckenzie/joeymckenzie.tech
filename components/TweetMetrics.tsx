import { TweetMetricsMeta } from '@/lib/types/twitter.types';
import { VFC } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaRetweet } from 'react-icons/fa';
import TweetMetric from './TweetMetric';

const TweetMetrics: VFC<{ metrics: TweetMetricsMeta }> = ({ metrics }) => (
  <div className="flex flex-row gap-x-2 pt-2 align-middle">
    <TweetMetric metric={metrics.like_count}>
      <AiFillHeart className="h-4 w-4" />
    </TweetMetric>
    <TweetMetric metric={metrics.retweet_count}>
      <FaRetweet className="h-4 w-4" />
    </TweetMetric>
  </div>
);

export default TweetMetrics;
