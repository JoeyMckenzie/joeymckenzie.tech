import { u as c, _ as m } from './SectionHeader.vue.6eb24204.js';
import { _ as l, a as d } from './PostsLoading.7101d8a9.js';
import {
  g as _,
  o as t,
  c as p,
  b as e,
  j as g,
  w as a,
  S as f,
  a as o,
  d as s,
} from './entry.f0151a78.js';
import './HtmlTag.vue.10b495f0.js';
import './FormattedDate.vue.d09cde38.js';
import './nuxt-link.48ad20a1.js';
import './_plugin-vue_export-helper.c27b6911.js';
const u = o(
    'div',
    {
      class:
        'prose mx-auto flex max-w-2xl flex-col text-sm leading-6 text-neutral-400',
    },
    [
      o('p', { class: 'mt-6 text-justify' }, [
        s(
          " I write about a lot of things, mainly languages, ecoystems, and software design. I consider my writing a journal of technologies I've worked with at some point during my career, and I'm always happy to field questions and conversations from interested readers. Feel free to ",
        ),
        o(
          'a',
          {
            class: 'text-indigo-400 hover:text-indigo-500',
            href: 'mailto:joey.mckenzie27@gmail.com',
          },
          'contact',
        ),
        s(' me about any of the writing I do here, or to simply say hello! '),
      ]),
    ],
    -1,
  ),
  z = _({
    __name: 'index',
    setup(x) {
      return (
        c({
          title: 'joeymckenzie.tech',
          ogTitle: 'Blog | joeymckenzie.tech',
          description: 'A blog about code, software, and sometimes beer.',
          ogDescription: 'A blog about code, software, and sometimes beer.',
          ogImage: 'https://joeymckenzie.tech/favicon-32x32.png',
          twitterCard: 'summary_large_image',
        }),
        (h, y) => {
          const n = m,
            i = l,
            r = d;
          return (
            t(),
            p('div', null, [
              e(n, { title: 'Blog' }),
              u,
              (t(),
              g(f, null, {
                fallback: a(() => [e(r)]),
                default: a(() => [e(i)]),
                _: 1,
              })),
            ])
          );
        }
      );
    },
  });
export { z as default };
