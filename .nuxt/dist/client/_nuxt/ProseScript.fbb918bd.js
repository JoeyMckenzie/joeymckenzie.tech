import {
  g as s,
  J as n,
  o as r,
  c as a,
  d as e,
  ae as c,
  a as t,
} from './entry.f0151a78.js';
const d = { key: 0 },
  i = t('code', null, 'script', -1),
  l = t('code', null, 'ProseScript', -1),
  f = s({
    __name: 'ProseScript',
    props: { src: { type: String, default: '' } },
    setup(p) {
      const o = n(() => !1);
      return (_, m) =>
        o.value
          ? (r(),
            a('div', d, [
              e(' Rendering the '),
              i,
              e(
                ' element is dangerous and is disabled by default. Consider implementing your own ',
              ),
              l,
              e(' element to have control over script rendering. '),
            ]))
          : c('', !0);
    },
  });
export { f as default };
