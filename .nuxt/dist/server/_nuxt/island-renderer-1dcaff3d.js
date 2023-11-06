import { defineComponent, createVNode } from 'vue';
import { c as createError } from '../server.mjs';
import 'ofetch';
import '#internal/nitro';
import 'hookable';
import 'unctx';
import 'destr';
import 'devalue';
import 'defu';
import 'klona';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import 'ufo';
import '@vue/devtools-api';
import 'vue/server-renderer';
import 'ohash';
import 'cookie-es';
const components_islands = {};
const islandComponents = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: components_islands,
});
const islandRenderer = /* @__PURE__ */ defineComponent({
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const component = islandComponents[props.context.name];
    if (!component) {
      throw createError({
        statusCode: 404,
        statusMessage: `Island component not found: ${props.context.name}`,
      });
    }
    return () =>
      createVNode(component || 'span', {
        ...props.context.props,
        'nuxt-ssr-component-uid': '',
      });
  },
});
export { islandRenderer as default };
//# sourceMappingURL=island-renderer-1dcaff3d.js.map
