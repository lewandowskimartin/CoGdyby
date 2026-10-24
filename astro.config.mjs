import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { readdirSync, readFileSync } from 'node:fs';

// Blog posts are authored in Markdoc (.mdoc) so the Keystatic CMS can edit them.
// Keystatic's admin UI is React-based and is loaded ONLY during local dev
// (`npm run dev` -> http://localhost:4321/keystatic). The production build
// (`npm run build`, NODE_ENV=production) drops it entirely, so the deployed
// site stays 100% static — no server adapter, no exposed admin route.
const isProd = process.env.NODE_ENV === 'production';

// Sitemap <lastmod>: Google's change signal since it retired the sitemap ping (2023), but only
// trusted when accurate. So only blog posts get one (updatedDate, else pubDate, from frontmatter),
// plus /blog/ (date of the newest post). Other pages get none: no date beats a wrong date.
// Frontmatter is read directly because astro:content isn't available inside this config.
const BLOG_DIR = new URL('./src/content/blog/', import.meta.url);
const blogLastmod = {};
for (const file of readdirSync(BLOG_DIR).filter((f) => /\.(md|mdoc)$/.test(f))) {
  const fm = (readFileSync(new URL(file, BLOG_DIR), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/) || [])[1] || '';
  const field = (k) => (fm.match(new RegExp(`^${k}:\\s*['"]?([^'"\\n]+)`, 'm')) || [])[1]?.trim();
  if (field('draft') === 'true') continue;
  const date = new Date(field('updatedDate') || field('pubDate'));
  if (!isNaN(date)) blogLastmod[file.replace(/\.(md|mdoc)$/, '')] = date;
}
const newestPost = Object.values(blogLastmod).sort((a, b) => b - a)[0];

// TODO: set this to the real domain once purchased.
// Canonical URLs, sitemap and RSS all derive from it.
export default defineConfig({
  site: 'https://cogdyby.pl',
  // satori and @resvg/resvg-js only run in the OG image endpoint at build time.
  // @resvg/resvg-js is a native addon, so it must stay external rather than be bundled.
  vite: { ssr: { external: ['@resvg/resvg-js', 'satori'] } },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/quiz/wynik') && !page.includes('/og/'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const slug = (path.match(/^\/blog\/([^/]+)\/$/) || [])[1];
        if (slug && blogLastmod[slug]) item.lastmod = blogLastmod[slug].toISOString();
        else if (path === '/blog/' && newestPost) item.lastmod = newestPost.toISOString();
        return item;
      },
    }),
    markdoc(),
    ...(isProd ? [] : [react(), keystatic()]),
  ],
});
