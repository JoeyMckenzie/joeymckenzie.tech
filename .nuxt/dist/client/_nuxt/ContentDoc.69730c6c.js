import {
  m as d,
  q as _,
  h as y,
  s as w,
  u as D,
  v as g,
  g as x,
  x as H,
  y as q,
  z as u,
} from './entry.f0151a78.js';
import S from './ContentRenderer.623c2a20.js';
import b from './ContentQuery.e15ff7c8.js';
import './ContentRendererMarkdown.vue.32cff1fc.js';
import './index.288f722b.js';
const a = (s, p = y()) => {
    const e = d(s),
      f = g();
    _(
      () => d(s),
      (n = e) => {
        if (!p.path || !n) return;
        const t = Object.assign({}, (n == null ? void 0 : n.head) || {});
        (t.meta = [...(t.meta || [])]), (t.link = [...(t.link || [])]);
        const r = t.title || (n == null ? void 0 : n.title);
        r && (t.title = r), f.public.content.host;
        const c =
          (t == null ? void 0 : t.description) ||
          (n == null ? void 0 : n.description);
        c &&
          t.meta.filter((l) => l.name === 'description').length === 0 &&
          t.meta.push({ name: 'description', content: c }),
          (t != null && t.image) || n == null || n.image,
          w(() => D(t));
      },
      { immediate: !0 },
    );
  },
  $ = x({
    name: 'ContentDoc',
    props: {
      tag: { type: String, required: !1, default: 'div' },
      excerpt: { type: Boolean, default: !1 },
      path: { type: String, required: !1, default: void 0 },
      query: { type: Object, required: !1, default: void 0 },
      head: { type: Boolean, required: !1, default: void 0 },
    },
    render(s) {
      const { contentHead: p } = g().public.content,
        e = H(),
        { tag: f, excerpt: m, path: n, query: t, head: r } = s,
        c = r === void 0 ? p : r,
        l = {
          ...(t || {}),
          path: n || (t == null ? void 0 : t.path) || q(y().path),
          find: 'one',
        },
        v = (o, i) =>
          u(
            'pre',
            null,
            JSON.stringify(
              {
                message: 'You should use slots with <ContentDoc>',
                slot: o,
                data: i,
              },
              null,
              2,
            ),
          );
      return u(b, l, {
        default:
          e != null && e.default
            ? ({ data: o, refresh: i, isPartial: C }) => {
                var h;
                return (
                  c && a(o),
                  (h = e.default) == null
                    ? void 0
                    : h.call(e, {
                        doc: o,
                        refresh: i,
                        isPartial: C,
                        excerpt: m,
                        ...this.$attrs,
                      })
                );
              }
            : ({ data: o }) => (
                c && a(o),
                u(
                  S,
                  { value: o, excerpt: m, tag: f, ...this.$attrs },
                  {
                    empty: (i) =>
                      e != null && e.empty ? e.empty(i) : v('default', o),
                  },
                )
              ),
        empty: (o) => {
          var i;
          return (
            ((i = e == null ? void 0 : e.empty) == null
              ? void 0
              : i.call(e, o)) ||
            u(
              'p',
              null,
              'Document is empty, overwrite this content with #empty slot in <ContentDoc>.',
            )
          );
        },
        'not-found': (o) => {
          var i;
          return (
            ((i = e == null ? void 0 : e['not-found']) == null
              ? void 0
              : i.call(e, o)) ||
            u(
              'p',
              null,
              'Document not found, overwrite this content with #not-found slot in <ContentDoc>.',
            )
          );
        },
      });
    },
  }),
  j = $,
  T = j;
export { T as default };
