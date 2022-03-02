import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { catchError, firstValueFrom, from, map, of } from 'rxjs';

export default function post(
  request: NextApiRequest,
  response: NextApiResponse,
  slug: string
) {
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
