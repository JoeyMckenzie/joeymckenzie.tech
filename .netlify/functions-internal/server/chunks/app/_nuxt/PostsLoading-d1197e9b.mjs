import { _ as _sfc_main$4 } from './FormattedDate-2afc3c99.mjs';
import { useSSRContext, defineComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-e4ece057.mjs';
import { e as usePostStore } from '../server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PostViewCount",
  __ssrInlineRender: true,
  props: {
    viewCount: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "v-if": _ctx.viewCount > 0,
        class: "font-medium text-neutral-400"
      }, _attrs))}>${ssrInterpolate(_ctx.viewCount)} views </div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blog/PostViewCount.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "PostPreview",
  __ssrInlineRender: true,
  props: {
    slug: {},
    pubDate: {},
    category: {},
    description: {},
    title: {},
    viewCount: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormattedDate = _sfc_main$4;
      const _component_BlogPostViewCount = _sfc_main$3;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "flex max-w-xl flex-col items-start" }, _attrs))}><div class="flex items-center gap-x-4 text-xs">`);
      _push(ssrRenderComponent(_component_FormattedDate, { date: _ctx.pubDate }, null, _parent));
      _push(`<span class="relative z-10 rounded-full bg-neutral-700 px-3 py-1.5 font-medium text-neutral-300">${ssrInterpolate(_ctx.category)}</span>`);
      _push(ssrRenderComponent(_component_BlogPostViewCount, { "view-count": _ctx.viewCount }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: _ctx.slug }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="group relative"${_scopeId}><h3 class="mt-3 font-roboto-mono text-lg leading-6 tracking-tighter text-neutral-300 group-hover:text-neutral-400"${_scopeId}><span class="absolute inset-0"${_scopeId}></span> ${ssrInterpolate(_ctx.title)}</h3><p class="mt-5 line-clamp-3 text-sm leading-6 text-neutral-400"${_scopeId}>${ssrInterpolate(_ctx.description)}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "group relative" }, [
                createVNode("h3", { class: "mt-3 font-roboto-mono text-lg leading-6 tracking-tighter text-neutral-300 group-hover:text-neutral-400" }, [
                  createVNode("span", { class: "absolute inset-0" }),
                  createTextVNode(" " + toDisplayString(_ctx.title), 1)
                ]),
                createVNode("p", { class: "mt-5 line-clamp-3 text-sm leading-6 text-neutral-400" }, toDisplayString(_ctx.description), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</article>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blog/PostPreview.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PostPreviews",
  __ssrInlineRender: true,
  props: {
    includeLatest: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const { posts, latestsPosts } = usePostStore();
    const previewPosts = props.includeLatest ? latestsPosts : posts;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_BlogPostPreview = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto" }, _attrs))}><div class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-neutral-800 pt-10 sm:mt-16 sm:grid-cols-2 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(previewPosts), (post) => {
        _push(ssrRenderComponent(_component_BlogPostPreview, {
          key: post.slug,
          slug: post.slug,
          "pub-date": post.pubDate,
          category: post.category,
          description: post.description,
          title: post.title,
          "view-count": post.viewCount
        }, null, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blog/PostPreviews.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    role: "status",
    class: "flex justify-center p-12"
  }, _attrs))}><svg aria-hidden="true" class="mr-2 h-12 w-12 animate-spin fill-teal-600 dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path></svg><span class="sr-only">Loading...</span></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/blog/PostsLoading.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _sfc_main$1 as _, __nuxt_component_4 as a };
//# sourceMappingURL=PostsLoading-d1197e9b.mjs.map
