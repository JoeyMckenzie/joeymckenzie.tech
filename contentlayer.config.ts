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
    keywords: {
      type: 'list',
      of: { type: 'string' },
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath.split('/')[1]}`,
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.split('/')[1],
    },
    draft: {
      type: 'boolean',
      resolve: (post) => post._raw.sourceFileDir === 'draft',
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
          theme: 'one-dark-pro',
        },
      ],
    ],
  },
});
