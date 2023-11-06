import { _ as __nuxt_component_0 } from './nuxt-link-e4ece057.js';
import {
  defineComponent,
  mergeProps,
  withCtx,
  renderSlot,
  useSSRContext,
} from 'vue';
import { ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import 'ufo';
import 'hookable';
import '../server.mjs';
import 'ofetch';
import '#internal/nitro';
import 'unctx';
import 'destr';
import 'devalue';
import 'defu';
import 'klona';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import '@vue/devtools-api';
import 'ohash';
import 'cookie-es';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'ProseA',
  __ssrInlineRender: true,
  props: {
    href: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: void 0,
      required: false,
    },
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(
        ssrRenderComponent(
          _component_NuxtLink,
          mergeProps(
            {
              href: __props.href,
              target: __props.target,
            },
            _attrs,
          ),
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(
                  _ctx.$slots,
                  'default',
                  {},
                  null,
                  _push2,
                  _parent2,
                  _scopeId,
                );
              } else {
                return [renderSlot(_ctx.$slots, 'default')];
              }
            }),
            _: 3,
          },
          _parent,
        ),
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseA.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { _sfc_main as default };
//# sourceMappingURL=ProseA-8f28d0c6.js.map
