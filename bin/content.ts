import 'dotenv/config';
import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import markdownit from 'markdown-it';
import matter from 'gray-matter';
import { getSingletonHighlighter } from 'shiki';
import { eq } from 'drizzle-orm';
import { type DrizzleClient, createDrizzleClient } from '~~/database/client';
import { posts } from '~~/database/schema';

const highlighter = await getSingletonHighlighter({
  themes: ['vitesse-dark'],
  langs: [
    'php',
    'csharp',
    'sql',
    'zig',
    'rust',
    'hcl',
    'toml',
    'bash',
    'shell',
    'yaml',
    'go',
    'dockerfile',
    'makefile',
    'ts',
    'typescript',
    'tsx',
    'json',
    'js',
    'html',
    'xml',
  ],
});

const md = markdownit({
  highlight: (code, lang) => {
    return highlighter.codeToHtml(code, {
      lang,
      theme: 'vitesse-dark',
    });
  },
});

async function processContentFile(slug: string, fileContents: string, db: DrizzleClient) {
  const file = matter(fileContents);
  const parsedHtml = md.render(file.content);
  const frontMatter = file.data;

  // Get existing post
  const existingPost = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  const post = existingPost?.[0];

  // Update content, if exists
  if (post) {
    await db
      .update(posts)
      .set({ rawContent: file.content, parsedContent: parsedHtml })
      .where(eq(posts.id, post.id));
  }
  else {
    await db.insert(posts)
      .values({
        slug,
        category: frontMatter.category,
        description: frontMatter.description,
        heroImage: frontMatter.heroImage,
        parsedContent: parsedHtml,
        rawContent: file.content,
        title: frontMatter.title,
        publishedDate: frontMatter.pubDate,
      });
  }

  // TODO: Update keywords
}

function getContentFiles(directoryPath: string, filePaths = [] as string[]) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    const isMarkDownfile = path.extname(file).toLowerCase() === '.md';

    if (stats.isDirectory()) {
      const shouldExcludeDirectory = file.toLowerCase() === 'draft';
      if (!shouldExcludeDirectory) {
        getContentFiles(filePath, filePaths);
      }
    }
    else if (isMarkDownfile) {
      filePaths.push(filePath);
    }
  }

  return filePaths;
}

async function processContentFiles(filePaths: string[]) {
  const url = process.env.NUXT_TURSO_DATABASE_URL ?? process.exit(1);
  const authToken = process.env.NUXT_TURSO_AUTH_TOKEN ?? process.exit(1);
  const db = createDrizzleClient(authToken, url);
  for (const filePath of filePaths) {
    const contents = fs.readFileSync(filePath, 'utf8');
    const slug = path.basename(filePath).split('.')[0];
    if (slug) {
      await processContentFile(slug, contents, db);
    }
  }
}

async function updateContent() {
  const cwd = process.cwd();
  const contentPath = `${cwd}${path.sep}content`;
  const files = getContentFiles(contentPath);

  if (files) {
    await processContentFiles(files);
  }

  highlighter.dispose();
}

await updateContent();
