import shiki from '@shikijs/markdown-it';
import 'dotenv/config';
import markdownit from 'markdown-it';

const fileContents = process.argv[2];
const md = markdownit();

md.use(
  await shiki({
    themes: {
      light: process.env.SHIKI_LIGHT_THEME,
      dark: process.env.SHIKI_DARK_THEME,
    },
  }),
);

const parsedHtml = md.render(fileContents);

console.log(parsedHtml);
