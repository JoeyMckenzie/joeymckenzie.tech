import { FC } from 'react';

const TweetMetric: FC<{ metric?: number }> = ({ children, metric }) =>
  metric ? (
    <>
      {metric > 0 && (
        <span className="flex flex-row gap-x-0.5 align-middle text-xs">
          {children} {metric}
        </span>
      )}
    </>
  ) : null;

export default TweetMetric;
