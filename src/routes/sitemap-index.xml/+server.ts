import { dev } from '$app/environment';
import { allPosts } from 'contentlayer/generated';

export async function GET() {
  const baseUrl = dev ? 'http://localhost:5173' : 'https://joeymckenzie.tech';
  const pageRoutes = ['/', '/about', '/blog'].map((r) => `${baseUrl}${r}`);
  const blogRoutes = allPosts.map((p) => `${baseUrl}${p.url}`);
  const allRoutesUrls = [...pageRoutes, ...blogRoutes].map((r) =>
    `<url>
        <loc>${r}</loc>
      </url>`.trim(),
  );

  console.log(allRoutesUrls);

  return new Response(
    `
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
			${allRoutesUrls.join('')}
		</urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  );
}
