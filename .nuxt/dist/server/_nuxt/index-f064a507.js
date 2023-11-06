import { _ as _sfc_main$1 } from './SectionHeader-2f2bda11.js';
import {
  _ as _sfc_main$2,
  a as __nuxt_component_4,
} from './PostsLoading-bc3655ac.js';
import { a as useSeoMeta } from '../server.mjs';
import { defineComponent, useSSRContext } from 'vue';
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderSuspense,
} from 'vue/server-renderer';
import './HtmlTag-1d571bc3.js';
import './FormattedDate-2afc3c99.js';
import './nuxt-link-e4ece057.js';
import 'ufo';
import 'hookable';
import './_plugin-vue_export-helper-cc2b3d55.js';
import 'ofetch';
import '#internal/nitro';
import 'unctx';
import 'destr';
import 'devalue';
import 'defu';
import 'klona';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import '@vue/devtools-api';
import 'ohash';
import 'cookie-es';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'index',
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: 'joeymckenzie.tech',
      ogTitle: 'Blog | joeymckenzie.tech',
      description: 'A blog about code, software, and sometimes beer.',
      ogDescription: 'A blog about code, software, and sometimes beer.',
      ogImage: 'https://joeymckenzie.tech/favicon-32x32.png',
      twitterCard: 'summary_large_image',
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionHeader = _sfc_main$1;
      const _component_BlogPostPreviews = _sfc_main$2;
      const _component_BlogPostsLoading = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(
        ssrRenderComponent(
          _component_SectionHeader,
          { title: 'Blog' },
          null,
          _parent,
        ),
      );
      _push(
        `<div class="prose mx-auto flex max-w-2xl flex-col text-sm leading-6 text-neutral-400"><p class="mt-6 text-justify"> I write about a lot of things, mainly languages, ecoystems, and software design. I consider my writing a journal of technologies I&#39;ve worked with at some point during my career, and I&#39;m always happy to field questions and conversations from interested readers. Feel free to <a class="text-indigo-400 hover:text-indigo-500" href="mailto:joey.mckenzie27@gmail.com">contact</a> me about any of the writing I do here, or to simply say hello! </p></div>`,
      );
      ssrRenderSuspense(_push, {
        fallback: () => {
          _push(
            ssrRenderComponent(
              _component_BlogPostsLoading,
              null,
              null,
              _parent,
            ),
          );
        },
        default: () => {
          _push(
            ssrRenderComponent(
              _component_BlogPostPreviews,
              null,
              null,
              _parent,
            ),
          );
        },
        _: 1,
      });
      _push(`</div>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'pages/blog/index.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { _sfc_main as default };
//# sourceMappingURL=index-f064a507.js.map
