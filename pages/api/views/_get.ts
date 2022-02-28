import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function get(
  request: NextApiRequest,
  response: NextApiResponse,
  slug: string
) {
  const views = await prisma.views.findUnique({
    where: {
      slug,
    },
  });

  return response.status(200).json({ total: views?.count.toString() ?? '0' });
}
