import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { methodNotAllowed } from '@/lib/utilities';
import { catchError, firstValueFrom, from, map, of } from 'rxjs';
import prisma from '@/lib/prisma';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'GET') {
    return methodNotAllowed(response);
  }

  if (process.env.PLANETSCALE_ENABLED === 'true') {
    const slug = request.query.slug.toString();
    return firstValueFrom(
      from(
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
      )
    );
  }

  return response.status(200).json({ message: 'success' });
}
