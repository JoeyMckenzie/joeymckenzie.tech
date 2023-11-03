import { defineComponent, computed, unref, useSSRContext } from 'vue';
import { ssrRenderClass, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const defaultClasses = "text-neutral-400 font-mono";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HtmlTag",
  __ssrInlineRender: true,
  props: {
    tagName: {},
    additionalClasses: {}
  },
  setup(__props) {
    const props = __props;
    const classes = computed(
      () => props.additionalClasses ? `${defaultClasses} ${props.additionalClasses}` : defaultClasses
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><span class="${ssrRenderClass(unref(classes))}">&lt;${ssrInterpolate(_ctx.tagName)}&gt;</span>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<span class="${ssrRenderClass(unref(classes))}">&lt;/${ssrInterpolate(_ctx.tagName)}&gt;</span><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HtmlTag.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=HtmlTag-1d571bc3.mjs.map
