import {
  b as useRoute,
  u as useHead,
  f as useRuntimeConfig,
} from '../server.mjs';
import { unref, watch, useSSRContext, defineComponent, useSlots, h } from 'vue';
import 'destr';
import {
  joinURL,
  withTrailingSlash,
  withoutTrailingSlash,
  hasProtocol,
} from 'ufo';
import 'devalue';
import 'defu';
import 'klona';
import _sfc_main$2 from './ContentRenderer-16736ec0.js';
import _sfc_main$1 from './ContentQuery-2a62b439.js';
import 'ofetch';
import '#internal/nitro';
import 'hookable';
import 'unctx';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
import '@vue/devtools-api';
import 'vue/server-renderer';
import 'ohash';
import 'cookie-es';
import './ContentRendererMarkdown-6b4feeaa.js';
import 'scule';
import 'property-information';
const useContentHead = (_content, to = useRoute()) => {
  const content = unref(_content);
  const config = /* @__PURE__ */ useRuntimeConfig();
  const refreshHead = (data = content) => {
    if (!to.path || !data) {
      return;
    }
    const head = Object.assign({}, (data == null ? void 0 : data.head) || {});
    head.meta = [...(head.meta || [])];
    head.link = [...(head.link || [])];
    const title = head.title || (data == null ? void 0 : data.title);
    if (title) {
      head.title = title;
      if (!head.meta.some((m) => m.property === 'og:title')) {
        head.meta.push({
          property: 'og:title',
          content: title,
        });
      }
    }
    const host = config.public.content.host;
    if (host) {
      const _url = joinURL(host ?? '/', config.app.baseURL, to.fullPath);
      const url = config.public.content.trailingSlash
        ? withTrailingSlash(_url)
        : withoutTrailingSlash(_url);
      if (!head.meta.some((m) => m.property === 'og:url')) {
        head.meta.push({
          property: 'og:url',
          content: url,
        });
      }
      if (!head.link.some((m) => m.rel === 'canonical')) {
        head.link.push({
          rel: 'canonical',
          href: url,
        });
      }
    }
    const description =
      (head == null ? void 0 : head.description) ||
      (data == null ? void 0 : data.description);
    if (
      description &&
      head.meta.filter((m) => m.name === 'description').length === 0
    ) {
      head.meta.push({
        name: 'description',
        content: description,
      });
    }
    if (
      description &&
      !head.meta.some((m) => m.property === 'og:description')
    ) {
      head.meta.push({
        property: 'og:description',
        content: description,
      });
    }
    const image =
      (head == null ? void 0 : head.image) ||
      (data == null ? void 0 : data.image);
    if (
      image &&
      head.meta.filter((m) => m.property === 'og:image').length === 0
    ) {
      if (typeof image === 'string') {
        head.meta.push({
          property: 'og:image',
          // @ts-ignore - We expect `head.image` from Nuxt configurations...
          content:
            host && !hasProtocol(image)
              ? new URL(joinURL(config.app.baseURL, image), host).href
              : image,
        });
      }
      if (typeof image === 'object') {
        const imageKeys = [
          'src',
          'secure_url',
          'type',
          'width',
          'height',
          'alt',
        ];
        for (const key of imageKeys) {
          if (key === 'src' && image.src) {
            const isAbsoluteURL = hasProtocol(image.src);
            const imageURL = isAbsoluteURL
              ? image.src
              : joinURL(config.app.baseURL, image.src ?? '/');
            head.meta.push({
              property: 'og:image',
              content:
                host && !isAbsoluteURL
                  ? new URL(imageURL, host).href
                  : imageURL,
            });
          } else if (image[key]) {
            head.meta.push({
              property: `og:image:${key}`,
              content: image[key],
            });
          }
        }
      }
    }
    {
      useHead(head);
    }
  };
  watch(() => unref(_content), refreshHead, { immediate: true });
};
const ContentDoc = /* @__PURE__ */ defineComponent({
  name: 'ContentDoc',
  props: {
    /**
     * Renderer props
     */
    /**
     * The tag to use for the renderer element if it is used.
     * @default 'div'
     */
    tag: {
      type: String,
      required: false,
      default: 'div',
    },
    /**
     * Whether or not to render the excerpt.
     * @default false
     */
    excerpt: {
      type: Boolean,
      default: false,
    },
    /**
     * Query props
     */
    /**
     * The path of the content to load from content source.
     * @default useRoute().path
     */
    path: {
      type: String,
      required: false,
      default: void 0,
    },
    /**
     * A query builder params object to be passed to <ContentQuery /> component.
     */
    query: {
      type: Object,
      required: false,
      default: void 0,
    },
    /**
     * Whether or not to map the document data to the `head` property.
     */
    head: {
      type: Boolean,
      required: false,
      default: void 0,
    },
  },
  /**
   * Document empty fallback
   * @slot empty
   */
  /**
   * Document not found fallback
   * @slot not-found
   */
  render(ctx) {
    const { contentHead } = useRuntimeConfig().public.content;
    const slots = useSlots();
    const { tag, excerpt, path, query, head } = ctx;
    const shouldInjectContentHead = head === void 0 ? contentHead : head;
    const contentQueryProps = {
      ...(query || {}),
      path:
        path ||
        (query == null ? void 0 : query.path) ||
        withTrailingSlash(useRoute().path),
      find: 'one',
    };
    const emptyNode = (slot, data) =>
      h(
        'pre',
        null,
        JSON.stringify(
          { message: 'You should use slots with <ContentDoc>', slot, data },
          null,
          2,
        ),
      );
    return h(_sfc_main$1, contentQueryProps, {
      // Default slot
      default: (slots == null ? void 0 : slots.default)
        ? ({ data, refresh, isPartial }) => {
            var _a;
            if (shouldInjectContentHead) {
              useContentHead(data);
            }
            return (_a = slots.default) == null
              ? void 0
              : _a.call(slots, {
                  doc: data,
                  refresh,
                  isPartial,
                  excerpt,
                  ...this.$attrs,
                });
          }
        : ({ data }) => {
            if (shouldInjectContentHead) {
              useContentHead(data);
            }
            return h(
              _sfc_main$2,
              { value: data, excerpt, tag, ...this.$attrs },
              // Forward local `empty` slots to ContentRenderer if it is used.
              {
                empty: (bindings) =>
                  (slots == null ? void 0 : slots.empty)
                    ? slots.empty(bindings)
                    : emptyNode('default', data),
              },
            );
          },
      // Empty slot
      empty: (bindings) => {
        var _a;
        return (
          ((_a = slots == null ? void 0 : slots.empty) == null
            ? void 0
            : _a.call(slots, bindings)) ||
          h(
            'p',
            null,
            'Document is empty, overwrite this content with #empty slot in <ContentDoc>.',
          )
        );
      },
      // Not Found slot
      'not-found': (bindings) => {
        var _a;
        return (
          ((_a = slots == null ? void 0 : slots['not-found']) == null
            ? void 0
            : _a.call(slots, bindings)) ||
          h(
            'p',
            null,
            'Document not found, overwrite this content with #not-found slot in <ContentDoc>.',
          )
        );
      },
    });
  },
});
const _sfc_main = ContentDoc;
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    'node_modules/@nuxt/content/dist/runtime/components/ContentDoc.vue',
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export { _sfc_main as default };
//# sourceMappingURL=ContentDoc-07657129.js.map
