import { defineMarkdocConfig, component, nodes } from '@astrojs/markdoc/config';

// Blog posts are Markdoc, so rehype plugins don't apply. Two customisations:
//
// 1. The built-in `link` node renders through MarkdocLink.astro, which sets
//    target/rel per link: external links open in a new tab with safe rel
//    values, and Amazon links additionally get rel="sponsored nofollow".
//
// 2. The `alink` tag renders an affiliate link from a central id, e.g.
//    {% alink id="torch" %}A basic LED torch{% /alink %}
//    The URLs live in src/data/affiliateLinks.js — swap a Wish List for an
//    Idea List there once and every post updates.
export default defineMarkdocConfig({
  nodes: {
    link: {
      ...nodes.link,
      render: component('./src/components/MarkdocLink.astro'),
    },
  },
  tags: {
    // 3. The `kitcta` tag drops the kit builder prompt into a guide, e.g.
    //    {% kitcta scenario="power-cut" /%}
    //    Which guides carry one, and whether it sits inline or at the end of the
    //    post, is decided by POST_KITS in src/data/kit.js.
    kitcta: {
      render: component('./src/components/KitCta.astro'),
      attributes: {
        scenario: { type: String, default: 'general' },
        variant: { type: String, default: 'inline' },
        location: { type: String, default: 'guide-inline' },
        title: { type: String },
        text: { type: String },
        cta: { type: String },
      },
    },
    alink: {
      render: component('./src/components/AffiliateLink.astro'),
      attributes: {
        id: { type: String, required: true },
      },
      children: ['text', 'strong', 'em', 'code', 's'],
    },
  },
});
