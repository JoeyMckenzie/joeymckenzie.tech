import { _ as M } from './nuxt-link.48ad20a1.js';
import {
  g as $,
  o as m,
  j as K,
  w as v,
  r as S,
  c as g,
  a as h,
  b as f,
  F as L,
  k as P,
  d as R,
  t as z,
  X as H,
  U as Z,
  V as k,
  a3 as ee,
  ag as U,
  ah as J,
  ai as te,
  v as F,
  a7 as V,
  J as b,
  Y as O,
  u as ne,
  Z as se,
  z as ie,
  aa as oe,
  i as re,
  m as I,
  Q as ae,
} from './entry.f0151a78.js';
import { _ as ce } from './HtmlTag.vue.10b495f0.js';
import W from './Icon.4bfa2958.js';
import { _ as G } from './_plugin-vue_export-helper.c27b6911.js';
import './state.704f78e9.js';
const le = $({
    __name: 'NavLink',
    props: { href: {} },
    setup(e) {
      return (t, s) => {
        const n = M;
        return (
          m(),
          K(
            n,
            {
              to: t.href,
              class:
                'inline-flex rounded px-2 py-1 font-roboto-mono font-medium text-neutral-400 hover:bg-neutral-700',
              'active-class':
                'border border-transparent bg-neutral-800 text-neutral-300 focus:outline-none',
            },
            { default: v(() => [S(t.$slots, 'default')]), _: 3 },
            8,
            ['to'],
          )
        );
      };
    },
  }),
  de = { class: 'flex flex-row items-center justify-center gap-x-2 px-6 pt-8' },
  ue = $({
    __name: 'LayoutNavbar',
    setup(e) {
      const t = [
        { display: 'Home', href: '/' },
        { display: 'About', href: '/about' },
        { display: 'Blog', href: '/blog' },
      ];
      return (s, n) => {
        const i = le,
          o = ce;
        return (
          m(),
          g('header', null, [
            h('nav', de, [
              f(
                o,
                { 'additional-classes': 'hidden sm:block', 'tag-name': 'menu' },
                {
                  default: v(() => [
                    (m(),
                    g(
                      L,
                      null,
                      P(t, (r) =>
                        f(
                          i,
                          {
                            key: r.display,
                            href: r.href,
                            class: 'transition duration-150 ease-in-out',
                          },
                          { default: v(() => [R(z(r.display), 1)]), _: 2 },
                          1032,
                          ['href'],
                        ),
                      ),
                      64,
                    )),
                  ]),
                  _: 1,
                },
              ),
            ]),
          ])
        );
      };
    },
  }),
  fe = { class: 'flex justify-center space-x-6 md:order-2' },
  he = { class: 'sr-only' },
  me = $({
    __name: 'SocialIcons',
    setup(e) {
      const t = [
        {
          href: 'https://twitter.com/_joeyMcKenzie',
          display: 'Twitter',
          icon: 'simple-icons:x',
        },
        {
          href: 'https://github.com/JoeyMcKenzie',
          display: 'GitHub',
          icon: 'mdi:github',
        },
        {
          href: 'https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#',
          display: 'YouTube',
          icon: 'mdi:youtube',
        },
        {
          href: 'https://twitch.tv/JoeTheDevMan',
          display: 'Twitch',
          icon: 'mdi:twitch',
        },
        {
          href: 'https://linkedin.com/in/JoeyMcKenzie',
          display: 'LinkedIn',
          icon: 'mdi:linkedin',
        },
      ];
      return (s, n) => {
        const i = W,
          o = M;
        return (
          m(),
          g('div', null, [
            h('div', fe, [
              (m(),
              g(
                L,
                null,
                P(t, (r) =>
                  f(
                    o,
                    {
                      key: r.display,
                      external: !0,
                      href: r.href,
                      class: 'text-neutral-400 hover:text-neutral-500',
                    },
                    {
                      default: v(() => [
                        h('span', he, z(r.display), 1),
                        f(
                          i,
                          {
                            name: r.icon,
                            class:
                              'h-6 w-6 transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-110',
                            'aria-hidden': 'true',
                          },
                          null,
                          8,
                          ['name'],
                        ),
                      ]),
                      _: 2,
                    },
                    1032,
                    ['href'],
                  ),
                ),
                64,
              )),
            ]),
          ])
        );
      };
    },
  }),
  ge = { class: 'flex flex-col space-y-1' },
  pe = { class: 'flex flex-row items-center justify-center space-x-2' },
  _e = { class: 'flex flex-col' },
  ye = { class: 'text-xs text-neutral-500' },
  ve = $({
    __name: 'NotCurrentlyListening',
    props: { text: { type: String, default: 'Not currently listening' } },
    setup(e) {
      return (t, s) => (
        m(),
        g('div', ge, [
          h('div', pe, [
            S(t.$slots, 'default'),
            h('div', _e, [h('h4', ye, z(e.text), 1)]),
          ]),
        ])
      );
    },
  });
