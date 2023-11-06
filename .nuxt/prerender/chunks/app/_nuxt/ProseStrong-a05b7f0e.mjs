import { ssrRenderAttrs, ssrRenderSlot } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue/server-renderer/index.mjs';
import { useSSRContext } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue/index.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<strong${ssrRenderAttrs(_attrs)}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</strong>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseStrong.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProseStrong = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { ProseStrong as default };
//# sourceMappingURL=ProseStrong-a05b7f0e.mjs.map
