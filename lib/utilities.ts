import { FrontMatter } from '@/lib/types';
import { NextApiRequest, NextApiResponse } from 'next';
import MiddlewarePlugin from 'next/dist/build/webpack/plugins/middleware-plugin';
import { NextMiddlewareResult } from 'next/dist/server/web/types';

export const WHITELIST_DOMAINS = [
  'https://www.joeymckenzie.tech/',
  'https://joeymckenzie.tech/',
  'https://www.joeymckenzie.io/',
  'https://joeymckenzie.io/',
  'localhost:3000',
  'http://localhost:3000/',
];

export function sortFrontMatters(previous: FrontMatter, current: FrontMatter) {
  const previousDate = new Date(previous.datetime);
  const currentDate = new Date(current.datetime);

  if (currentDate > previousDate) {
    return 1;
  } else if (currentDate < previousDate) {
    return -1;
  }

  return 0;
}

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

export function upsertViewCount(slug: string) {
  if (process.env.NODE_ENV === 'production') {
    fetch(`/api/views/${slug}`, {
      method: 'POST',
    })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }
}

export function methodNotAllowed(response: NextApiResponse) {
  return response.status(405).json({
    message: 'HTTP Method is not allowed.',
  });
}
