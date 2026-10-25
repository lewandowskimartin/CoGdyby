// "Co gdyby…?" questions on blog posts (the `pytania` field in each post's frontmatter).
// Used by the box under the intro ({% cogdyby /%}, CoGdybyBox.astro), the short answers
// at the end of the post and its FAQPage JSON-LD (PostLayout.astro), and the /co-gdyby/ hub.
//
// `sekcja` is the exact text of the H2 the question links to. The anchor is made with the
// same slugger Astro uses for heading ids, and the build fails if the heading is missing,
// so a renamed section can't leave a dead link behind.
import { slug as slugify } from 'github-slugger';

export const COGDYBY_TAG = '{% cogdyby /%}';

// Polish typography: keep one-letter words (a, i, o, u, w, z) with the next word, so they
// never end a line ("a w / domu"). Display only; JSON-LD keeps the plain text.
export const sierotki = (s) => s.replace(/(?<=^|\s)([aiouwzAIOUWZ])\s+/g, '$1\u00A0');

export function pytaniaFor(post) {
  const list = post.data.pytania ?? [];
  if (list.length === 0) return [];

  const body = post.body ?? '';
  if (!body.includes(COGDYBY_TAG)) {
    throw new Error(`[pytania] ${post.id}: dodaj ${COGDYBY_TAG} pod wstępem wpisu`);
  }

  const headings = new Set([...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]));
  return list.map((p) => {
    if (!headings.has(p.sekcja)) {
      throw new Error(`[pytania] ${post.id}: brak nagłówka „## ${p.sekcja}” dla pytania „${p.pytanie}”`);
    }
    return { ...p, id: slugify(p.sekcja) };
  });
}
