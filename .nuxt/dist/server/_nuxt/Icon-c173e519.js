import { p as useNuxtApp } from '../server.mjs';
import {
  defineComponent,
  ref,
  computed,
  watch,
  withAsyncContext,
  mergeProps,
  unref,
  createVNode,
  resolveDynamicComponent,
  useSSRContext,
} from 'vue';
import { u as useState } from './state-458c4d4e.js';
import 'destr';
import 'devalue';
import 'defu';
import { u as useAppConfig } from './config-56f13f92.js';
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderVNode,
  ssrRenderSlot,
  ssrInterpolate,
} from 'vue/server-renderer';
import { Icon } from '@iconify/vue/dist/offline';
import { loadIcon } from '@iconify/vue';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.js';
import 'ofetch';
import '#internal/nitro';
import 'hookable';
import 'unctx';
import 'klona';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import 'ufo';
import '@vue/devtools-api';
import 'ohash';
import 'cookie-es';
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: 'Icon',
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
  async setup(__props) {
    let __temp, __restore;
    const nuxtApp = useNuxtApp();
    const appConfig = useAppConfig();
    const props = __props;
    const state = useState('icons', () => ({}));
    const isFetching = ref(false);
    const iconName = computed(() => {
      var _a;
      return (
        (((_a = appConfig.nuxtIcon) == null ? void 0 : _a.aliases) || {})[
          props.name
        ] || props.name
      ).replace(/^i-/, '');
    });
    const icon = computed(() => {
      var _a;
      return (_a = state.value) == null ? void 0 : _a[iconName.value];
    });
    const component = computed(() => nuxtApp.vueApp.component(iconName.value));
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
    const className = computed(() => {
      var _a;
      return (
        ((_a = appConfig == null ? void 0 : appConfig.nuxtIcon) == null
          ? void 0
          : _a.class) ?? 'icon'
      );
    });
    async function loadIconComponent() {
      var _a;
      if (component.value) {
        return;
      }
      if (!((_a = state.value) == null ? void 0 : _a[iconName.value])) {
        isFetching.value = true;
        state.value[iconName.value] = await loadIcon(iconName.value).catch(
          () => void 0,
        );
        isFetching.value = false;
      }
    }
    watch(() => iconName.value, loadIconComponent);
    !component.value &&
      (([__temp, __restore] = withAsyncContext(() => loadIconComponent())),
      (__temp = await __temp),
      __restore(),
      __temp);
    return (_ctx, _push, _parent, _attrs) => {
      if (isFetching.value) {
        _push(
          `<span${ssrRenderAttrs(
            mergeProps(
              {
                class: className.value,
                style: { width: sSize.value, height: sSize.value },
              },
              _attrs,
            ),
          )} data-v-9c34c54e></span>`,
        );
      } else if (icon.value) {
        _push(
          ssrRenderComponent(
            unref(Icon),
            mergeProps(
              {
                icon: icon.value,
                class: className.value,
                width: sSize.value,
                height: sSize.value,
              },
              _attrs,
            ),
            null,
            _parent,
          ),
        );
      } else if (component.value) {
        ssrRenderVNode(
          _push,
          createVNode(
            resolveDynamicComponent(component.value),
            mergeProps(
              {
                class: className.value,
                width: sSize.value,
                height: sSize.value,
              },
              _attrs,
            ),
            null,
          ),
          _parent,
        );
      } else {
        _push(
          `<span${ssrRenderAttrs(
            mergeProps(
              {
                class: className.value,
                style: {
                  fontSize: sSize.value,
                  lineHeight: sSize.value,
                  width: sSize.value,
                  height: sSize.value,
                },
              },
              _attrs,
            ),
          )} data-v-9c34c54e>`,
        );
        ssrRenderSlot(
          _ctx.$slots,
          'default',
          {},
          () => {
            _push(`${ssrInterpolate(__props.name)}`);
          },
          _push,
          _parent,
        );
        _push(`</span>`);
      }
    };
  },
});
const Icon_vue_vue_type_style_index_0_scoped_9c34c54e_lang = '';
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'node_modules/nuxt-icon/dist/runtime/Icon.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [
  ['__scopeId', 'data-v-9c34c54e'],
]);
export { __nuxt_component_2 as default };
//# sourceMappingURL=Icon-c173e519.js.map
