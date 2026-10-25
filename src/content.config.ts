import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { PLAN_STEP_IDS } from './data/local.js';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // "Co gdyby…?" questions: the box under the intro ({% cogdyby /%}), the short answers at
    // the end, FAQPage JSON-LD and the /co-gdyby/ hub. `sekcja` is the exact text of the H2
    // the question links to; the build fails if it is missing (src/lib/pytania.js).
    pytania: z
      .array(z.object({ pytanie: z.string(), odpowiedz: z.string(), sekcja: z.string() }))
      .max(5)
      .default([]),
  }),
});

// ---------------------------------------------------------------------------
// Local guides (/local/<area>/): one hand-checked YAML file per Local Resilience Forum.
// Plan: plans/2026-10-14-local-risk-pages.md and plans/2026-10-14-local-pages-automation.md
//
// Every fact carries a `source`: the page it came from, the exact words on that page, and
// the date it was checked. `npm run check:sources` confirms the words are still there, and
// the weekly "Watch sources" GitHub Action opens an issue when they are not. The build
// fails if a fact has no source, so nothing goes live unsourced.
// ---------------------------------------------------------------------------

const sourced = z
  .object({
    url: z.string().url(),
    // The exact words on the source page. A list means every phrase must be present.
    quote: z.union([z.string().min(3), z.array(z.string().min(3)).min(1)]).nullable().default(null),
    // For text that can't be extracted (e.g. a risk matrix that is only an image).
    // The checker lists these as "check by eye" on every run, so they aren't forgotten.
    manual: z.boolean().default(false),
    checked: z.coerce.date(),
    // Label in the page's source list, when the default (taken from the fact) would mislead.
    title: z.string().optional(),
  })
  .refine((s) => s.quote !== null || s.manual, {
    message: 'Every source needs a quote, or manual: true for text that cannot be extracted',
  });

// Things to watch for change, beyond the quoted facts.
const watch = z.discriminatedUnion('kind', [
  // A page that links to a PDF (usually the risk register): alert when a matching PDF
  // appears that isn't in `known`, or a known one disappears.
  z.object({
    kind: z.literal('links'),
    url: z.string().url(),
    match: z.string(),
    known: z.array(z.string().url()).default([]),
    // false: watch every matching link, not only .pdf files (London's register is served
    // from /media/<id>/download with no .pdf in the URL).
    pdf: z.boolean().default(true),
  }),
  // A GOV.UK page: alert when its "last updated" date is newer than `since`.
  z.object({ kind: z.literal('govuk'), url: z.string().url(), since: z.coerce.date() }),
  // A data.gov.uk dataset: alert when its metadata is newer than `since`.
  z.object({ kind: z.literal('ckan'), url: z.string().url(), since: z.coerce.date() }),
]);

const local = defineCollection({
  loader: glob({ pattern: '[!_]*.yaml', base: './src/content/local' }),
  schema: z
    .object({
      // Drafts render in `npm run dev` only, never in the production build (src/lib/local.js).
      draft: z.boolean().default(false),
      name: z.string(),
      // Shorter name for the <title> and social card when `name` is long ("Devon and Cornwall").
      searchName: z.string().optional(),
      // Page copy (our words): the sentence under the H1, and the meta description.
      answer: z.string(),
      description: z.string().max(160),
      lrf: z.object({ name: z.string(), url: z.string().url(), email: z.string().email().optional(), source: sourced }),
      register: z.object({
        title: z.string(),
        edition: z.string(), // as the register words it: "Reviewed 28 September 2026"
        url: z.string().url(),
        system: z.enum(['labels', 'scores', 'unrated']),
        source: sourced,
      }),
      risks: z
        .array(
          z.object({
            name: z.string(),
            rating: z.string(), // as worded: "Very high" / "Impact 5 of 5" / "Listed, not rated"
            likelihood: z.number().min(1).max(5).optional(),
            impact: z.number().min(1).max(5).optional(),
            page: z.number().optional(),
            atHome: z.string(), // our words, not the register's
            firstAction: z.string(),
            source: sourced,
          })
        )
        .min(4)
        .max(6),
      power: z
        .array(
          z.object({
            operator: z.string(),
            register: z.string(), // what the operator calls its priority register
            url: z.string().url(),
            phone: z.string().optional(),
            note: z.string().optional(),
            source: sourced,
          })
        )
        .min(1),
      water: z
        .array(
          z.object({
            company: z.string(),
            // Replaces the standard sentence when an area has several companies (London).
            intro: z.string().optional(),
            // What it supplies, when more than one company serves the area: "most of the county".
            covers: z.string().optional(),
            url: z.string().url(),
            phone: z.string().optional(),
            note: z.string().optional(),
            source: sourced,
          })
        )
        .min(1),
      pastEvents: z
        .array(z.object({ name: z.string(), date: z.string(), summary: z.string(), source: sourced }))
        .min(1)
        .max(2),
      flood: z
        .object({
          asOf: z.coerce.date(),
          rows: z.array(z.object({ band: z.string(), properties: z.number() })),
          source: sourced,
        })
        .optional(),
      councils: z.object({ text: z.string(), source: sourced }),
      councilPages: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
      radio: z.object({ text: z.string(), source: sourced }),
      // The 30-minute plan: five steps in this order (set by the area's ratings). Each step's
      // general advice lives in src/data/local.js; planNotes adds the local specific for each.
      planOrder: z.array(z.enum(PLAN_STEP_IDS)).length(5),
      planNotes: z.record(z.enum(PLAN_STEP_IDS), z.string()),
      firstHandNote: z.string().optional(),
      lastChecked: z.coerce.date(),
      watch: z.array(watch).default([]),
    })
    .refine((d) => d.planOrder.every((id) => d.planNotes[id]), {
      message: 'Every step in planOrder needs a matching planNotes entry',
      path: ['planNotes'],
    }),
});

// Facts shared by every local page (105, Floodline…) and national sources to watch.
const localNational = defineCollection({
  loader: glob({ pattern: '_national.yaml', base: './src/content/local' }),
  schema: z.object({
    contacts: z.array(z.object({ id: z.string(), label: z.string(), number: z.string(), source: sourced })),
    watch: z.array(watch).default([]),
  }),
});

export const collections = { blog, local, localNational };
