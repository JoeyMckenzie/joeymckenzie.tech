import { _ as _sfc_main$5 } from './SectionHeader-1944ba4b.mjs';
import { useSSRContext, defineComponent, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSuspense, ssrInterpolate, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { a as useSeoMeta, _ as _export_sfc } from '../server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-295e6065.mjs';
import __nuxt_component_2 from './Icon-1467d095.mjs';
import { _ as _sfc_main$1$1, a as __nuxt_component_4 } from './PostsLoading-0257d502.mjs';
import './HtmlTag-e3b0f009.mjs';
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
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import './state-7cec3730.mjs';
import './config-f07c7223.mjs';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import './FormattedDate-62af8e69.mjs';
import './asyncData-2f1fb5f7.mjs';
import './fetch-75dcd31e.mjs';
import './ssr-163a9e00.mjs';
import './query-e00a0c40.mjs';
import './preview-3e95320c.mjs';

const _sfc_main$4 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<span${ssrRenderAttrs(mergeProps({ class: "font-bold" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</span>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InlineBold.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_InlineBold = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-row items-center gap-x-4" }, _attrs))}><div class="prose mx-auto inline-flex max-w-2xl flex-col text-sm leading-6 text-neutral-400"><p class="mt-6"> Hi, I&#39;m Joey. I&#39;m a `);
  _push(ssrRenderComponent(_component_InlineBold, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Senior Software Engineer`);
      } else {
        return [
          createTextVNode("Senior Software Engineer")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(` based in Northern California working in fintech. I enjoy writing about software, design, dad jokes, and cheap beer among a few other things. I like building fast and efficient web services, learning new things, and writing code in the open source ecosystem. If you&#39;d like to get in touch, feel free to reach on on any of my socials. </p></div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/Intro.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SocialButton",
  __ssrInlineRender: true,
  props: {
    href: {},
    name: {},
    display: {},
    icon: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_Icon = __nuxt_component_2;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        external: true,
        href: _ctx.href,
        type: "button",
        class: "inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-700 focus:outline-none"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="sr-only"${_scopeId}>${ssrInterpolate(props.name)}</span>`);
            _push2(ssrRenderComponent(_component_Icon, {
              class: "mr-3 h-5 w-5",
              name: props.icon
            }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(props.display)} `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "tabler:external-link",
              class: "-mr-1 ml-3 h-5 w-5",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "sr-only" }, toDisplayString(props.name), 1),
              createVNode(_component_Icon, {
                class: "mr-3 h-5 w-5",
                name: props.icon
              }, null, 8, ["name"]),
              createTextVNode(" " + toDisplayString(props.display) + " ", 1),
              createVNode(_component_Icon, {
                name: "tabler:external-link",
                class: "-mr-1 ml-3 h-5 w-5",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/SocialButton.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SocialButtons",
  __ssrInlineRender: true,
  setup(__props) {
    const socials = [
      {
        display: "Twitter",
        name: "Twitter",
        href: "https://twitter.com/_joeyMcKenzie",
        icon: "mdi:twitter"
      },
      {
        display: "GitHub",
        name: "GitHub",
        href: "https://github.com/JoeyMcKenzie",
        icon: "mdi:github"
      },
      {
        display: "LinkedIn",
        name: "LinkedIn",
        href: "https://linkedin.com/in/JoeyMcKenzie",
        icon: "mdi:linkedin"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HomeSocialButton = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_Icon = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto grid max-w-screen-md grid-cols-1 gap-y-2 pt-6 sm:grid-cols-4 sm:gap-x-2 sm:gap-y-0" }, _attrs))}><!--[-->`);
      ssrRenderList(socials, (social) => {
        _push(ssrRenderComponent(_component_HomeSocialButton, {
          key: social.display,
          display: social.display,
          name: social.name,
          href: social.href,
          icon: social.icon
        }, null, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        external: true,
        href: "https://resume.joeymckenzie.tech/JoeyMcKenzie_resume.pdf",
        download: "resume",
        target: "_blank",
        type: "button",
        class: "inline-flex w-full items-center justify-center rounded-md border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-700 focus:outline-none sm:px-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Resume `);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "mdi:tray-arrow-down",
              class: "-mr-1 ml-3 h-5 w-5",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Resume "),
              createVNode(_component_Icon, {
                name: "mdi:tray-arrow-down",
                class: "-mr-1 ml-3 h-5 w-5",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/home/SocialButtons.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Hi, I'm Joe | joeymckenzie.tech",
      ogTitle: "Hi, I'm Joe | joeymckenzie.tech",
      description: "A blog about code, software, and sometimes beer.",
      ogDescription: "A blog about code, software, and sometimes beer.",
      ogImage: "https://joeymckenzie.tech/favicon-32x32.png",
      twitterCard: "summary_large_image"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionHeader = _sfc_main$5;
      const _component_HomeIntro = __nuxt_component_1;
      const _component_HomeSocialButtons = _sfc_main$1;
      const _component_BlogPostPreviews = _sfc_main$1$1;
      const _component_BlogPostsLoading = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_SectionHeader, { title: "Hi, I'm Joey" }, null, _parent));
      _push(ssrRenderComponent(_component_HomeIntro, null, null, _parent));
      _push(ssrRenderComponent(_component_HomeSocialButtons, null, null, _parent));
      ssrRenderSuspense(_push, {
        fallback: () => {
          _push(ssrRenderComponent(_component_BlogPostsLoading, null, null, _parent));
        },
        default: () => {
          _push(ssrRenderComponent(_component_BlogPostPreviews, { "include-latest": true }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-1f97cb85.mjs.map
