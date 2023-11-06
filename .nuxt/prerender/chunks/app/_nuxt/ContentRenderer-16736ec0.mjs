import { defineComponent, watch, useSlots, h, useSSRContext } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue/index.mjs';
import _sfc_main$1 from './ContentRendererMarkdown-6b4feeaa.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/destr/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/scule/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/property-information/index.js';
import '../server.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ofetch/dist/node.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/hookable/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unctx/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/defu/dist/defu.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unhead/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/h3/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ufo/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue/server-renderer/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ohash/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/cookie-es/dist/index.mjs';
import '../../nitro/nitro-prerenderer.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/klona/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/memory.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/pathe/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/shikiji/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unified/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/mdast-util-to-string/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unist-util-stringify-position/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-character/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-chunked/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-resolve-all/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-sanitize-uri/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/slugify/slugify.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-parse/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-rehype/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-mdc/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/hast-util-to-string/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/github-slugger/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/detab/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-emoji/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-gfm/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-external-links/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-sort-attribute-values/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-sort-attributes/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-raw/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unist-util-visit/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/feed/lib/feed.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ipx/dist/index.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  name: "ContentRenderer",
  props: {
    /**
     * The document to render.
     */
    value: {
      type: Object,
      required: false,
      default: () => ({})
    },
    /**
     * Whether or not to render the excerpt.
     * @default false
     */
    excerpt: {
      type: Boolean,
      default: false
    },
    /**
     * The tag to use for the renderer element if it is used.
     * @default 'div'
     */
    tag: {
      type: String,
      default: "div"
    }
  },
  setup(props) {
    watch(
      () => props.excerpt,
      (newExcerpt) => {
        var _a, _b, _c;
        if (newExcerpt && !((_a = props.value) == null ? void 0 : _a.excerpt)) {
          console.warn(`No excerpt found for document content/${(_b = props == null ? void 0 : props.value) == null ? void 0 : _b._path}.${(_c = props == null ? void 0 : props.value) == null ? void 0 : _c._extension}!`);
          console.warn("Make sure to use <!--more--> in your content if you want to use excerpt feature.");
        }
      },
      {
        immediate: true
      }
    );
  },
  /**
   * Content empty fallback
   * @slot empty
   */
  render(ctx) {
    var _a, _b;
    const slots = useSlots();
    const { value, excerpt, tag } = ctx;
    const markdownAST = excerpt ? value == null ? void 0 : value.excerpt : value == null ? void 0 : value.body;
    if (!((_a = markdownAST == null ? void 0 : markdownAST.children) == null ? void 0 : _a.length) && (slots == null ? void 0 : slots.empty)) {
      return slots.empty({ value, excerpt, tag, ...this.$attrs });
    }
    if (slots == null ? void 0 : slots.default) {
      return slots.default({ value, excerpt, tag, ...this.$attrs });
    }
    if ((markdownAST == null ? void 0 : markdownAST.type) === "root" && ((_b = markdownAST == null ? void 0 : markdownAST.children) == null ? void 0 : _b.length)) {
      return h(
        _sfc_main$1,
        {
          value,
          excerpt,
          tag,
          ...this.$attrs
        }
      );
    }
    return h(
      "pre",
      null,
      JSON.stringify({ message: "You should use slots with <ContentRenderer>", value, excerpt, tag }, null, 2)
    );
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/content/dist/runtime/components/ContentRenderer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=ContentRenderer-16736ec0.mjs.map
