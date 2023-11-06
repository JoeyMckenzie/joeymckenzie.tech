import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { useSSRContext } from 'vue';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.js';
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<p${ssrRenderAttrs(_attrs)}>`);
  ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
  _push(`</p>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseP.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProseP = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['ssrRender', _sfc_ssrRender],
]);
export { ProseP as default };
//# sourceMappingURL=ProseP-093d4e81.js.map
