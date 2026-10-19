import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'Co gdyby — Poradniki',
    description: 'Spokojne, praktyczne planowanie domowe na sytuacje kryzysowe.',
    site: context.site,
    // WebSub: the feed names Google's public hub; `npm run indexnow` pings it after a deploy.
    // rel="self" is the feed's own URL, which the hub and subscribers need to match the ping.
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<atom:link href="${new URL('/rss.xml', context.site).href}" rel="self" type="application/rss+xml"/>`,
      '<atom:link href="https://pubsubhubbub.appspot.com/" rel="hub"/>',
    ].join(''),
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/blog/${p.id}/`,
    })),
  });
}
