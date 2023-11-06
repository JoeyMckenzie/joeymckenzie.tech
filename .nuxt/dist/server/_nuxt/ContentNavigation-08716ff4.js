import {
  useSSRContext,
  defineComponent,
  toRefs,
  computed,
  useSlots,
  h,
} from 'vue';
import 'hookable';
import {
  f as useRuntimeConfig,
  q as queryContent,
  w as withContentBase,
  g as encodeQueryParams,
  h as addPrerenderPath,
  s as shouldUseClientDB,
  j as jsonStringify,
  i as useContentPreview,
  k as useContentDisabled,
  l as useAsyncData,
} from '../server.mjs';
import { u as useState } from './state-458c4d4e.js';
import { hash } from 'ohash';
import 'destr';
import 'devalue';
import 'defu';
import { _ as __nuxt_component_0 } from './nuxt-link-e4ece057.js';
import 'klona';
import 'ofetch';
import '#internal/nitro';
import 'unctx';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import 'ufo';
import '@vue/devtools-api';
import 'vue/server-renderer';
import 'cookie-es';
const fetchContentNavigation = async (queryBuilder) => {
  const { content } = useRuntimeConfig().public;
  if (
    typeof (queryBuilder == null ? void 0 : queryBuilder.params) !== 'function'
  ) {
    queryBuilder = queryContent(queryBuilder);
  }
  const params = queryBuilder.params();
  const apiPath = content.experimental.stripQueryParameters
    ? withContentBase(
        `/navigation/${`${hash(params)}.${
          content.integrity
        }`}/${encodeQueryParams(params)}.json`,
      )
    : withContentBase(`/navigation/${hash(params)}.${content.integrity}.json`);
  {
    addPrerenderPath(apiPath);
  }
  if (shouldUseClientDB()) {
    const generateNavigation = await import('./client-db-c320ab0a.js').then(
      (m) => m.generateNavigation,
    );
    return generateNavigation(params);
  }
  const data = await $fetch(apiPath, {
    method: 'GET',
    responseType: 'json',
    params: content.experimental.stripQueryParameters
      ? void 0
      : {
          _params: jsonStringify(params),
          previewToken: useContentPreview().getPreviewToken(),
        },
  });
  if (typeof data === 'string' && data.startsWith('<!DOCTYPE html>')) {
    throw new Error('Not found');
  }
  return data;
};
const ContentNavigation = /* @__PURE__ */ defineComponent({
  name: 'ContentNavigation',
  props: {
    /**
     * A query to be passed to `fetchContentNavigation()`.
     */
    query: {
      type: Object,
      required: false,
      default: void 0,
    },
  },
  async setup(props) {
    const { query } = toRefs(props);
    const queryBuilder = computed(() => {
      var _a;
      if (
        typeof ((_a = query.value) == null ? void 0 : _a.params) === 'function'
      ) {
        return query.value.params();
      }
      return query.value;
    });
    if (!queryBuilder.value && useState('dd-navigation').value) {
      const { navigation: navigation2 } = useContentDisabled();
      return { navigation: navigation2 };
    }
    const { data: navigation } = await useAsyncData(
      `content-navigation-${hash(queryBuilder.value)}`,
      () => fetchContentNavigation(queryBuilder.value),
    );
    return { navigation };
  },
  /**
   * Navigation empty fallback
   * @slot empty
   */
  render(ctx) {
    const slots = useSlots();
    const { navigation } = ctx;
    const renderLink = (link) =>
      h(__nuxt_component_0, { to: link._path }, () => link.title);
    const renderLinks = (data, level) =>
      h(
        'ul',
        level ? { 'data-level': level } : null,
        data.map((link) => {
          if (link.children) {
            return h('li', null, [
              renderLink(link),
              renderLinks(link.children, level + 1),
            ]);
          }
          return h('li', null, renderLink(link));
        }),
      );
    const defaultNode = (data) => renderLinks(data, 0);
    return (slots == null ? void 0 : slots.default)
      ? slots.default({ navigation, ...this.$attrs })
      : defaultNode(navigation);
  },
});
const _sfc_main = ContentNavigation;
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'node_modules/@nuxt/content/dist/runtime/components/ContentNavigation.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { _sfc_main as default };
//# sourceMappingURL=ContentNavigation-08716ff4.js.map
