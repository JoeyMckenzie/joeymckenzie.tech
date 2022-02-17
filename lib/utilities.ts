import { FrontMatter } from '@/lib/types';

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
