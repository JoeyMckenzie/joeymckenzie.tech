import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { catchError, from, map, of } from 'rxjs';

export default function get(
  request: NextApiRequest,
  response: NextApiResponse,
  slug: string
) {
  return from(
    prisma.views.findUnique({
      where: {
        slug,
      },
    })
  ).pipe(
    map((views) => {
      const viewsOrDefault = views?.count.toString() ?? '0';
      const coercedViews = isNaN(+viewsOrDefault) ? 0 : +viewsOrDefault;
      return response.status(200).json({ total: coercedViews });
    }),
    catchError((error) => {
      console.error(error);
      return of(
        response.status(500).json({
          message: error.toString(),
        })
      );
    })
  );
}
