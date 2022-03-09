import type { NextApiRequest, NextApiResponse } from 'next';
import { methodNotAllowed } from '@/lib/utilities';
import { catchError, firstValueFrom, from, map, of } from 'rxjs';
import prisma from '@/lib/prisma';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return methodNotAllowed(response);
  }

  if (process.env.PLANETSCALE_ENABLED === 'true') {
    const slug = request.query.slug.toString();

    return firstValueFrom(
      from(
        prisma.views.upsert({
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
        })
      ).pipe(
        map((newOrUpdatedViews) =>
          response.status(200).json({
            total: newOrUpdatedViews.count.toString(),
          })
        ),
        catchError((error) => {
          console.error(error);
          return of(
            response.status(500).json({
              message: error.toString(),
            })
          );
        })
      )
    );
  }

  return response.status(200).json({ message: 'success' });
}
