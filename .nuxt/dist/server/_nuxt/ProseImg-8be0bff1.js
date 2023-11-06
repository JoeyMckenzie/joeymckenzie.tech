import { f as useRuntimeConfig } from '../server.mjs';
import {
  defineComponent,
  computed,
  mergeProps,
  unref,
  useSSRContext,
} from 'vue';
import { withLeadingSlash, withTrailingSlash, joinURL } from 'ufo';
import 'destr';
import 'devalue';
import 'defu';
import 'klona';
import { ssrRenderAttrs } from 'vue/server-renderer';
import 'ofetch';
import '#internal/nitro';
import 'hookable';
import 'unctx';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import '@vue/devtools-api';
import 'ohash';
import 'cookie-es';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'ProseImg',
  __ssrInlineRender: true,
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number],
      default: void 0,
    },
    height: {
      type: [String, Number],
      default: void 0,
    },
  },
  setup(__props) {
    const props = __props;
    const refinedSrc = computed(() => {
      var _a;
      if (
        ((_a = props.src) == null ? void 0 : _a.startsWith('/')) &&
        !props.src.startsWith('//')
      ) {
        const _base = withLeadingSlash(
          withTrailingSlash(useRuntimeConfig().app.baseURL),
        );
        if (_base !== '/' && !props.src.startsWith(_base)) {
          return joinURL(_base, props.src);
        }
      }
      return props.src;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        `<img${ssrRenderAttrs(
          mergeProps(
            {
              src: unref(refinedSrc),
              alt: __props.alt,
              width: __props.width,
              height: __props.height,
            },
            _attrs,
          ),
        )}>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'node_modules/@nuxtjs/mdc/dist/runtime/components/prose/ProseImg.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { _sfc_main as default };
//# sourceMappingURL=ProseImg-8be0bff1.js.map
