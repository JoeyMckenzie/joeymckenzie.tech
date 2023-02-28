import { defineDocumentType, makeSource } from 'contentlayer/source-files';

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the blog post',
      required: true,
    },
    summary: {
      type: 'string',
      description: 'A short description of the blog post',
      required: true,
    },
    category: {
      type: 'string',
      description: 'A one word description of the blog post',
      required: true,
    },
    image: {
      type: 'image',
      description: 'A header image for the blog post',
      required: false,
    },
    date: {
      type: 'date',
      description: 'The date of the blog post',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog],
});
