export interface TweetResponseMeta {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {};
}

export interface TimelineResponseMeta {
  next_token: string;
  result_count: number;
  newest_id: string;
  oldest_id: string;
}

export interface TwitterTimelineResponse {
  data: TweetResponseMeta[];
  meta: TimelineResponseMeta;
}

export interface TwitterTokenResponse {
  token_type: string;
  access_token: string;
}

interface TweetEntity {
  id: string;
  start: number;
  end: number;
  username: string;
}

export interface TweetMetricsMeta {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
}

export interface TweetMeta {
  id: string;
  text: string;
  createdAt: string;
  metrics: TweetMetricsMeta;
  entities: {
    mentions: TweetEntity[];
  };
}

export interface ProfileMeta {
  image: string;
  username: string;
  name: string;
}

export interface TwitterTimelineMeta {
  tweets: TweetMeta[];
  profileMeta: ProfileMeta;
}
