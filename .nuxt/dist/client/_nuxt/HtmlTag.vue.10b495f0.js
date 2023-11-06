import {
  g as c,
  J as p,
  o as d,
  c as i,
  a as t,
  t as n,
  Q as o,
  m as l,
  r as u,
  F as f,
} from './entry.f0151a78.js';
const r = 'text-neutral-400 font-mono',
  N = c({
    __name: 'HtmlTag',
    props: { tagName: {}, additionalClasses: {} },
    setup(m) {
      const s = m,
        e = p(() => (s.additionalClasses ? `${r} ${s.additionalClasses}` : r));
      return (a, g) => (
        d(),
        i(
          f,
          null,
          [
            t('span', { class: o(l(e)) }, '<' + n(a.tagName) + '>', 3),
            u(a.$slots, 'default'),
            t('span', { class: o(l(e)) }, '</' + n(a.tagName) + '>', 3),
          ],
          64,
        )
      );
    },
  });
export { N as _ };
