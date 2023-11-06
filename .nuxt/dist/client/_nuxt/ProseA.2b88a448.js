import { _ as a } from './nuxt-link.48ad20a1.js';
import { g as o, o as n, j as s, w as f, r as u } from './entry.f0151a78.js';
const l = o({
  __name: 'ProseA',
  props: {
    href: { type: String, default: '' },
    target: { type: String, default: void 0, required: !1 },
  },
  setup(e) {
    return (t, _) => {
      const r = a;
      return (
        n(),
        s(
          r,
          { href: e.href, target: e.target },
          { default: f(() => [u(t.$slots, 'default')]), _: 3 },
          8,
          ['href', 'target'],
        )
      );
    };
  },
});
export { l as default };
