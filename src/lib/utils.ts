import { format, parseISO } from 'date-fns';

export function getFormattedDate(date: string) {
  return format(parseISO(date), 'LLLL d, yyyy');
}
