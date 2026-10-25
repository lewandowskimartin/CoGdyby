import { config, fields, collection } from '@keystatic/core';

// Keystatic CMS — local storage.
// The admin UI runs only during `npm run dev` (see astro.config.mjs),
// reads/writes the Markdoc files in src/content/blog, and you commit + push
// as normal. No hosted admin, no server, no extra infrastructure.
export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'Prepared at Home' },
  },
  collections: {
    blog: collection({
      label: 'Blog posts',
      path: 'src/content/blog/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true, length: { min: 1 } },
          },
          slug: {
            label: 'Slug (URL)',
            description:
              'The part of the address after /blog/. Changing it after publishing changes the post URL.',
          },
        }),
        description: fields.text({
          label: 'Description',
          description: 'Meta description / excerpt — used for SEO and the blog listing.',
          multiline: true,
          validation: { isRequired: true, length: { min: 1 } },
        }),
        pubDate: fields.date({
          label: 'Publish date',
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: 'Updated date',
          description: 'Optional — set when you meaningfully revise a published post.',
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'When on, the post is excluded from the live build.',
          defaultValue: false,
        }),
        pytania: fields.array(
          fields.object({
            pytanie: fields.text({ label: 'Pytanie', description: 'Np. „Co gdyby nie było prądu przez trzy dni?”' }),
            odpowiedz: fields.text({ label: 'Krótka odpowiedź', description: '1–2 zdania. Widać je na końcu wpisu i na stronie /co-gdyby/.', multiline: true }),
            sekcja: fields.text({ label: 'Sekcja', description: 'Dokładny tekst nagłówka ## we wpisie, do którego prowadzi pytanie.' }),
          }),
          {
            label: 'Pytania „Co gdyby…?”',
            description: 'Około 3 pytań. Wpis musi mieć tag {% cogdyby /%} pod wstępem.',
            itemLabel: (props) => props.fields.pytanie.value || 'Pytanie',
          }
        ),
        content: fields.markdoc({
          label: 'Content',
          options: {
            image: {
              directory: 'public/blog',
              publicPath: '/blog/',
            },
          },
        }),
      },
    }),
  },
});
