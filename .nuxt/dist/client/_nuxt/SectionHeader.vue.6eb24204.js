import {
  u as l,
  n as r,
  g as i,
  o as m,
  c as _,
  b as p,
  w as f,
  a as u,
  t as d,
} from './entry.f0151a78.js';
import { _ as x } from './HtmlTag.vue.10b495f0.js';
function b(s, t) {
  const { title: n, titleTemplate: e, ...o } = s;
  return l(
    { title: n, titleTemplate: e, _flatMeta: o },
    {
      ...t,
      transform(a) {
        const c = r({ ...a._flatMeta });
        return delete a._flatMeta, { ...a, meta: c };
      },
    },
  );
}
const g = {
    class:
      'flex flex-row items-center space-x-0 text-neutral-400 sm:justify-center sm:space-x-2',
  },
  h = {
    class:
      'font-mono text-2xl font-semibold tracking-tight text-neutral-400 sm:text-3xl',
  },
  w = i({
    __name: 'SectionHeader',
    props: { title: {} },
    setup(s) {
      return (t, n) => {
        const e = x;
        return (
          m(),
          _('span', g, [
            p(
              e,
              {
                'additional-classes': 'hidden sm:block text-xl',
                'tag-name': 'page',
              },
              { default: f(() => [u('h2', h, d(t.title), 1)]), _: 1 },
            ),
          ])
        );
      };
    },
  });
export { w as _, b as u };
