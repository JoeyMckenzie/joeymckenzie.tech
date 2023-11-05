import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrettyCode from 'rehype-pretty-code';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  contentType: 'markdown',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    pubDate: { type: 'date', required: true },
    category: { type: 'string', required: true },
    heroImage: { type: 'string', required: true },
    draft: { type: 'boolean', required: false, default: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post],
  markdown: {
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'vitesse-dark',
        },
      ],
    ],
  },
});
