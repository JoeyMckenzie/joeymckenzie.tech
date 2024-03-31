import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./index-WUsypswg.js";
import { Link } from "@inertiajs/vue3";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BlogCard",
  __ssrInlineRender: true,
  props: {
    frontMatter: {}
  },
  setup(__props) {
    const props = __props;
    const href = computed(() => `/blog/${props.frontMatter.slug}`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "hover:scale-102 flex max-w-xl flex-col items-start transition duration-150 ease-in-out hover:-translate-y-1" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Link), { href: href.value }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center gap-x-4 text-xs"${_scopeId}><time dateTime="frontMatter.published_date"${_scopeId}>${ssrInterpolate(_ctx.frontMatter.published_date)}</time>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), { variant: "secondary" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.frontMatter.category)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.frontMatter.category), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p${_scopeId}>${ssrInterpolate(_ctx.frontMatter.views)} views</p></div><div class="group relative"${_scopeId}><h3 class="mt-3 text-lg font-semibold leading-6"${_scopeId}><span class="absolute inset-0"${_scopeId}></span> ${ssrInterpolate(_ctx.frontMatter.title)}</h3><p class="mt-5 line-clamp-3 text-sm leading-6"${_scopeId}>${ssrInterpolate(_ctx.frontMatter.description)}</p></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center gap-x-4 text-xs" }, [
                createVNode("time", { dateTime: "frontMatter.published_date" }, toDisplayString(_ctx.frontMatter.published_date), 1),
                createVNode(unref(_sfc_main$2), { variant: "secondary" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(_ctx.frontMatter.category), 1)
                  ]),
                  _: 1
                }),
                createVNode("p", null, toDisplayString(_ctx.frontMatter.views) + " views", 1)
              ]),
              createVNode("div", { class: "group relative" }, [
                createVNode("h3", { class: "mt-3 text-lg font-semibold leading-6" }, [
                  createVNode("span", { class: "absolute inset-0" }),
                  createTextVNode(" " + toDisplayString(_ctx.frontMatter.title), 1)
                ]),
                createVNode("p", { class: "mt-5 line-clamp-3 text-sm leading-6" }, toDisplayString(_ctx.frontMatter.description), 1)
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/BlogCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BlogPreviews",
  __ssrInlineRender: true,
  props: {
    frontMatters: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-12 py-8 sm:grid-cols-3" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.frontMatters, (frontMatter) => {
        _push(ssrRenderComponent(_sfc_main$1, {
          key: frontMatter.slug,
          "front-matter": frontMatter
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/BlogPreviews.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
