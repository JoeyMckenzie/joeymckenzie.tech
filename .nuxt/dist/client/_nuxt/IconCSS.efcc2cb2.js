import {
  g as l,
  af as _,
  a9 as m,
  J as o,
  o as f,
  c as d,
  R as S,
} from './entry.f0151a78.js';
import { _ as g } from './_plugin-vue_export-helper.c27b6911.js';
const x = l({
  __name: 'IconCSS',
  props: {
    name: { type: String, required: !0 },
    size: { type: String, default: '' },
  },
  setup(r) {
    _((e) => ({ '17e81e26': u.value }));
    const n = m(),
      t = r,
      p = o(() => {
        var e;
        return (
          (((e = n.nuxtIcon) == null ? void 0 : e.aliases) || {})[t.name] ||
          t.name
        ).replace(/^i-/, '');
      }),
      u = o(
        () =>
          `url('https://api.iconify.design/${p.value.replace(':', '/')}.svg')`,
      ),
      a = o(() => {
        var s, c, i;
        if (
          !t.size &&
          typeof ((s = n.nuxtIcon) == null ? void 0 : s.size) == 'boolean' &&
          !((c = n.nuxtIcon) != null && c.size)
        )
          return;
        const e =
          t.size || ((i = n.nuxtIcon) == null ? void 0 : i.size) || '1em';
        return String(Number(e)) === e ? `${e}px` : e;
      });
    return (e, s) => (
      f(), d('span', { style: S({ width: a.value, height: a.value }) }, null, 4)
    );
  },
});
const y = g(x, [['__scopeId', 'data-v-2717c442']]);
export { y as default };
