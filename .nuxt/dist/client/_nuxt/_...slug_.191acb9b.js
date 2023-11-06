import { _ as u } from './FormattedDate.vue.d09cde38.js';
import _ from './ContentRenderer.623c2a20.js';
import p from './Icon.4bfa2958.js';
import { _ as d } from './nuxt-link.48ad20a1.js';
import f from './ContentDoc.69730c6c.js';
import {
  g as x,
  h,
  i as g,
  o as b,
  c as v,
  b as e,
  w as n,
  a as o,
  t as s,
  d as w,
} from './entry.f0151a78.js';
import './ContentRendererMarkdown.vue.32cff1fc.js';
import './index.288f722b.js';
import './state.704f78e9.js';
import './_plugin-vue_export-helper.c27b6911.js';
import './ContentQuery.e15ff7c8.js';
const y = {
    class:
      'prose prose-invert mx-auto overflow-hidden pb-12 font-merriweather text-neutral-400 prose-h2:text-neutral-200 prose-a:text-neutral-200 hover:prose-a:text-neutral-300 prose-code:text-neutral-300 prose-img:mx-auto prose-img:rounded-md',
  },
  k = { class: 'text-center font-merriweather text-2xl text-neutral-300' },
  B = {
    class:
      'flex flex-row items-center justify-center gap-x-2 font-roboto-mono text-sm tracking-tighter',
  },
  D = { class: 'font-bold' },
  C = ['src'],
  P = x({
    __name: '[...slug]',
    setup(N) {
      const { path: r } = h();
      return (
        g(
          '/api/blogs/view',
          { method: 'POST', body: { slug: r.split('/')[2] ?? '' } },
          '$ij35HG41ph',
        ),
        (j, V) => {
          const a = u,
            i = _,
            l = p,
            c = d,
            m = f;
          return (
            b(),
            v('div', null, [
              e(m, null, {
                default: n(({ doc: t }) => [
                  o('article', y, [
                    o('h1', k, s(t.title), 1),
                    o('div', B, [
                      e(a, { date: new Date(t.pubDate) }, null, 8, ['date']),
                      o('span', D, '#' + s(t.category), 1),
                    ]),
                    o(
                      'img',
                      {
                        width: '540',
                        height: '280',
                        src: t.heroImage,
                        alt: 'Blog header image',
                      },
                      null,
                      8,
                      C,
                    ),
                    e(i, { value: t }, null, 8, ['value']),
                  ]),
                  e(
                    c,
                    {
                      to: '/blog',
                      type: 'button',
                      class:
                        'mx-auto flex w-40 items-center justify-center gap-x-1.5 rounded-md bg-neutral-800 px-3 py-2 text-sm font-semibold text-neutral-400 shadow-sm hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600',
                    },
                    {
                      default: n(() => [
                        e(l, { name: 'ic:round-arrow-back', class: 'h-6 w-6' }),
                        w(' Back to blogs '),
                      ]),
                      _: 1,
                    },
                  ),
                ]),
                _: 1,
              }),
            ])
          );
        }
      );
    },
  });
export { P as default };
