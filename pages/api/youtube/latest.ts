import { LatestVideosResponse } from '@/lib/types/youtube.types';
import { NextApiRequest, NextApiResponse } from 'next';
import playlist from './playlist.json';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return response.status(405);
  }

  return response.status(200).json({
    videos: playlist.videos,
  } as LatestVideosResponse);
}
