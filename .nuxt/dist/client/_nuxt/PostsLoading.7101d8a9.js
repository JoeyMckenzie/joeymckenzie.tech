import { _ as m } from './FormattedDate.vue.d09cde38.js';
import {
  g as _,
  o,
  c as n,
  t as r,
  a as e,
  b as u,
  w as g,
  d as f,
  l as v,
  F as C,
  k as x,
  j as h,
  m as w,
} from './entry.f0151a78.js';
import { _ as y } from './nuxt-link.48ad20a1.js';
import { _ as b } from './_plugin-vue_export-helper.c27b6911.js';
const P = ['v-if'],
  $ = _({
    __name: 'PostViewCount',
    props: { viewCount: {} },
    setup(a) {
      return (t, i) => (
        o(),
        n(
          'div',
          { 'v-if': t.viewCount > 0, class: 'font-medium text-neutral-400' },
          r(t.viewCount) + ' views ',
          9,
          P,
        )
      );
    },
  }),
  k = {
    class:
      'flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-105',
  },
  B = { class: 'flex items-center gap-x-4 text-xs' },
  D = {
    class:
      'relative z-10 rounded-full bg-neutral-700 px-3 py-1.5 font-medium text-neutral-300',
  },
  L = { class: 'group relative' },
  V = {
    class:
      'mt-3 font-roboto-mono text-lg leading-6 tracking-tighter text-neutral-300 group-hover:text-neutral-400',
  },
  F = e('span', { class: 'absolute inset-0' }, null, -1),
  N = { class: 'mt-5 line-clamp-3 text-sm leading-6 text-neutral-400' },
  M = _({
    __name: 'PostPreview',
    props: {
      slug: {},
      pubDate: {},
      category: {},
      description: {},
      title: {},
      viewCount: {},
    },
    setup(a) {
      return (t, i) => {
        const l = m,
          c = $,
          d = y;
        return (
          o(),
          n('article', k, [
            e('div', B, [
              u(l, { date: t.pubDate }, null, 8, ['date']),
              e('span', D, r(t.category), 1),
              u(c, { 'view-count': t.viewCount }, null, 8, ['view-count']),
            ]),
            u(
              d,
              { to: t.slug },
              {
                default: g(() => [
                  e('div', L, [
                    e('h3', V, [F, f(' ' + r(t.title), 1)]),
                    e('p', N, r(t.description), 1),
                  ]),
                ]),
                _: 1,
              },
              8,
              ['to'],
            ),
          ])
        );
      };
    },
  }),
  Z = { class: 'mx-auto' },
  j = {
    class:
      'mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-neutral-800 pt-10 sm:mt-16 sm:grid-cols-2 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3',
  },
  O = _({
    __name: 'PostPreviews',
    props: { includeLatest: { type: Boolean, default: !1 } },
    setup(a) {
      const t = a,
        { posts: i, latestsPosts: l } = v(),
        c = t.includeLatest ? l : i;
      return (d, G) => {
        const p = M;
        return (
          o(),
          n('div', Z, [
            e('div', j, [
              (o(!0),
              n(
                C,
                null,
                x(
                  w(c),
                  (s) => (
                    o(),
                    h(
                      p,
                      {
                        key: s.slug,
                        slug: s.slug,
                        'pub-date': s.pubDate,
                        category: s.category,
                        description: s.description,
                        title: s.title,
                        'view-count': s.viewCount,
                      },
                      null,
                      8,
                      [
                        'slug',
                        'pub-date',
                        'category',
                        'description',
                        'title',
                        'view-count',
                      ],
                    )
                  ),
                ),
                128,
              )),
            ]),
          ])
        );
      };
    },
  }),
  S = {},
  z = { role: 'status', class: 'flex justify-center p-12' },
  E = e(
    'svg',
    {
      'aria-hidden': 'true',
      class: 'mr-2 h-12 w-12 animate-spin fill-teal-600 dark:text-gray-600',
      viewBox: '0 0 100 101',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      e('path', {
        d: 'M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z',
        fill: 'currentColor',
      }),
      e('path', {
        d: 'M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z',
        fill: 'currentFill',
      }),
    ],
    -1,
  ),
  T = e('span', { class: 'sr-only' }, 'Loading...', -1),
  q = [E, T];
function A(a, t) {
  return o(), n('div', z, q);
}
const Q = b(S, [['render', A]]);
export { O as _, Q as a };
