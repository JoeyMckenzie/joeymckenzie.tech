// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePrettyCode from "rehype-pretty-code";
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: process.env.NODE_ENV === "production" ? "*[!draft]/*.md" : "**/*.md",
  contentType: "markdown",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    pubDate: { type: "date", required: true },
    category: { type: "string", required: true },
    heroImage: { type: "string", required: true },
    draft: { type: "boolean", required: false, default: false },
    keywords: { type: "list", of: { type: "string" }, required: true }
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/blog/${post._raw.flattenedPath}`
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "./content",
  documentTypes: [Post],
  markdown: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "github-dark"
        }
      ]
    ]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-7ZJDGXRU.mjs.map
