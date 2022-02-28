import type { NextApiRequest, NextApiResponse } from 'next';
import get from '@/pages/api/views/_get';
import post from '@/pages/api/views/_post';
import { methodNotAllowed, WHITELIST_DOMAINS } from '@/lib/utilities';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const slug = request.query.slug.toString();

    // if (!WHITELIST_DOMAINS.find((d) => d === request.headers.referer ?? '')) {
    //   return response.status(401).json({
    //     message: 'Origin is not allowed.',
    //   });
    // }

    switch (request.method) {
      case 'POST':
        return await post(request, response, slug);
      case 'GET':
        return await get(request, response, slug);
      default:
        return methodNotAllowed(response);
    }
  } catch (e: any) {
    return response.status(500).json({ message: e.message });
  }
}
