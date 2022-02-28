import type { NextApiRequest, NextApiResponse } from 'next';
import { methodNotAllowed, WHITELIST_DOMAINS } from '@/lib/utilities';
import prisma from '@/lib/prisma';

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    // if (!WHITELIST_DOMAINS.find((d) => d === request.headers.referer ?? '')) {
    //   return response.status(401).json({
    //     message: 'Origin not allowed.',
    //   });
    // }

    if (request.method !== 'GET') {
      return methodNotAllowed(response);
    }

    const views = await prisma.views.findMany({
      select: {
        slug: true,
        count: true,
      },
    });

    return response.status(200).json({ views });
  } catch (error: any) {
    return response.status(500).json({ message: error.message });
  }
}
