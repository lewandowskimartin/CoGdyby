// Local guides (/local/<area>/): copy and settings shared by every area page.
// Area facts live in src/content/local/<area>.yaml. Plan: plans/2026-10-14-local-risk-pages.md
//
// Keep shared text short: the doorway guardrail allows at most 30% shared 5-word phrases
// between any two area pages (npm run check:similarity), so most of each page must come
// from the area's own YAML.

export const LOCAL_PATH = '/local';
export const localHref = (id) => `${LOCAL_PATH}/${id}/`;

// Byline on every local page and in its Article schema. TODO(Martin): confirm the name
// to publish under ("Martin" as on /early-access/, or "Marcin Lewandowski" as on /terms/).
export const LOCAL_AUTHOR = 'Martin';
export const CORRECTIONS_EMAIL = 'kontakt@cogdyby.pl';
export const NOT_AFFILIATED =
  'Niezależny poradnik Co gdyby, niezwiązany z żadnym centrum zarządzania kryzysowego, urzędem ani organem administracji.';

// The 30-minute plan. Each area picks five of these in its own order (planOrder in the
// YAML, set by its risk ratings) and adds a local note to each (planNotes).
export const PLAN_STEPS = {
  flood: {
    title: 'Śledź ostrzeżenia powodziowe',
    text: 'Zainstaluj aplikację RSO, sprawdzaj ostrzeżenia IMGW i ustal, co przeniesiesz wyżej.',
    link: { href: 'https://hydro.imgw.pl/', label: 'Ostrzeżenia hydrologiczne IMGW' },
  },
  power: {
    title: 'Przygotuj się na przerwę w prądzie',
    text: 'Odłóż w jedno miejsce latarkę, radio na baterie i naładowany power bank.',
  },
  water: {
    title: 'Przygotuj się na brak wody z kranu',
    text: 'Zrób zapas co najmniej 3 litrów wody pitnej na osobę na dobę, na minimum 3 dni.',
  },
  storm: {
    title: 'Przygotuj się przed wichurą',
    text: 'Naładuj telefony, schowaj luźne rzeczy z balkonu i ogrodu, zaparkuj z dala od drzew.',
  },
  cold: {
    title: 'Zaplanuj, jak utrzymać ciepło w domu',
    text: 'Wybierzcie jeden pokój, który ogrzejecie, i zróbcie zapas jedzenia bez gotowania.',
  },
  heat: {
    title: 'Przygotuj się na upał',
    text: 'Wybierz najchłodniejszy pokój, zasłaniaj okna w dzień i dzwoń do bliskich, którzy mieszkają sami.',
  },
  evacuation: {
    title: 'Wiedz, dokąd pójdziesz',
    text: 'Spakujcie plecaki ewakuacyjne i ustalcie miejsce spotkania.',
  },
};
export const PLAN_STEP_IDS = /** @type {const} */ (['flood', 'power', 'water', 'storm', 'cold', 'heat', 'evacuation']);

// Two guides linked from every local page, beside the /local/ hub.
export const LOCAL_RELATED = ['what-to-do-in-a-flood-uk', 'how-to-prepare-for-a-power-cut-uk'];
