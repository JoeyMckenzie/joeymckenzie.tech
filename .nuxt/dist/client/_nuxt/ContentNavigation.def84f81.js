import {
  v,
  A as f,
  B as m,
  C as c,
  D as g,
  E as d,
  _ as l,
  G as h,
  H as _,
  g as C,
  I as y,
  J as w,
  K as P,
  L as $,
  x as N,
  z as r,
} from './entry.f0151a78.js';
import { u as D } from './state.704f78e9.js';
import { _ as E } from './nuxt-link.48ad20a1.js';
const T = async (e) => {
    const { content: t } = v().public;
    typeof (e == null ? void 0 : e.params) != 'function' && (e = f(e));
    const a = e.params(),
      s = t.experimental.stripQueryParameters
        ? m(`/navigation/${`${c(a)}.${t.integrity}`}/${g(a)}.json`)
        : m(`/navigation/${c(a)}.${t.integrity}.json`);
    if (d())
      return (
        await l(
          () => import('./client-db.72b164c8.js'),
          [
            './client-db.72b164c8.js',
            './entry.f0151a78.js',
            './entry.4c6d4e04.css',
            './index.288f722b.js',
          ],
          import.meta.url,
        ).then((o) => o.generateNavigation)
      )(a);
    const n = await $fetch(s, {
      method: 'GET',
      responseType: 'json',
      params: t.experimental.stripQueryParameters
        ? void 0
        : { _params: h(a), previewToken: _().getPreviewToken() },
    });
    if (typeof n == 'string' && n.startsWith('<!DOCTYPE html>'))
      throw new Error('Not found');
    return n;
  },
  j = C({
    name: 'ContentNavigation',
    props: { query: { type: Object, required: !1, default: void 0 } },
    async setup(e) {
      const { query: t } = y(e),
        a = w(() => {
          var n;
          return typeof ((n = t.value) == null ? void 0 : n.params) ==
            'function'
            ? t.value.params()
            : t.value;
        });
      if (!a.value && D('dd-navigation').value) {
        const { navigation: n } = P();
        return { navigation: n };
      }
      const { data: s } = await $(`content-navigation-${c(a.value)}`, () =>
        T(a.value),
      );
      return { navigation: s };
    },
    render(e) {
      const t = N(),
        { navigation: a } = e,
        s = (o) => r(E, { to: o._path }, () => o.title),
        n = (o, u) =>
          r(
            'ul',
            u ? { 'data-level': u } : null,
            o.map((i) =>
              i.children
                ? r('li', null, [s(i), n(i.children, u + 1)])
                : r('li', null, s(i)),
            ),
          ),
        p = (o) => n(o, 0);
      return t != null && t.default
        ? t.default({ navigation: a, ...this.$attrs })
        : p(a);
    },
  }),
  A = j;
export { A as default };
