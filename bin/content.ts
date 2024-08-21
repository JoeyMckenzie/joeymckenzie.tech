import shiki from '@shikijs/markdown-it';
import 'dotenv/config';
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import markdownit from 'markdown-it';
import matter from 'gray-matter';
import type { FrontMatter } from '~~/types/content';
import { type DrizzleClient, createDrizzleClient } from '~~/database/client';

async function processContentFile(fileContents: string, md: markdownit, db: DrizzleClient) {
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

  // TODO: Update the rows in the db
}

function isMarkdownFile(filename: string) {
  const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkdn'];
  return markdownExtensions.includes(path.extname(filename).toLowerCase());
}

function shouldExcludeDirectory(directoryName: string) {
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
  const url = process.env.NUXT_TURSO_DATABASE_URL ?? process.exit(1);
  const authToken = process.env.NUXT_TURSO_AUTH_TOKEN ?? process.exit(1);
  const db = createDrizzleClient(authToken, url);
  for (const filePath of filePaths) {
    const contents = fs.readFileSync(filePath, 'utf8');
    await processContentFile(contents, md, db);
  }
}

async function updateContent() {
  const cwd = process.cwd();
  const contentPath = `${cwd}${path.sep}content`;
  const files = getContentFiles(contentPath);

  if (files) {
    await processContentFiles(files);
  }
}

await updateContent();
