import { _ as _sfc_main$1 } from './HtmlTag-1d571bc3.js';
import {
  defineComponent,
  mergeProps,
  withCtx,
  createVNode,
  toDisplayString,
  useSSRContext,
} from 'vue';
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrInterpolate,
} from 'vue/server-renderer';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'SectionHeader',
  __ssrInlineRender: true,
  props: {
    title: {},
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HtmlTag = _sfc_main$1;
      _push(
        `<span${ssrRenderAttrs(
          mergeProps(
            {
              class:
                'flex flex-row items-center space-x-0 text-neutral-400 sm:justify-center sm:space-x-2',
            },
            _attrs,
          ),
        )}>`,
      );
      _push(
        ssrRenderComponent(
          _component_HtmlTag,
          {
            'additional-classes': 'hidden sm:block text-xl',
            'tag-name': 'page',
          },
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(
                  `<h2 class="font-mono text-2xl font-semibold tracking-tight text-neutral-400 sm:text-3xl"${_scopeId}>${ssrInterpolate(
                    _ctx.title,
                  )}</h2>`,
                );
              } else {
                return [
                  createVNode(
                    'h2',
                    {
                      class:
                        'font-mono text-2xl font-semibold tracking-tight text-neutral-400 sm:text-3xl',
                    },
                    toDisplayString(_ctx.title),
                    1,
                  ),
                ];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</span>`);
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'components/SectionHeader.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { _sfc_main as _ };
//# sourceMappingURL=SectionHeader-2f2bda11.js.map
