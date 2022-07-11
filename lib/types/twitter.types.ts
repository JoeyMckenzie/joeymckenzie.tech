export interface TweetMeta {
  id: string;
  text: string;
}

export interface TimelineMeta {
  next_token: string;
  result_count: number;
  newest_id: string;
  oldest_id: string;
}

export interface TwitterTimelineResponse {
  data: TweetMeta[];
  meta: TimelineMeta;
}

export interface TwitterTokenResponse {
  token_type: string;
  access_token: string;
}

export interface TwitterTimelineMetaResponse {
  tweets: {
    text: string;
    createdAt: string;
  }[];
  profileMeta: {
    image: string;
    username: string;
    name: string;
  };
}
