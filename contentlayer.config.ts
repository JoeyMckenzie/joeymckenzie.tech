import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeShikiji from "rehype-shikiji";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "**/*.md",
  contentType: "markdown",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    pubDate: { type: "date", required: true },
    category: { type: "string", required: true },
    heroImage: { type: "string", required: true },
    draft: { type: "boolean", required: false, default: false },
    keywords: { type: "list", of: { type: "string" }, required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/blog/${post._raw.sourceFileName.split(".")[0]}`,
    },
    slug: {
      type: "string",
      resolve: (post) => post._raw.sourceFileName.split(".")[0],
    },
  },
}));

export default makeSource({
  contentDirPath: "./content",
  contentDirExclude: process.env.NODE_ENV === "production" ? ["draft"] : [],
  documentTypes: [Post],
  markdown: {
    rehypePlugins: [
      [
        // @ts-expect-error plugin is properly typed, not sure why contentlayer takes issue with this
        rehypeShikiji,
        {
          theme: "one-dark-pro",
        },
      ],
    ],
  },
});
