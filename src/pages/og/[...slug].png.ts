/* Build-time Open Graph images.
 *
 * Emits one 1200x630 PNG per page at /og/<slug>.png, where <slug> is the page's
 * pathname with the slashes kept ("/" becomes "index"). Seo.astro derives the same
 * slug from Astro.url.pathname, so a page and its card stay in sync with no per-page
 * wiring — and a new blog post gets a card automatically on the next build.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOg } from '../../lib/og/render.js';
import { STATIC_PAGES, guidePage, localPage, LOCAL_HUB_PAGE } from '../../lib/og/pages.js';
import { publishedAreas } from '../../lib/local.js';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.entries(STATIC_PAGES).map(([slug, page]) => ({
    params: { slug },
    props: { page },
  }));

  const posts = await getCollection('blog', ({ data }) => !data.draft);
  for (const post of posts) {
    paths.push({
      params: { slug: `blog/${post.id}` },
      props: { page: guidePage(post.id, post.data.title, post.data.description) },
    });
  }

  // Local guides: the hub and one card per area (drafts only in dev, like the pages).
  const areas = await publishedAreas();
  if (areas.length) paths.push({ params: { slug: 'local' }, props: { page: LOCAL_HUB_PAGE } });
  for (const a of areas) {
    paths.push({ params: { slug: `local/${a.id}` }, props: { page: localPage(a.data.name, a.data.answer) } });
  }

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg((props as any).page);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
