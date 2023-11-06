import { u as w, _ as b } from './SectionHeader.vue.6eb24204.js';
import { _ as h } from './_plugin-vue_export-helper.c27b6911.js';
import {
  o,
  c,
  r as k,
  a as u,
  d as a,
  b as e,
  w as m,
  g as p,
  j as g,
  t as f,
  F as I,
  k as S,
  S as $,
} from './entry.f0151a78.js';
import x from './Icon.4bfa2958.js';
import { _ as y } from './nuxt-link.48ad20a1.js';
import { _ as j, a as B } from './PostsLoading.7101d8a9.js';
import './HtmlTag.vue.10b495f0.js';
import './state.704f78e9.js';
import './FormattedDate.vue.d09cde38.js';
const H = {},
  v = { class: 'font-bold' };
function z(s, n) {
  return o(), c('span', v, [k(s.$slots, 'default')]);
}
const J = h(H, [['render', z]]),
  L = {},
  N = { class: 'flex flex-row items-center gap-x-4' },
  M = {
    class:
      'prose mx-auto inline-flex max-w-2xl flex-col text-sm leading-6 text-neutral-400',
  },
  C = { class: 'mt-6 text-justify' };
function K(s, n) {
  const l = J;
  return (
    o(),
    c('div', N, [
      u('div', M, [
        u('p', C, [
          a(" Hi, I'm Joey. I'm a "),
          e(l, null, {
            default: m(() => [a('Senior Software Engineer')]),
            _: 1,
          }),
          a(
            " based in Northern California working in fintech. I enjoy writing about software, design, dad jokes, and cheap beer among a few other things. I like building fast and efficient web services, learning new things, and writing code in the open source ecosystem. If you'd like to get in touch, feel free to reach on on any of my socials. ",
          ),
        ]),
      ]),
    ])
  );
}
const T = h(L, [['render', K]]),
  P = { class: 'sr-only' },
  V = p({
    __name: 'SocialButton',
    props: { href: {}, name: {}, display: {}, icon: {} },
    setup(s) {
      return (n, l) => {
        const r = x,
          i = y;
        return (
          o(),
          g(
            i,
            {
              external: !0,
              href: n.href,
              type: 'button',
              class:
                'inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-400 shadow-sm transition duration-150 hover:bg-neutral-700 focus:outline-none',
            },
            {
              default: m(() => [
                u('span', P, f(n.name), 1),
                e(r, { class: 'mr-3 h-5 w-5', name: n.icon }, null, 8, [
                  'name',
                ]),
                a(' ' + f(n.display) + ' ', 1),
                e(r, {
                  name: 'tabler:external-link',
                  class: '-mr-1 ml-3 h-5 w-5',
                  'aria-hidden': 'true',
                }),
              ]),
              _: 1,
            },
            8,
            ['href'],
          )
        );
      };
    },
  }),
  A = {
    class:
      'mx-auto grid max-w-screen-md grid-cols-1 gap-y-2 pt-6 sm:grid-cols-4 sm:gap-x-2 sm:gap-y-0',
  },
  D = p({
    __name: 'SocialButtons',
    setup(s) {
      const n = [
        {
          display: 'Twitter',
          name: 'Twitter',
          href: 'https://twitter.com/_joeyMcKenzie',
          icon: 'mdi:twitter',
        },
        {
          display: 'GitHub',
          name: 'GitHub',
          href: 'https://github.com/JoeyMcKenzie',
          icon: 'mdi:github',
        },
        {
          display: 'LinkedIn',
          name: 'LinkedIn',
          href: 'https://linkedin.com/in/JoeyMcKenzie',
          icon: 'mdi:linkedin',
        },
      ];
      return (l, r) => {
        const i = V,
          _ = x,
          d = y;
        return (
          o(),
          c('div', A, [
            (o(),
            c(
              I,
              null,
              S(n, (t) =>
                e(
                  i,
                  {
                    key: t.display,
                    display: t.display,
                    name: t.name,
                    href: t.href,
                    icon: t.icon,
                  },
                  null,
                  8,
                  ['display', 'name', 'href', 'icon'],
                ),
              ),
              64,
            )),
            e(
              d,
              {
                external: !0,
                href: 'https://resume.joeymckenzie.tech/JoeyMcKenzie_resume.pdf',
                download: 'resume',
                target: '_blank',
                type: 'button',
                class:
                  'inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-700 focus:outline-none sm:px-4',
              },
              {
                default: m(() => [
                  a(' Resume '),
                  e(_, {
                    name: 'mdi:tray-arrow-down',
                    class: '-mr-1 ml-3 h-5 w-5',
                    'aria-hidden': 'true',
                  }),
                ]),
                _: 1,
              },
            ),
          ])
        );
      };
    },
  }),
  X = p({
    __name: 'index',
    setup(s) {
      return (
        w({
          title: "Hi, I'm Joe | joeymckenzie.tech",
          ogTitle: "Hi, I'm Joe | joeymckenzie.tech",
          description: 'A blog about code, software, and sometimes beer.',
          ogDescription: 'A blog about code, software, and sometimes beer.',
          ogImage: 'https://joeymckenzie.tech/favicon-32x32.png',
          twitterCard: 'summary_large_image',
        }),
        (n, l) => {
          const r = b,
            i = T,
            _ = D,
            d = j,
            t = B;
          return (
            o(),
            c('div', null, [
              e(r, { title: "Hi, I'm Joey" }),
              e(i),
              e(_),
              (o(),
              g($, null, {
                fallback: m(() => [e(t)]),
                default: m(() => [e(d, { 'include-latest': !0 })]),
                _: 1,
              })),
            ])
          );
        }
      );
    },
  });
export { X as default };
