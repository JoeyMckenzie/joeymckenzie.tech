import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function post(
  request: NextApiRequest,
  response: NextApiResponse,
  slug: string
) {
  const newOrUpdatedViews = await prisma.views.upsert({
    where: { slug },
    create: {
      slug,
      pageType: 'BLOG',
    },
    update: {
      count: {
        increment: 1,
      },
    },
  });

  return response.status(200).json({
    total: newOrUpdatedViews.count.toString(),
  });
}
