import shiki from '@shikijs/markdown-it';
import markdownit from 'markdown-it';

const fileContents = process.argv[2];
const md = markdownit();

md.use(
  await shiki({
    themes: {
      light: 'tokyo-night',
      dark: 'tokyo-night',
    },
  }),
);

const parsedHtml = md.render(fileContents);

console.log(parsedHtml);
