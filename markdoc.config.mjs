import { defineMarkdocConfig, component, nodes } from '@astrojs/markdoc/config';

// Blog posts are Markdoc, so rehype plugins don't apply. Two customisations:
//
// 1. The built-in `link` node renders through MarkdocLink.astro, which sets
//    target/rel per link: external links open in a new tab with safe rel
//    values. (No affiliate links on cogdyby.pl.)
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
    // 4. The `cogdyby` tag places the "Co gdyby…?" box right under a guide's intro:
    //    {% cogdyby /%}
    //    Questions come from the post's `pytania` field (see src/lib/pytania.js).
    cogdyby: {
      render: component('./src/components/CoGdybyBox.astro'),
    },
  },
});