async function xe(e, t) {
  return await we(t).catch(
    (n) => (
      console.error('Failed to get image meta for ' + t, n + ''),
      { width: 0, height: 0, ratio: 0 }
    ),
  );
}
async function we(e) {
  if (typeof Image > 'u') throw new TypeError('Image not supported');
  return new Promise((t, s) => {
    const n = new Image();
    (n.onload = () => {
      const i = { width: n.width, height: n.height, ratio: n.width / n.height };
      t(i);
    }),
      (n.onerror = (i) => s(i)),
      (n.src = e);
  });
}
function T(e) {
  return (t) => (t ? e[t] || t : e.missingValue);
}
function be({ formatter: e, keyMap: t, joinWith: s = '/', valueMap: n } = {}) {
  e || (e = (o, r) => `${o}=${r}`), t && typeof t != 'function' && (t = T(t));
  const i = n || {};
  return (
    Object.keys(i).forEach((o) => {
      typeof i[o] != 'function' && (i[o] = T(i[o]));
    }),
    (o = {}) =>
      Object.entries(o)
        .filter(([a, l]) => typeof l < 'u')
        .map(([a, l]) => {
          const d = i[a];
          return (
            typeof d == 'function' && (l = d(o[a])),
            (a = typeof t == 'function' ? t(a) : a),
            e(a, l)
          );
        })
        .join(s)
  );
}
function y(e = '') {
  if (typeof e == 'number') return e;
  if (typeof e == 'string' && e.replace('px', '').match(/^\d+$/g))
    return parseInt(e, 10);
}
function $e(e = '') {
  if (e === void 0 || !e.length) return [];
  const t = new Set();
  for (const s of e.split(' ')) {
    const n = parseInt(s.replace('x', ''));
    n && t.add(n);
  }
  return Array.from(t);
}
function Se(e) {
  if (e.length === 0)
    throw new Error(
      '`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)',
    );
}
function ze(e) {
  const t = {};
  if (typeof e == 'string')
    for (const s of e.split(/[\s,]+/).filter((n) => n)) {
      const n = s.split(':');
      n.length !== 2
        ? (t['1px'] = n[0].trim())
        : (t[n[0].trim()] = n[1].trim());
    }
  else Object.assign(t, e);
  return t;
}
function Ne(e) {
  const t = { options: e },
    s = (i, o = {}) => Q(t, i, o),
    n = (i, o = {}, r = {}) =>
      s(i, { ...r, modifiers: U(o, r.modifiers || {}) }).url;
  for (const i in e.presets)
    n[i] = (o, r, a) => n(o, r, { ...e.presets[i], ...a });
  return (
    (n.options = e),
    (n.getImage = s),
    (n.getMeta = (i, o) => je(t, i, o)),
    (n.getSizes = (i, o) => Me(t, i, o)),
    (t.$img = n),
    n
  );
}
async function je(e, t, s) {
  const n = Q(e, t, { ...s });
  return typeof n.getMeta == 'function'
    ? await n.getMeta()
    : await xe(e, n.url);
}
function Q(e, t, s) {
  var d, u;
  if (typeof t != 'string' || t === '')
    throw new TypeError(
      `input must be a string (received ${typeof t}: ${JSON.stringify(t)})`,
    );
  if (t.startsWith('data:')) return { url: t };
  const { provider: n, defaults: i } = Ie(e, s.provider || e.options.provider),
    o = ke(e, s.preset);
  if (((t = H(t) ? t : Z(t)), !n.supportsAlias))
    for (const x in e.options.alias)
      t.startsWith(x) && (t = k(e.options.alias[x], t.substr(x.length)));
  if (n.validateDomains && H(t)) {
    const x = ee(t).host;
    if (!e.options.domains.find((j) => j === x)) return { url: t };
  }
  const r = U(s, o, i);
  r.modifiers = { ...r.modifiers };
  const a = r.modifiers.format;
  (d = r.modifiers) != null &&
    d.width &&
    (r.modifiers.width = y(r.modifiers.width)),
    (u = r.modifiers) != null &&
      u.height &&
      (r.modifiers.height = y(r.modifiers.height));
  const l = n.getImage(t, r, e);
  return (l.format = l.format || a || ''), l;
}
function Ie(e, t) {
  const s = e.options.providers[t];
  if (!s) throw new Error('Unknown provider: ' + t);
  return s;
}
function ke(e, t) {
  if (!t) return {};
  if (!e.options.presets[t]) throw new Error('Unknown preset: ' + t);
  return e.options.presets[t];
}
function Me(e, t, s) {
  var _, A, B, E, C;
  const n = y((_ = s.modifiers) == null ? void 0 : _.width),
    i = y((A = s.modifiers) == null ? void 0 : A.height),
    o = ze(s.sizes),
    r =
      (B = s.densities) != null && B.trim()
        ? $e(s.densities.trim())
        : e.options.densities;
  Se(r);
  const a = n && i ? i / n : 0,
    l = [],
    d = [];
  if (Object.keys(o).length >= 1) {
    for (const p in o) {
      const w = q(p, String(o[p]), i, a, e);
      if (w !== void 0) {
        l.push({
          size: w.size,
          screenMaxWidth: w.screenMaxWidth,
          media: `(max-width: ${w.screenMaxWidth}px)`,
        });
        for (const N of r)
          d.push({ width: w._cWidth * N, src: D(e, t, s, w, N) });
      }
    }
    Le(l);
  } else
    for (const p of r) {
      const w = Object.keys(o)[0];
      let N = q(w, String(o[w]), i, a, e);
      N === void 0 &&
        (N = {
          size: '',
          screenMaxWidth: 0,
          _cWidth: (E = s.modifiers) == null ? void 0 : E.width,
          _cHeight: (C = s.modifiers) == null ? void 0 : C.height,
        }),
        d.push({ width: p, src: D(e, t, s, N, p) });
    }
  Pe(d);
  const u = d[d.length - 1],
    x = l.length
      ? l.map((p) => `${p.media ? p.media + ' ' : ''}${p.size}`).join(', ')
      : void 0,
    j = x ? 'w' : 'x',
    c = d.map((p) => `${p.src} ${p.width}${j}`).join(', ');
  return { sizes: x, srcset: c, src: u == null ? void 0 : u.src };
}
function q(e, t, s, n, i) {
  const o = (i.options.screens && i.options.screens[e]) || parseInt(e),
    r = t.endsWith('vw');
  if ((!r && /^\d+$/.test(t) && (t = t + 'px'), !r && !t.endsWith('px')))
    return;
  let a = parseInt(t);
  if (!o || !a) return;
  r && (a = Math.round((a / 100) * o));
  const l = n ? Math.round(a * n) : s;
  return { size: t, screenMaxWidth: o, _cWidth: a, _cHeight: l };
}
function D(e, t, s, n, i) {
  return e.$img(
    t,
    {
      ...s.modifiers,
      width: n._cWidth ? n._cWidth * i : void 0,
      height: n._cHeight ? n._cHeight * i : void 0,
    },
    s,
  );
}
function Le(e) {
  var s;
  e.sort((n, i) => n.screenMaxWidth - i.screenMaxWidth);
  let t = null;
  for (let n = e.length - 1; n >= 0; n--) {
    const i = e[n];
    i.media === t && e.splice(n, 1), (t = i.media);
  }
  for (let n = 0; n < e.length; n++)
    e[n].media = ((s = e[n + 1]) == null ? void 0 : s.media) || '';
}
function Pe(e) {
  e.sort((s, n) => s.width - n.width);
  let t = null;
  for (let s = e.length - 1; s >= 0; s--) {
    const n = e[s];
    n.width === t && e.splice(s, 1), (t = n.width);
  }
}
const We = be({
    keyMap: {
      format: 'f',
      fit: 'fit',
      width: 'w',
      height: 'h',
      resize: 's',
      quality: 'q',
      background: 'b',
    },
    joinWith: '&',
    formatter: (e, t) => J(e) + '_' + J(t),
  }),
  Ae = (e, { modifiers: t = {}, baseURL: s } = {}, n) => {
    t.width &&
      t.height &&
      ((t.resize = `${t.width}x${t.height}`), delete t.width, delete t.height);
    const i = We(t) || '_';
    return (
      s || (s = k(n.options.nuxt.baseURL, '/_ipx')), { url: k(s, i, te(e)) }
    );
  },
  Be = !0,
  Ee = !0,
  Ce = Object.freeze(
    Object.defineProperty(
      { __proto__: null, getImage: Ae, supportsAlias: Ee, validateDomains: Be },
      Symbol.toStringTag,
      { value: 'Module' },
    ),
  ),
  X = {
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
    },
    presets: {},
    provider: 'ipx',
    domains: [],
    alias: {},
    densities: [1, 2],
    format: ['webp'],
  };
