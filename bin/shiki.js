import { readFileSync } from 'fs';
import MarkdownIt from 'markdown-it';
import Shiki from '@shikijs/markdown-it';
import matter from 'gray-matter';

const filePath = process.argv[2];
const md = MarkdownIt();

md.use(
  await Shiki({
    themes: {
      light: 'tokyo-night',
      dark: 'tokyo-night',
    },
  }),
);

const fileData = readFileSync(filePath, { encoding: 'utf-8' });
const fileMatter = matter(fileData);
const parsedHtml = md.render(fileMatter.content);

// console.log(parsedHtml);
