import {
  defineComponent,
  computed,
  mergeProps,
  unref,
  useSSRContext,
} from 'vue';
import { f as useRuntimeConfig } from '../server.mjs';
import 'destr';
import 'devalue';
import 'defu';
import 'klona';
import {
  ssrRenderAttrs,
  ssrRenderAttr,
  ssrRenderSlot,
} from 'vue/server-renderer';
import 'ofetch';
import '#internal/nitro';
import 'hookable';
import 'unctx';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import 'ufo';
import '@vue/devtools-api';
import 'ohash';
import 'cookie-es';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'ProseH6',
  __ssrInlineRender: true,
  props: {
    id: {},
  },
  setup(__props) {
    const props = __props;
    const { headings } = useRuntimeConfig().public.mdc;
    const generate = computed(() => {
      var _a;
      return (
        props.id &&
        ((_a = headings == null ? void 0 : headings.anchorLinks) == null
          ? void 0
          : _a.h6)
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<h6${ssrRenderAttrs(mergeProps({ id: _ctx.id }, _attrs))}>`);
      if (_ctx.id && unref(generate)) {
        _push(`<a${ssrRenderAttr('href', `#${_ctx.id}`)}>`);
        ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
        _push(`</a>`);
      } else {
        ssrRenderSlot(_ctx.$slots, 'default', {}, null, _push, _parent);
      }
      _push(`</h6>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseH6.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { _sfc_main as default };
//# sourceMappingURL=ProseH6-67e9aa99.js.map
