import { g as e, o as a, c as o, t as n } from './entry.f0151a78.js';
const r = ['datetime'],
  c = e({
    __name: 'FormattedDate',
    props: { date: {} },
    setup(s) {
      return (t, i) => (
        a(),
        o(
          'time',
          { datetime: t.date.toISOString(), class: 'text-neutral-400' },
          n(
            t.date.toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
          ),
          9,
          r,
        )
      );
    },
  });
export { c as _ };
