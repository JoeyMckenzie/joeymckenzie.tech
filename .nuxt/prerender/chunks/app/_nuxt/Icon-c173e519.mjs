import { p as useNuxtApp } from '../server.mjs';
import { useSSRContext, defineComponent, ref, computed, watch, withAsyncContext, mergeProps, unref, createVNode, resolveDynamicComponent } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue/index.mjs';
import { u as useState } from './state-458c4d4e.mjs';
import { u as useAppConfig } from './config-56f13f92.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderVNode, ssrRenderSlot, ssrInterpolate } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue/server-renderer/index.mjs';
import { Icon } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/@iconify/vue/dist/offline.mjs';
import { loadIcon } from 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/@iconify/vue/dist/iconify.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-cc2b3d55.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ofetch/dist/node.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/hookable/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unctx/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/destr/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/defu/dist/defu.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unhead/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/@unhead/shared/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/h3/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ufo/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ohash/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/cookie-es/dist/index.mjs';
import '../../nitro/nitro-prerenderer.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/scule/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/klona/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/fs.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/memory.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/pathe/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/shikiji/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unified/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/mdast-util-to-string/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unist-util-stringify-position/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-character/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-chunked/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-resolve-all/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/micromark-util-sanitize-uri/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/slugify/slugify.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-parse/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-rehype/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-mdc/dist/index.mjs';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/hast-util-to-string/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/github-slugger/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/detab/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-emoji/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/remark-gfm/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-external-links/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-sort-attribute-values/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-sort-attributes/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/rehype-raw/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/unist-util-visit/index.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/feed/lib/feed.js';
import 'file:///Users/jmckenzie/projects/web/joey-mckenzie-tech/node_modules/ipx/dist/index.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: ""
    }
  },
  async setup(__props) {
    let __temp, __restore;
    const nuxtApp = useNuxtApp();
    const appConfig = useAppConfig();
    const props = __props;
    const state = useState("icons", () => ({}));
    const isFetching = ref(false);
    const iconName = computed(() => {
      var _a;
      return ((((_a = appConfig.nuxtIcon) == null ? void 0 : _a.aliases) || {})[props.name] || props.name).replace(/^i-/, "");
    });
    const icon = computed(() => {
      var _a;
      return (_a = state.value) == null ? void 0 : _a[iconName.value];
    });
    const component = computed(() => nuxtApp.vueApp.component(iconName.value));
    const sSize = computed(() => {
      var _a, _b, _c;
      if (!props.size && typeof ((_a = appConfig.nuxtIcon) == null ? void 0 : _a.size) === "boolean" && !((_b = appConfig.nuxtIcon) == null ? void 0 : _b.size)) {
        return void 0;
      }
      const size = props.size || ((_c = appConfig.nuxtIcon) == null ? void 0 : _c.size) || "1em";
      if (String(Number(size)) === size) {
        return `${size}px`;
      }
      return size;
    });
    const className = computed(() => {
      var _a2;
      var _a;
      return (_a2 = (_a = appConfig == null ? void 0 : appConfig.nuxtIcon) == null ? void 0 : _a.class) != null ? _a2 : "icon";
    });
    async function loadIconComponent() {
      var _a;
      if (component.value) {
        return;
      }
      if (!((_a = state.value) == null ? void 0 : _a[iconName.value])) {
        isFetching.value = true;
        state.value[iconName.value] = await loadIcon(iconName.value).catch(() => void 0);
        isFetching.value = false;
      }
    }
    watch(() => iconName.value, loadIconComponent);
    !component.value && ([__temp, __restore] = withAsyncContext(() => loadIconComponent()), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      if (isFetching.value) {
        _push(`<span${ssrRenderAttrs(mergeProps({
          class: className.value,
          style: { width: sSize.value, height: sSize.value }
        }, _attrs))} data-v-9c34c54e></span>`);
      } else if (icon.value) {
        _push(ssrRenderComponent(unref(Icon), mergeProps({
          icon: icon.value,
          class: className.value,
          width: sSize.value,
          height: sSize.value
        }, _attrs), null, _parent));
      } else if (component.value) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(component.value), mergeProps({
          class: className.value,
          width: sSize.value,
          height: sSize.value
        }, _attrs), null), _parent);
      } else {
        _push(`<span${ssrRenderAttrs(mergeProps({
          class: className.value,
          style: { fontSize: sSize.value, lineHeight: sSize.value, width: sSize.value, height: sSize.value }
        }, _attrs))} data-v-9c34c54e>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, () => {
          _push(`${ssrInterpolate(__props.name)}`);
        }, _push, _parent);
        _push(`</span>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt-icon/dist/runtime/Icon.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9c34c54e"]]);

export { __nuxt_component_2 as default };
//# sourceMappingURL=Icon-c173e519.mjs.map
