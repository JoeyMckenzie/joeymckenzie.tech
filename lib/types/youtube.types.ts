export interface YouTubeViedoMeta {
  title: string;
  src: string;
  videoId: string;
}

export interface LatestVideosResponse {
  videos: YouTubeViedoMeta[];
}
