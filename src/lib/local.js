// Content helpers for the local guides. Drafts (draft: true in the YAML) are included in
// `npm run dev` so they can be previewed, and left out of the production build, so a page
// only goes live once its YAML says draft: false.

import { getCollection, getEntry } from 'astro:content';

export async function publishedAreas() {
  const areas = await getCollection('local', ({ data }) => import.meta.env.DEV || !data.draft);
  return areas.sort((a, b) => a.data.name.localeCompare(b.data.name));
}

// National numbers keyed by id: { 'power-cut': { label, number, source }, … }
export async function nationalContacts() {
  const entry = await getEntry('localNational', '_national');
  return Object.fromEntries((entry?.data.contacts ?? []).map((c) => [c.id, c]));
}

export const fmtDate = (d) => d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
