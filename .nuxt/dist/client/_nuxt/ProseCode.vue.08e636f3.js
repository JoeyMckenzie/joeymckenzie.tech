import { g as t, r as n } from './entry.f0151a78.js';
const o = t({
  __name: 'ProseCode',
  props: {
    code: { type: String, default: '' },
    language: { type: String, default: null },
    filename: { type: String, default: null },
    highlights: { type: Array, default: () => [] },
    meta: { type: String, default: null },
  },
  setup(r) {
    return (e, l) => n(e.$slots, 'default');
  },
});
export { o as _ };
