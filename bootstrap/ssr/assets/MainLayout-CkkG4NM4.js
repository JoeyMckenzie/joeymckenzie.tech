import { defineComponent, unref, mergeProps, withCtx, renderSlot, useSSRContext, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, computed } from "vue";
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { cva } from "class-variance-authority";
import { Primitive } from "radix-vue";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Link, usePage } from "@inertiajs/vue3";
import { UseDark } from "@vueuse/components";
import { Icon } from "@iconify/vue";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    variant: {},
    size: {},
    as: { default: "button" },
    class: {},
    asChild: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: _ctx.as,
        "as-child": _ctx.asChild,
        class: unref(cn)(unref(buttonVariants)({ variant: _ctx.variant, size: _ctx.size }), props.class)
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
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ui/button/Button.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "ThemeToggle",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(UseDark), _attrs, {
        default: withCtx(({ isDark, toggleDark }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$9), {
              variant: "ghost",
              onClick: ($event) => toggleDark()
            }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (isDark) {
                    _push3(ssrRenderComponent(unref(Icon), {
                      class: "h-6 w-6",
                      icon: "solar:sun-fog-bold"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(unref(Icon), {
                      class: "h-6 w-6",
                      icon: "solar:moon-fog-bold"
                    }, null, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    isDark ? (openBlock(), createBlock(unref(Icon), {
                      key: 0,
                      class: "h-6 w-6",
                      icon: "solar:sun-fog-bold"
                    })) : (openBlock(), createBlock(unref(Icon), {
                      key: 1,
                      class: "h-6 w-6",
                      icon: "solar:moon-fog-bold"
                    }))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$9), {
                variant: "ghost",
                onClick: ($event) => toggleDark()
              }, {
                default: withCtx(() => [
                  isDark ? (openBlock(), createBlock(unref(Icon), {
                    key: 0,
                    class: "h-6 w-6",
                    icon: "solar:sun-fog-bold"
                  })) : (openBlock(), createBlock(unref(Icon), {
                    key: 1,
                    class: "h-6 w-6",
                    icon: "solar:moon-fog-bold"
                  }))
                ]),
                _: 2
              }, 1032, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/ThemeToggle.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const links = [
      {
        to: "home",
        display: "Home"
      },
      {
        to: "now",
        display: "Now"
      },
      {
        to: "blog",
        display: "Blog"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "flex flex-row items-center justify-center gap-x-2 px-6 pt-8" }, _attrs))}><!--[-->`);
      ssrRenderList(links, (link) => {
        _push(ssrRenderComponent(unref(Link), {
          key: link.to,
          href: _ctx.route(link.to)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$9), { variant: "outline" }, {
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
            } else {
              return [
                createVNode(unref(_sfc_main$9), { variant: "outline" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(link.display), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_sfc_main$8, null, null, _parent));
      _push(`</nav>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Navbar.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "SocialIcons",
  __ssrInlineRender: true,
  setup(__props) {
    const socials = [
      {
        href: "https://twitter.com/_joeyMcKenzie",
        display: "Twitter",
        icon: "mdi:twitter"
      },
      {
        href: "https://github.com/JoeyMcKenzie",
        display: "GitHub",
        icon: "mdi:github"
      },
      {
        href: "https://www.youtube.com/channel/UCkdpN-mQSyJ_2XJMU1kQ5fA#",
        display: "YouTube",
        icon: "mdi:youtube"
      },
      {
        href: "https://twitch.tv/JoeTheDevMan",
        display: "Twitch",
        icon: "mdi:twitch"
      },
      {
        href: "https://linkedin.com/in/JoeyMcKenzie",
        display: "LinkedIn",
        icon: "mdi:linkedin"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-center space-x-4" }, _attrs))}><!--[-->`);
      ssrRenderList(socials, (social) => {
        _push(`<a${ssrRenderAttr("href", social.href)}><span class="sr-only">${ssrInterpolate(social.display)}</span>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: social.icon,
          class: "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        }, null, _parent));
        _push(`</a>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SocialIcons.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "PoweredBy",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const commitSha = computed(() => page.props.commit);
    const commitShaForDisplay = commitSha.value.substring(0, 6);
    const commitUrl = `https://github.com/JoeyMckenzie/joey-mckenzie-tech/commit/${commitSha.value.substring(0, 6)}`;
    const poweredBy = [
      {
        display: "Laravel",
        href: "https://laravel.com",
        icon: "logos:laravel"
      },
      {
        display: "Vue.js",
        href: "https://vuejs.org",
        icon: "logos:vue"
      },
      {
        display: "Inertia.js",
        href: "https://inertiajs.com/",
        icon: "simple-icons:inertia"
      },
      {
        display: "Fly.io",
        href: "https://fly.io",
        icon: "logos:fly-icon"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto inline-flex flex-row items-center gap-x-2 md:mx-0" }, _attrs))}><p class="font-ubuntu text-center text-xs leading-5">Powered by</p><!--[-->`);
      ssrRenderList(poweredBy, (provider) => {
        _push(`<a${ssrRenderAttr("href", provider.href)}><span class="sr-only">${ssrInterpolate(provider.display)}</span>`);
        _push(ssrRenderComponent(unref(Icon), {
          icon: provider.icon,
          class: "h-5 w-5 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        }, null, _parent));
        _push(`</a>`);
      });
      _push(`<!--]--><a${ssrRenderAttr("href", commitUrl)} class="font-ubuntu text-center text-xs leading-5 hover:underline">${ssrInterpolate(unref(commitShaForDisplay))}</a></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PoweredBy.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "SpotifyCurrenlyPlaying",
  __ssrInlineRender: true,
  props: {
    nowPlaying: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: _ctx.nowPlaying.href,
        class: "flex flex-col space-y-1",
        rel: "noreferrer",
        target: "_blank"
      }, _attrs))}><h2 class="font-ubuntu inline-flex justify-center text-xs"> Now listening </h2><div class="flex flex-row items-center justify-center space-x-2">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<img${ssrRenderAttr("src", _ctx.nowPlaying.albumImageSrc)} alt="Spotify listening to" class="rounded-sm" height="30" width="30"><div class="flex max-w-[16rem] flex-col"><h4 class="line-clamp-1 overflow-hidden text-ellipsis text-xs font-semibold">${ssrInterpolate(_ctx.nowPlaying.trackTitle)}</h4><p class="text-xs">${ssrInterpolate(_ctx.nowPlaying.artist)}</p></div></div></a>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SpotifyCurrenlyPlaying.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col space-y-1" }, _attrs))}><div class="flex flex-row items-center justify-center space-x-2">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<div class="flex flex-col"><h4 class="text-xs text-neutral-500"> Not currently listening </h4></div></div></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SpotifyNotCurrentlyPlaying.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const SpotifyNotCurrentlyPlaying = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SpotifyTracker",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const nowPlaying = computed(() => page.props.spotify);
    return (_ctx, _push, _parent, _attrs) => {
      if (nowPlaying.value.nowPlaying) {
        _push(ssrRenderComponent(_sfc_main$4, mergeProps({ "now-playing": nowPlaying.value }, _attrs), {
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
      } else {
        _push(ssrRenderComponent(SpotifyNotCurrentlyPlaying, _attrs, {
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
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/SpotifyTracker.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-screen-4xl mx-auto mt-auto flex w-full flex-col items-center justify-evenly gap-y-8 p-12 sm:flex-row sm:items-end" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$6, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Icon), {
              class: "h-6 w-6 text-green-500",
              icon: "logos:spotify-icon"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Icon), {
                class: "h-6 w-6 text-green-500",
                icon: "logos:spotify-icon"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MainLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$7, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/MainLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  _sfc_main$9 as a,
  _export_sfc as b,
  cn as c
};
