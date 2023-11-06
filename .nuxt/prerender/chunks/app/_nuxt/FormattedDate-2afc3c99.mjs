import { defineComponent, mergeProps, useSSRContext } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue/server-renderer/index.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormattedDate",
  __ssrInlineRender: true,
  props: {
    date: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<time${ssrRenderAttrs(mergeProps({
        datetime: _ctx.date.toISOString(),
        class: "text-neutral-400"
      }, _attrs))}>${ssrInterpolate(_ctx.date.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }))}</time>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FormattedDate.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=FormattedDate-2afc3c99.mjs.map
