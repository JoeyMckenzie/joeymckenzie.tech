import shiki from '@shikijs/markdown-it';
import 'dotenv/config';
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import markdownit from 'markdown-it';
import matter from 'gray-matter';

/**
 * @typedef {object} FrontMatter
 * @property {string} title how the person is called
 * @property {string} description how the person is called
 * @property {string} pubDate how the person is called
 * @property {string} heroImage how the person is called
 * @property {string} category how the person is called
 * @property {string[]} keywords how the person is called
 * @param {string} parsedHtml
 * @param {FrontMatter} frontMatter
 */
async function updateBlogPost(parsedHtml, frontMatter) {

}

/**
 * @param {string} fileContents
 * @param {markdownit} md
 */
async function processContentFile(fileContents, md) {
  md.use(
    await shiki({
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    }),
  );

  const file = matter(fileContents);
  const parsedHtml = md.render(file.content);
  const frontMatter = file.data;
}

/**
 * @param {string} filename
 * @returns boolean
 */
function isMarkdownFile(filename) {
  const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkdn'];
  return markdownExtensions.includes(path.extname(filename).toLowerCase());
}

/**
 *
 * @param {string} directoryName
 * @returns boolean
 */
function shouldExcludeDirectory(directoryName) {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction && directoryName.toLowerCase() === 'draft';
}

function getContentFiles(directoryPath: string, filePaths = [] as string[]) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      if (shouldExcludeDirectory(file)) {
        return;
      }

      getContentFiles(filePath, filePaths);
    }
    else if (isMarkdownFile(file)) {
      filePaths.push(filePath);
    }
  }

  return filePaths;
}

async function processContentFiles(filePaths: string[]) {
  const md = markdownit();
  for (const filePath of filePaths) {
    const contents = fs.readFileSync(filePath, 'utf8');
    await processContentFile(contents, md);
  }
}

const cwd = process.cwd();
const contentPath = `${cwd}${path.sep}content`;
const files = getContentFiles(contentPath);
await processContentFiles(files);
