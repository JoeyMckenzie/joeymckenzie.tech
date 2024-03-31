import { defineComponent, computed, unref, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1, a as _sfc_main$3 } from "./MainLayout-CkkG4NM4.js";
import { Head, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./index-WUsypswg.js";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
import "@vueuse/components";
import "@iconify/vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Post",
  __ssrInlineRender: true,
  props: {
    post: {},
    keywords: {}
  },
  setup(__props) {
    const props = __props;
    const keywordList = computed(() => props.keywords.join(","));
    const altText = computed(() => `${props.post.title} blog meme`);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<meta${ssrRenderAttr("content", keywordList.value)} name="keywords"${_scopeId}><title${_scopeId}>
            ${ssrInterpolate(_ctx.post.title)}
        </title>`);
          } else {
            return [
              createVNode("meta", {
                content: keywordList.value,
                name: "keywords"
              }, null, 8, ["content"]),
              createVNode("title", null, "\n            " + toDisplayString(_ctx.post.title) + "\n        ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col justify-center pt-12"${_scopeId}><article class="prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md"${_scopeId}><h1 class="text-center text-2xl font-semibold"${_scopeId}>${ssrInterpolate(_ctx.post.title)}</h1><div class="flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight"${_scopeId}><time dateTime="{post.pubDate}"${_scopeId}>${ssrInterpolate(_ctx.post.published_date)}</time>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), { variant: "secondary" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.post.category)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.post.category), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p${_scopeId}>${ssrInterpolate(_ctx.post.views)} views</p></div><img${ssrRenderAttr("alt", altText.value)}${ssrRenderAttr("src", _ctx.post.hero_image)} height="400" width="500"${_scopeId}><div${_scopeId}>${_ctx.post.parsed_content}</div></article>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("blog"),
              class: "mx-auto max-w-md"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { variant: "secondary" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Back to blogs`);
                      } else {
                        return [
                          createTextVNode(" Back to blogs")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { variant: "secondary" }, {
                      default: withCtx(() => [
                        createTextVNode(" Back to blogs")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col justify-center pt-12" }, [
                createVNode("article", { class: "prose mx-auto w-full overflow-hidden pb-6 dark:prose-invert prose-pre:text-sm prose-img:mx-auto prose-img:rounded-md" }, [
                  createVNode("h1", { class: "text-center text-2xl font-semibold" }, toDisplayString(_ctx.post.title), 1),
                  createVNode("div", { class: "flex flex-row items-center justify-center gap-x-2 text-sm tracking-tight" }, [
                    createVNode("time", { dateTime: "{post.pubDate}" }, toDisplayString(_ctx.post.published_date), 1),
                    createVNode(unref(_sfc_main$2), { variant: "secondary" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.post.category), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("p", null, toDisplayString(_ctx.post.views) + " views", 1)
                  ]),
                  createVNode("img", {
                    alt: altText.value,
                    src: _ctx.post.hero_image,
                    height: "400",
                    width: "500"
                  }, null, 8, ["alt", "src"]),
                  createVNode("div", {
                    innerHTML: _ctx.post.parsed_content
                  }, null, 8, ["innerHTML"])
                ]),
                createVNode(unref(Link), {
                  href: _ctx.route("blog"),
                  class: "mx-auto max-w-md"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$3), { variant: "secondary" }, {
                      default: withCtx(() => [
                        createTextVNode(" Back to blogs")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["href"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Blog/Post.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
