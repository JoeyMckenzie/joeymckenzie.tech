import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import 'hookable';
import 'destr';
import 'devalue';
import 'defu';
import { u as useAppConfig } from './config-56f13f92.js';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.js';
import 'klona';
import '../server.mjs';
import 'ofetch';
import '#internal/nitro';
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
  __name: 'IconCSS',
  __ssrInlineRender: true,
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '',
    },
  },
  setup(__props) {
    const appConfig = useAppConfig();
    const props = __props;
    const iconName = computed(() => {
      var _a;
      return (
        (((_a = appConfig.nuxtIcon) == null ? void 0 : _a.aliases) || {})[
          props.name
        ] || props.name
      ).replace(/^i-/, '');
    });
    const iconUrl = computed(
      () =>
        `url('https://api.iconify.design/${iconName.value.replace(
          ':',
          '/',
        )}.svg')`,
    );
    const sSize = computed(() => {
      var _a, _b, _c;
      if (
        !props.size &&
        typeof ((_a = appConfig.nuxtIcon) == null ? void 0 : _a.size) ===
          'boolean' &&
        !((_b = appConfig.nuxtIcon) == null ? void 0 : _b.size)
      ) {
        return void 0;
      }
      const size =
        props.size ||
        ((_c = appConfig.nuxtIcon) == null ? void 0 : _c.size) ||
        '1em';
      if (String(Number(size)) === size) {
        return `${size}px`;
      }
      return size;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _cssVars = {
        style: {
          '--17e81e26': iconUrl.value,
        },
      };
      _push(
        `<span${ssrRenderAttrs(
          mergeProps(
            {
              style: { width: sSize.value, height: sSize.value },
            },
            _attrs,
            _cssVars,
          ),
        )} data-v-2717c442></span>`,
      );
    };
  },
});
const IconCSS_vue_vue_type_style_index_0_scoped_2717c442_lang = '';
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'node_modules/nuxt-icon/dist/runtime/IconCSS.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const IconCSS = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['__scopeId', 'data-v-2717c442'],
]);
export { IconCSS as default };
//# sourceMappingURL=IconCSS-f65c0bc7.js.map
