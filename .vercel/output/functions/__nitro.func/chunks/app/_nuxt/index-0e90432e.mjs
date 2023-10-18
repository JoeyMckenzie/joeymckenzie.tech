import { _ as _sfc_main$1 } from './SectionHeader-1944ba4b.mjs';
import { _ as _sfc_main$1$1, a as __nuxt_component_4 } from './PostsLoading-0257d502.mjs';
import { a as useSeoMeta } from '../server.mjs';
import { defineComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense } from 'vue/server-renderer';
import './HtmlTag-e3b0f009.mjs';
import './FormattedDate-62af8e69.mjs';
import './nuxt-link-295e6065.mjs';
import '../../nitro/vercel.mjs';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import 'fs';
import 'path';
import 'shikiji';
import 'unified';
import 'mdast-util-to-string';
import 'micromark';
import 'unist-util-stringify-position';
import 'micromark-util-character';
import 'micromark-util-chunked';
import 'micromark-util-resolve-all';
import 'micromark-util-sanitize-uri';
import 'slugify';
import 'remark-parse';
import 'remark-rehype';
import 'remark-mdc';
import 'hast-util-to-string';
import 'github-slugger';
import 'detab';
import 'remark-emoji';
import 'remark-gfm';
import 'rehype-external-links';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'unist-util-visit';
import 'feed';
import './asyncData-2f1fb5f7.mjs';
import './fetch-75dcd31e.mjs';
import './ssr-163a9e00.mjs';
import './query-e00a0c40.mjs';
import './preview-3e95320c.mjs';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "joeymckenzie.tech",
      ogTitle: "Blog | joeymckenzie.tech",
      description: "A blog about code, software, and sometimes beer.",
      ogDescription: "A blog about code, software, and sometimes beer.",
      ogImage: "https://joeymckenzie.tech/favicon-32x32.png",
      twitterCard: "summary_large_image"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionHeader = _sfc_main$1;
      const _component_BlogPostPreviews = _sfc_main$1$1;
      const _component_BlogPostsLoading = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_SectionHeader, { title: "Blog" }, null, _parent));
      _push(`<div class="prose mx-auto flex max-w-2xl flex-col text-sm leading-6 text-neutral-400"><p class="mt-6 sm:text-center"> I write about a lot of things, mainly languages, ecoystems, and software design. I consider my writing a journal of technologies I&#39;ve worked with at some point during my career, and I&#39;m always happy to field questions and conversations from interested readers. Feel free to <a class="text-indigo-400 hover:text-indigo-500" href="mailto:joey.mckenzie27@gmail.com">contact</a> me about any of the writing I do here, or to simply say hello! </p></div>`);
      ssrRenderSuspense(_push, {
        fallback: () => {
          _push(ssrRenderComponent(_component_BlogPostsLoading, null, null, _parent));
        },
        default: () => {
          _push(ssrRenderComponent(_component_BlogPostPreviews, null, null, _parent));
        },
        _: 1
      });
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-0e90432e.mjs.map
