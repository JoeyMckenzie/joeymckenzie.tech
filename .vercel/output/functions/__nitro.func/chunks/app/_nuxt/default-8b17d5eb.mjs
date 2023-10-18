import { _ as _sfc_main$9 } from './HtmlTag-e3b0f009.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-295e6065.mjs';
import { useSSRContext, defineComponent, mergeProps, withCtx, renderSlot, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createVNode, withAsyncContext, unref } from 'vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import __nuxt_component_2 from './Icon-1467d095.mjs';
import { _ as _export_sfc, e as useRuntimeConfig } from '../server.mjs';
import { u as useFetch } from './fetch-75dcd31e.mjs';
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
import './state-7cec3730.mjs';
import './config-f07c7223.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import './ssr-163a9e00.mjs';
import './asyncData-2f1fb5f7.mjs';

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "NavLink",
  __ssrInlineRender: true,
  props: {
    href: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: props.href,
        class: "inline-flex rounded px-2 py-1 font-roboto-mono font-medium text-neutral-400 hover:bg-neutral-700",
        "active-class": "border border-transparent bg-neutral-800 text-neutral-300 focus:outline-none"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NavLink.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "LayoutNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const links = [
      {
        display: "Home",
        href: "/"
      },
      {
        display: "About",
        href: "/about"
      },
      {
        display: "Blog",
        href: "/blog"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HtmlTag = _sfc_main$9;
      const _component_NavLink = _sfc_main$8;
      _push(`<header${ssrRenderAttrs(_attrs)}><nav class="flex flex-row items-center justify-center gap-x-2 px-6 pt-8">`);
      _push(ssrRenderComponent(_component_HtmlTag, {
        "additional-classes": "hidden sm:block",
        "tag-name": "menu"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(links, (link) => {
              _push2(ssrRenderComponent(_component_NavLink, {
                key: link.display,
                href: link.href
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(link.display)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(link.display), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(links, (link) => {
                return createVNode(_component_NavLink, {
                  key: link.display,
                  href: link.href
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(link.display), 1)
                  ]),
                  _: 2
                }, 1032, ["href"]);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></header>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LayoutNavbar.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_Icon = __nuxt_component_2;
  _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-center space-x-6 md:order-2"><a href="https://twitter.com/_joeyMcKenzie" class="text-neutral-400 hover:text-neutral-500"><span class="sr-only">Twitter</span>`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "mdi:twitter",
    class: "h-6 w-6",
    "aria-hidden": "true"
  }, null, _parent));
  _push(`</a><a href="https://github.com/JoeyMcKenzie" class="text-neutral-400 hover:text-neutral-500"><span class="sr-only">GtiHub</span>`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "mdi:github",
    class: "h-6 w-6",
    "aria-hidden": "true"
  }, null, _parent));
  _push(`</a><a href="https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#" class="text-neutral-400 hover:text-neutral-500"><span class="sr-only">YouTube</span>`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "mdi:youtube",
    class: "h-6 w-6",
    "aria-hidden": "true"
  }, null, _parent));
  _push(`</a><a href="https://twitch.tv/JoeTheDevMan" class="text-neutral-400 hover:text-neutral-500"><span class="sr-only">Twitch</span>`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "mdi:twitch",
    class: "h-6 w-6",
    "aria-hidden": "true"
  }, null, _parent));
  _push(`</a><a href="https://linkedin.com/in/JoeyMcKenzie" class="text-neutral-400 hover:text-neutral-500"><span class="sr-only">LinkedIn</span>`);
  _push(ssrRenderComponent(_component_Icon, {
    name: "mdi:linkedin",
    class: "h-6 w-6",
    "aria-hidden": "true"
  }, null, _parent));
  _push(`</a></div></div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SocialIcons.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "NotCurrentlyListening",
  __ssrInlineRender: true,
  props: {
    text: {
      type: String,
      default: "Not currently listening"
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col space-y-1" }, _attrs))}><div class="flex flex-row items-center justify-center space-x-2">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<div class="flex flex-col"><h4 class="text-xs text-neutral-500">${ssrInterpolate(props.text)}</h4></div></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/spotify/NotCurrentlyListening.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "CurrentlyPlaying",
  __ssrInlineRender: true,
  props: {
    response: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: props.response.href,
        target: "_blank",
        rel: "noreferrer",
        class: "flex flex-col space-y-1"
      }, _attrs))}><h2 class="inline-flex justify-center font-ubuntu text-xs text-neutral-400"> Now listening </h2><div class="flex flex-row items-center justify-center space-x-2">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<img${ssrRenderAttr("src", props.response.albumImageSrc)} width="30" height="30" alt="Spotify listenting to" class="rounded-sm"><div class="flex flex-col truncate"><h4 class="text-xs font-semibold text-neutral-300">${ssrInterpolate(props.response.trackTitle)}</h4><p class="text-xs text-neutral-400">${ssrInterpolate(props.response.artist)}</p></div></div></a>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/spotify/CurrentlyPlaying.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "NowPlaying",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data, pending } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/spotify", "$jreJfgp754")), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_SpotifyNotCurrentlyListening = _sfc_main$5;
      const _component_SpotifyCurrentlyPlaying = _sfc_main$4;
      if (unref(pending)) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_component_SpotifyNotCurrentlyListening, { text: "Loading..." }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(`</div>`);
      } else if (!unref(pending) && ((_a = unref(data)) == null ? void 0 : _a.nowPlaying)) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_component_SpotifyCurrentlyPlaying, { response: unref(data) }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_component_SpotifyNotCurrentlyListening, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/spotify/NowPlaying.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "PoweredBy",
  __ssrInlineRender: true,
  setup(__props) {
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hash = config.public.commitSha;
    const hashRef = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${hash}`;
    const hashDisplay = hash == null ? void 0 : hash.substring(0, 6);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_Icon = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto inline-flex flex-row items-center gap-x-2 md:order-1 md:mx-0" }, _attrs))}><p class="text-center font-ubuntu text-xs leading-5 text-neutral-500"> Powered by </p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        external: true,
        to: "https://vuejs.org"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>Vue</span>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "logos:vue",
              class: "h-4 w-4"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "sr-only" }, "Vue"),
              createVNode(_component_Icon, {
                name: "logos:vue",
                class: "h-4 w-4"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        external: true,
        to: "https://vercel.com"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>vercel</span>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "simple-icons:vercel",
              class: "h-4 w-4 text-gray-100 hover:text-gray-200"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "sr-only" }, "vercel"),
              createVNode(_component_Icon, {
                name: "simple-icons:vercel",
                class: "h-4 w-4 text-gray-100 hover:text-gray-200"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        external: true,
        to: "https://nuxt.com"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>Nuxt</span>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "simple-icons:nuxtdotjs",
              class: "h-6 w-6 text-green-500 hover:text-green-400"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "sr-only" }, "Nuxt"),
              createVNode(_component_Icon, {
                name: "simple-icons:nuxtdotjs",
                class: "h-6 w-6 text-green-500 hover:text-green-400"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        external: true,
        to: hashRef,
        class: "text-center font-ubuntu text-xs leading-5 text-neutral-500 hover:text-neutral-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(hashDisplay))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(hashDisplay)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PoweredBy.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_SocialIcons = __nuxt_component_0;
  const _component_SpotifyNowPlaying = _sfc_main$3;
  const _component_Icon = __nuxt_component_2;
  const _component_PoweredBy = _sfc_main$2;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "mx-auto flex max-w-4xl flex-col gap-y-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:gap-y-0 lg:px-8" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_SocialIcons, null, null, _parent));
  _push(ssrRenderComponent(_component_SpotifyNowPlaying, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_Icon, {
          class: "h-6 w-6",
          name: "logos:spotify-icon"
        }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_Icon, {
            class: "h-6 w-6",
            name: "logos:spotify-icon"
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_PoweredBy, null, null, _parent));
  _push(`</footer>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LayoutFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_LayoutNavbar = _sfc_main$7;
  const _component_LayoutFooter = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_LayoutNavbar, null, null, _parent));
  _push(`<main class="mx-auto max-w-screen-lg px-6 pt-12 lg:px-8">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_LayoutFooter, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-8b17d5eb.mjs.map
