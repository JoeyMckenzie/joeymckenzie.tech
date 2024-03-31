import { defineComponent, unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./MainLayout-CkkG4NM4.js";
import { Head } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./BlogPreviews-DvMkV7rv.js";
import "class-variance-authority";
import "radix-vue";
import "clsx";
import "tailwind-merge";
import "@vueuse/components";
import "@iconify/vue";
import "./index-WUsypswg.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    frontMatters: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Blog.</title>`);
          } else {
            return [
              createVNode("title", null, "Blog.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="py-12 sm:px-6 lg:px-8"${_scopeId}><div class="mx-auto max-w-2xl pb-12"${_scopeId}><h2 class="text-center text-4xl font-extrabold tracking-tight sm:text-4xl"${_scopeId}> Blog. </h2><p class="mx-auto mt-6 max-w-xl text-justify"${_scopeId}> I write about a lot of things, mainly languages, ecosystems, and software design. I consider my writing a journal of technologies I&#39;ve worked with at some point during my career, and I&#39;m always happy to field questions and conversations from interested readers. Feel free to <a href="mailto:joey.mckenzie.dev@gmail.com"${_scopeId}>contact me</a> about any of the writing I do here, or to simply say hello! </p></div>`);
            _push2(ssrRenderComponent(_sfc_main$2, { "front-matters": _ctx.frontMatters }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "py-12 sm:px-6 lg:px-8" }, [
                createVNode("div", { class: "mx-auto max-w-2xl pb-12" }, [
                  createVNode("h2", { class: "text-center text-4xl font-extrabold tracking-tight sm:text-4xl" }, " Blog. "),
                  createVNode("p", { class: "mx-auto mt-6 max-w-xl text-justify" }, [
                    createTextVNode(" I write about a lot of things, mainly languages, ecosystems, and software design. I consider my writing a journal of technologies I've worked with at some point during my career, and I'm always happy to field questions and conversations from interested readers. Feel free to "),
                    createVNode("a", { href: "mailto:joey.mckenzie.dev@gmail.com" }, "contact me"),
                    createTextVNode(" about any of the writing I do here, or to simply say hello! ")
                  ])
                ]),
                createVNode(_sfc_main$2, { "front-matters": _ctx.frontMatters }, null, 8, ["front-matters"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Blog/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
