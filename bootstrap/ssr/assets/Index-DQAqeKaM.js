import { mergeProps, useSSRContext, defineComponent, unref, withCtx, createVNode, createTextVNode, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { b as _export_sfc, a as _sfc_main$9, c as cn, _ as _sfc_main$a } from "./MainLayout-CkkG4NM4.js";
import { _ as _sfc_main$8 } from "./BlogPreviews-DvMkV7rv.js";
import { Icon } from "@iconify/vue";
import { Head } from "@inertiajs/vue3";
import { cva } from "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
import "@vueuse/components";
import "./index-WUsypswg.js";
const _sfc_main$7 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 sm:px-6 lg:px-8" }, _attrs))}><div class="mx-auto max-w-2xl"><h2 class="text-center text-4xl font-extrabold tracking-tight sm:text-4xl"> Hi, I&#39;m Joey. </h2><p class="mx-auto mt-6 max-w-xl text-justify"> I&#39;m a software developer based in Northern California working in fintech. I enjoy writing about software, design, dad jokes, and cheap beer among a few other things. I like building fast, efficient web services, learning new things, and writing code in the open source ecosystem. </p></div></div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Hero.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Hero = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "LatestPosts",
  __ssrInlineRender: true,
  props: {
    frontMatters: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pt-12 sm:px-6 lg:px-8" }, _attrs))}><div class="mx-auto max-w-4xl"><h2 class="text-right text-3xl font-bold tracking-tight sm:text-center sm:text-4xl"> Latest thoughts. </h2>`);
      _push(ssrRenderComponent(_sfc_main$8, { "front-matters": _ctx.frontMatters }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/LatestPosts.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "SocialButtons",
  __ssrInlineRender: true,
  setup(__props) {
    const socials = [
      {
        href: "https://github.com/joeymckenzie",
        display: "GitHub",
        icon: "mdi:github"
      },
      {
        href: "https://linkedin.com/in/JoeyMcKenzie",
        display: "LinkedIn",
        icon: "mdi:linkedin"
      },
      {
        href: "https://x.com/_joeyMcKenzie",
        display: "Twitter",
        icon: "mdi:twitter"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto grid max-w-2xl grid-cols-1 gap-x-4 gap-y-4 py-8 sm:grid-cols-3" }, _attrs))}><!--[-->`);
      ssrRenderList(socials, (social) => {
        _push(`<div><a${ssrRenderAttr("href", social.href)}>`);
        _push(ssrRenderComponent(unref(_sfc_main$9), {
          class: "flex w-full flex-row items-center justify-center gap-x-3",
          variant: "outline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                icon: social.icon,
                class: "h-4 w-4"
              }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(social.display)} `);
              _push2(ssrRenderComponent(unref(Icon), { icon: "tabler:external-link" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Icon), {
                  icon: social.icon,
                  class: "h-4 w-4"
                }, null, 8, ["icon"]),
                createTextVNode(" " + toDisplayString(social.display) + " ", 1),
                createVNode(unref(Icon), { icon: "tabler:external-link" })
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</a></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SocialButtons.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Alert",
  __ssrInlineRender: true,
  props: {
    class: {},
    variant: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)(unref(alertVariants)({ variant: _ctx.variant }), props.class),
        role: "alert"
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ui/alert/Alert.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AlertTitle",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<h5${ssrRenderAttrs(mergeProps({
        class: unref(cn)("mb-1 font-medium leading-none tracking-tight", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</h5>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ui/alert/AlertTitle.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AlertDescription",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)("text-sm [&_p]:leading-relaxed", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ui/alert/AlertDescription.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Notes",
  __ssrInlineRender: true,
  props: {
    notes: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pb-4 sm:pb-16" }, _attrs))}><h2 class="pb-4 pt-8 text-left text-4xl font-bold tracking-tight sm:text-center"> Note to self. </h2><div class="mx-auto grid max-w-3xl grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3"><!--[-->`);
      ssrRenderList(_ctx.notes, (note) => {
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          key: note.title
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                class: "h-4 w-4",
                icon: "tabler:terminal"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "font-bold" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(note.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(note.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(note.description)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(note.description), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Icon), {
                  class: "h-4 w-4",
                  icon: "tabler:terminal"
                }),
                createVNode(unref(_sfc_main$3), { class: "font-bold" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(note.title), 1)
                  ]),
                  _: 2
                }, 1024),
                createVNode(unref(_sfc_main$2), null, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(note.description), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Notes.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    frontMatters: {},
    notes: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Hi, I&#39;m Joe.</title>`);
          } else {
            return [
              createVNode("title", null, "Hi, I'm Joe.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$a, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Hero, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, { "front-matters": _ctx.frontMatters }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { notes: _ctx.notes }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Hero),
              createVNode(_sfc_main$5),
              createVNode(_sfc_main$6, { "front-matters": _ctx.frontMatters }, null, 8, ["front-matters"]),
              createVNode(_sfc_main$1, { notes: _ctx.notes }, null, 8, ["notes"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