X.providers = { ipx: { provider: Ce, defaults: {} } };
const Y = () => {
    const e = F(),
      t = V();
    return (
      t.$img ||
      t._img ||
      (t._img = Ne({ ...X, nuxt: { baseURL: e.app.baseURL } }))
    );
  },
  He = {
    src: { type: String, required: !0 },
    format: { type: String, default: void 0 },
    quality: { type: [Number, String], default: void 0 },
    background: { type: String, default: void 0 },
    fit: { type: String, default: void 0 },
    modifiers: { type: Object, default: void 0 },
    preset: { type: String, default: void 0 },
    provider: { type: String, default: void 0 },
    sizes: { type: [Object, String], default: void 0 },
    densities: { type: String, default: void 0 },
    preload: { type: Boolean, default: void 0 },
    width: { type: [String, Number], default: void 0 },
    height: { type: [String, Number], default: void 0 },
    alt: { type: String, default: void 0 },
    referrerpolicy: { type: String, default: void 0 },
    usemap: { type: String, default: void 0 },
    longdesc: { type: String, default: void 0 },
    ismap: { type: Boolean, default: void 0 },
    loading: {
      type: String,
      default: void 0,
      validator: (e) => ['lazy', 'eager'].includes(e),
    },
    crossorigin: {
      type: [Boolean, String],
      default: void 0,
      validator: (e) =>
        ['anonymous', 'use-credentials', '', !0, !1].includes(e),
    },
    decoding: {
      type: String,
      default: void 0,
      validator: (e) => ['async', 'auto', 'sync'].includes(e),
    },
    nonce: { type: [String], default: void 0 },
  },
  Je = (e) => {
    const t = b(() => ({ provider: e.provider, preset: e.preset })),
      s = b(() => ({
        width: y(e.width),
        height: y(e.height),
        alt: e.alt,
        referrerpolicy: e.referrerpolicy,
        usemap: e.usemap,
        longdesc: e.longdesc,
        ismap: e.ismap,
        crossorigin:
          e.crossorigin === !0 ? 'anonymous' : e.crossorigin || void 0,
        loading: e.loading,
        decoding: e.decoding,
        nonce: e.nonce,
      })),
      n = Y(),
      i = b(() => ({
        ...e.modifiers,
        width: y(e.width),
        height: y(e.height),
        format: e.format,
        quality: e.quality || n.options.quality,
        background: e.background,
        fit: e.fit,
      }));
    return { options: t, attrs: s, modifiers: i };
  },
  Oe = {
    ...He,
    placeholder: { type: [Boolean, String, Number, Array], default: void 0 },
  },
  Te = $({
    name: 'NuxtImg',
    props: Oe,
    emits: ['load', 'error'],
    setup: (e, t) => {
      const s = Y(),
        n = Je(e),
        i = O(!1),
        o = b(() =>
          s.getSizes(e.src, {
            ...n.options.value,
            sizes: e.sizes,
            densities: e.densities,
            modifiers: {
              ...n.modifiers.value,
              width: y(e.width),
              height: y(e.height),
            },
          }),
        ),
        r = b(() => {
          const c = { ...n.attrs.value, 'data-nuxt-img': '' };
          return (
            (!e.placeholder || i.value) &&
              ((c.sizes = o.value.sizes), (c.srcset = o.value.srcset)),
            c
          );
        }),
        a = b(() => {
          let c = e.placeholder;
          if ((c === '' && (c = !0), !c || i.value)) return !1;
          if (typeof c == 'string') return c;
          const _ = Array.isArray(c)
            ? c
            : typeof c == 'number'
            ? [c, c]
            : [10, 10];
          return s(
            e.src,
            {
              ...n.modifiers.value,
              width: _[0],
              height: _[1],
              quality: _[2] || 50,
              blur: _[3] || 3,
            },
            n.options.value,
          );
        }),
        l = b(() =>
          e.sizes ? o.value.src : s(e.src, n.modifiers.value, n.options.value),
        ),
        d = b(() => (a.value ? a.value : l.value));
      if (e.preload) {
        const c = Object.values(o.value).every((_) => _);
        ne({
          link: [
            {
              rel: 'preload',
              as: 'image',
              nonce: e.nonce,
              ...(c
                ? {
                    href: o.value.src,
                    imagesizes: o.value.sizes,
                    imagesrcset: o.value.srcset,
                  }
                : { href: d.value }),
            },
          ],
        });
      }
      const u = O(),
        j = V().isHydrating;
      return (
        se(() => {
          if (a.value) {
            const c = new Image();
            (c.src = l.value),
              e.sizes &&
                ((c.sizes = o.value.sizes || ''), (c.srcset = o.value.srcset)),
              (c.onload = (_) => {
                (i.value = !0), t.emit('load', _);
              });
            return;
          }
          u.value &&
            (u.value.complete &&
              j &&
              (u.value.getAttribute('data-error')
                ? t.emit('error', new Event('error'))
                : t.emit('load', new Event('load'))),
            (u.value.onload = (c) => {
              t.emit('load', c);
            }),
            (u.value.onerror = (c) => {
              t.emit('error', c);
            }));
        }),
        () => ie('img', { ref: u, src: d.value, ...r.value, ...t.attrs })
      );
    },
  }),
  qe = ['href'],
  De = h(
    'h2',
    {
      class: 'inline-flex justify-center font-ubuntu text-xs text-neutral-400',
    },
    ' Now listening ',
    -1,
  ),
  Re = { class: 'flex flex-row items-center justify-center space-x-2' },
  Ue = { class: 'flex max-w-[16rem] flex-col' },
  Fe = {
    class:
      'line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold text-neutral-300',
  },
  Ve = { class: 'text-xs text-neutral-400' },
  Ge = $({
    __name: 'CurrentlyPlaying',
    props: { response: {} },
    setup(e) {
      return (t, s) => {
        const n = Te;
        return (
          m(),
          g(
            'a',
            {
              href: t.response.href,
              target: '_blank',
              rel: 'noreferrer',
              class: 'flex flex-col space-y-1',
            },
            [
              De,
              h('div', Re, [
                S(t.$slots, 'default'),
                f(
                  n,
                  {
                    src: t.response.albumImageSrc,
                    width: '30',
                    height: '30',
                    alt: 'Spotify listenting to',
                    class: 'rounded-sm',
                  },
                  null,
                  8,
                  ['src'],
                ),
                h('div', Ue, [
                  h('h4', Fe, z(t.response.trackTitle), 1),
                  h('p', Ve, z(t.response.artist), 1),
                ]),
              ]),
            ],
            8,
            qe,
          )
        );
      };
    },
  }),
  Qe = { key: 0 },
  Xe = { key: 1 },
  Ye = { key: 2 },
  Ke = $({
    __name: 'NowPlaying',
    async setup(e) {
      let t, s;
      const { data: n, pending: i } =
        (([t, s] = oe(() => re('/api/spotify', '$jreJfgp754'))),
        (t = await t),
        s(),
        t);
      return (o, r) => {
        var d;
        const a = ve,
          l = Ge;
        return I(i)
          ? (m(),
            g('div', Qe, [
              f(
                a,
                { text: 'Loading...' },
                { default: v(() => [S(o.$slots, 'default')]), _: 3 },
              ),
            ]))
          : !I(i) && (d = I(n)) != null && d.nowPlaying
          ? (m(),
            g('div', Xe, [
              f(
                l,
                { response: I(n) },
                { default: v(() => [S(o.$slots, 'default')]), _: 3 },
                8,
                ['response'],
              ),
            ]))
          : (m(),
            g('div', Ye, [
              f(a, null, { default: v(() => [S(o.$slots, 'default')]), _: 3 }),
            ]));
      };
    },
  }),
  Ze = {
    class:
      'mx-auto inline-flex flex-row items-center gap-x-2 md:order-1 md:mx-0',
  },
  et = h(
    'p',
    { class: 'text-center font-ubuntu text-xs leading-5 text-neutral-500' },
    ' Powered by ',
    -1,
  ),
  tt = { class: 'sr-only' },
  nt = $({
    __name: 'PoweredBy',
    setup(e) {
      const s = F().public.commitSha,
        n = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${s}`,
        i = s == null ? void 0 : s.substring(0, 6),
        o = [
          { href: 'https://vuejs.org', display: 'Vue', icon: 'logos:vue' },
          {
            href: 'https://vercel.com',
            display: 'Netlify',
            icon: 'simple-icons:vercel',
            classes: 'text-neutral-100',
          },
          {
            href: 'https://nuxt.com',
            display: 'Nuxt',
            icon: 'simple-icons:nuxtdotjs',
            classes: 'text-green-500 hover:text-green-400',
          },
        ];
      return (r, a) => {
        const l = W,
          d = M;
        return (
          m(),
          g('div', Ze, [
            et,
            (m(),
            g(
              L,
              null,
              P(o, (u) =>
                f(
                  d,
                  { key: u.display, external: !0, to: u.href },
                  {
                    default: v(() => [
                      h('span', tt, z(u.display), 1),
                      f(
                        l,
                        {
                          name: u.icon,
                          class: ae(
                            `h-6 w-6 transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-110 ${u.classes}`,
                          ),
                        },
                        null,
                        8,
                        ['name', 'class'],
                      ),
                    ]),
                    _: 2,
                  },
                  1032,
                  ['to'],
                ),
              ),
              64,
            )),
            f(
              d,
              {
                external: !0,
                to: n,
                class:
                  'text-center font-ubuntu text-xs leading-5 text-neutral-500 hover:text-neutral-400',
              },
              { default: v(() => [R(z(I(i)), 1)]), _: 1 },
            ),
          ])
        );
      };
    },
  }),
  st = {},
  it = {
    class:
      'mx-auto flex max-w-4xl flex-col gap-y-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:gap-y-0 lg:px-8',
  };
function ot(e, t) {
  const s = me,
    n = W,
    i = Ke,
    o = nt;
  return (
    m(),
    g('footer', it, [
      f(s),
      f(i, null, {
        default: v(() => [
          f(n, { class: 'h-6 w-6', name: 'logos:spotify-icon' }),
        ]),
        _: 1,
      }),
      f(o),
    ])
  );
}
const rt = G(st, [['render', ot]]),
  at = {},
  ct = { class: 'mx-auto max-w-screen-lg px-6 pt-12 lg:px-8' };
function lt(e, t) {
  const s = ue,
    n = rt;
  return (
    m(), g('div', null, [f(s), h('main', ct, [S(e.$slots, 'default')]), f(n)])
  );
}
const pt = G(at, [['render', lt]]);
export { pt as default };
