/* Registry of OG card content, keyed by the slug used in /og/<slug>.png.
   Headlines here are written for a social card — shorter and punchier than the SEO
   <title>, which has to carry the brand suffix and keywords. Keep them under ~70
   characters so the display size stays large. */

import { SCENARIOS, KIT_PATH } from '../../data/kit.js';
import { PACK_CONFIG } from '../../config/pack.ts';
import { EA, EARLY_BIRD, eaPhase } from '../../config/earlyAccess.ts';

// The course card states a price only while that price is actually on sale.
const EA_PHASE = eaPhase();
const EA_CHIP =
  EA_PHASE === 'early-access' ? { label: EA.PRICE, caption: `Wczesny dostęp · potem ${EA.LIST_PRICE}`, variant: 'ink' }
  : EA_PHASE === 'early-bird' ? { label: EARLY_BIRD.PRICE, caption: `Cena promocyjna · potem ${EA.LIST_PRICE}`, variant: 'ink' }
  : EA_PHASE === 'launch' ? { label: EA.LIST_PRICE, caption: 'Zapisy otwarte', variant: 'ink' }
  : { label: 'Wkrótce', caption: 'Kurs w przygotowaniu', variant: 'outline' };

const PACK_CHIP = { label: PACK_CONFIG.PRICE, caption: 'Natychmiastowe pobranie', variant: 'accent' };
const FREE_CHIP = { label: 'Za darmo', caption: 'Karta na lodówkę', variant: 'outline' };
const GUIDE_CHIP = { label: 'Poradnik', caption: 'Za darmo', variant: 'outline' };
const KIT_CHIP = { label: 'Bezpłatnie', caption: 'Bez zapisu', variant: 'outline' };

/* One card per kit builder page, built from the scenario list so a new scenario gets
   its card with no extra wiring. The general kit lives at /kit, the rest at /kit/<slug>. */
const KIT_PAGES = Object.fromEntries(
  SCENARIOS.map((s) => [
    s.slug ? `${KIT_PATH.slice(1)}/${s.slug}` : KIT_PATH.slice(1),
    { eyebrow: 'Kalkulator zapasów', headline: s.h1, sub: s.blurb, chip: KIT_CHIP },
  ])
);

export const STATIC_PAGES = {
  index: {
    eyebrow: 'Domowy plan na sytuacje kryzysowe',
    headline: "Rodzinny plan awaryjny, który naprawdę wisi na lodówce",
    sub: '12 stron do druku A4 · na podstawie rządowego Poradnika bezpieczeństwa.',
    chip: PACK_CHIP,
  },

  families: {
    eyebrow: 'Dla rodzin z dziećmi',
    headline: 'Plan awaryjny, który zrozumieją też dzieci',
    sub: "Ze stroną dla dzieci: prosty język i trzy rzeczy, które warto, żeby wiedziało każde dziecko.",
    chip: PACK_CHIP,
  },

  'elderly-parents': {
    eyebrow: 'Dla dorosłych dzieci i opiekunów',
    headline: "Plan na lodówce mamy i taty",
    sub: "Numery alarmowe, do kogo dzwonić, gdzie jest główny zawór wody i co zrobić, gdy zabraknie prądu.",
    chip: PACK_CHIP,
  },

  'free-emergency-plan-template': {
    eyebrow: 'Darmowy fragment',
    headline: 'Darmowy szablon domowego planu na sytuacje kryzysowe',
    sub: 'Pobierz kartę na lodówkę, najczęściej używaną stronę planu. Wypełnij i przypnij magnesem.',
    chip: { label: 'Za darmo', caption: 'Karta na lodówkę do druku', variant: 'outline' },
  },

  'early-access': {
    eyebrow: EA_PHASE === 'early-access' ? 'Gotowi w 30 dni · Wczesny dostęp' : 'Kurs „Gotowi w 30 dni”',
    headline: 'W 30 dni przygotujesz dom na sytuacje kryzysowe',
    sub: 'Spokojny kurs krok po kroku dla polskich rodzin, jeden krótki krok w tygodniu.',
    chip: EA_CHIP,
  },

  'household-preparedness-quiz': {
    eyebrow: 'Quiz w 2 minuty',
    headline: 'Jak przygotowany jest Twój dom?',
    sub: '10 krótkich pytań, wynik w skali 0–100 i bezpłatny sposób na każdy brak.',
    chip: { label: 'Za darmo', caption: 'Zajmuje 2 minuty', variant: 'outline' },
  },

  'household-preparedness-quiz/results': {
    eyebrow: 'Wynik quizu',
    headline: 'Twój wynik w quizie gotowości',
    sub: 'Wynik w skali 0–100, najważniejsze braki i bezpłatny sposób na każdy z nich.',
    chip: FREE_CHIP,
  },

  blog: {
    eyebrow: 'Poradniki',
    headline: 'Spokojne, praktyczne poradniki dla polskich domów',
    sub: 'Przerwy w prądzie, wichury, powodzie i plecak ewakuacyjny. Na podstawie rządowego Poradnika bezpieczeństwa.',
    chip: GUIDE_CHIP,
  },

  faq: {
    eyebrow: 'Pytania',
    headline: "Pytania o pakiet i odpowiedzi",
    sub: "Co jest w środku, druk, dostawa, zwroty i wersja dla organizacji.",
    chip: PACK_CHIP,
  },

  privacy: {
    eyebrow: 'Informacje prawne',
    headline: 'Polityka prywatności',
    sub: 'Jak Co gdyby zbiera, wykorzystuje i chroni Twoje dane oraz jakie masz prawa na gruncie RODO.',
    chip: null,
  },

  terms: {
    eyebrow: 'Informacje prawne',
    headline: 'Regulamin sprzedaży i korzystania',
    sub: 'Warunki zakupu i korzystania z pakietu Co gdyby.',
    chip: null,
  },

  404: {
    eyebrow: 'Nie znaleziono strony',
    headline: "Ta strona nie istnieje",
    sub: "Plan dla Twojego domu znajdziesz na stronie głównej.",
    chip: null,
  },
  ...KIT_PAGES,
};

/* Topic eyebrows for the guides. A guide whose slug isn't listed falls back to
   "Guide", so new posts still get a correct card without touching this file. */
const GUIDE_TOPICS = {
  'cheap-ways-to-prepare-for-emergencies-uk': 'Tanim kosztem',
  'emergency-food-supply-uk-budget': 'Jedzenie i woda',
  'home-fire-safety-uk-checklist': 'Bezpieczeństwo pożarowe',
  'how-much-water-to-store-emergency-uk': 'Jedzenie i woda',
  'how-to-prepare-for-a-power-cut-uk': 'Przerwy w prądzie',
  'how-to-prepare-for-a-storm-uk': 'Wichury',
  'priority-services-register-uk-explained': 'Dodatkowe wsparcie',
  'uk-emergency-grab-bag-checklist': 'Plecak ewakuacyjny',
  'uk-emergency-numbers-every-household-should-know': 'Numery alarmowe',
  'what-the-uk-prepare-campaign-means-for-your-household': 'Poradnik bezpieczeństwa',
  'what-to-do-during-a-power-cut-uk': 'Przerwy w prądzie',
  'what-to-do-if-you-smell-gas-uk': 'Bezpieczeństwo gazowe',
  'what-to-do-in-a-flood-uk': 'Powodzie',
  'what-to-put-in-a-uk-emergency-kit': 'Zestaw awaryjny',
  'will-the-uk-have-blackouts-this-winter': 'Przerwy w prądzie',
};

/* Meta descriptions run long for SEO. On a card, one sentence is plenty — take the
   first. If that sentence is still too long, cut at the last clause boundary (comma,
   em dash, colon, semicolon) so the line ends on a complete thought rather than
   mid-phrase; fall back to a word boundary only if there is no clause break. */
function firstSentence(s, max = 140) {
  const clean = (s || '').trim();
  if (!clean) return '';

  const end = clean.search(/[.?!](\s|$)/);
  const one = end > -1 ? clean.slice(0, end + 1) : clean;
  if (one.length <= max) return one;

  const head = one.slice(0, max);
  const clause = Math.max(
    head.lastIndexOf(', '),
    head.lastIndexOf(' — '),
    head.lastIndexOf(': '),
    head.lastIndexOf('; ')
  );
  if (clause > max * 0.45) return head.slice(0, clause).trimEnd() + '…';

  return head.slice(0, head.lastIndexOf(' ')).trimEnd() + '…';
}

/* Trim the brand suffix Astro pages append to titles ("… — Co gdyby"),
   which is noise on a card that already carries the wordmark. */
function stripBrand(title) {
  return title.replace(/\s*[—–|·-]\s*Co gdyby\s*$/, '').trim();
}

/* Local guides (/local/ and /local/<area>/). */
const LOCAL_CHIP = { label: 'Lokalnie', caption: 'Bezpłatnie', variant: 'outline' };
export const LOCAL_HUB_PAGE = {
  eyebrow: 'Poradniki lokalne',
  headline: "Plan na kryzys dla Twojego województwa",
  sub: 'Lokalne zagrożenia, kontakty i ostrzeżenia, region po regionie.',
  chip: LOCAL_CHIP,
};
export function localPage(name, answer) {
  return { eyebrow: 'Poradnik lokalny', headline: `Plan na kryzys: ${name}`, sub: firstSentence(answer), chip: LOCAL_CHIP };
}

export function guidePage(slug, title, description) {
  return {
    eyebrow: GUIDE_TOPICS[slug] || 'Poradnik',
    headline: stripBrand(title),
    sub: firstSentence(description),
    chip: GUIDE_CHIP,
  };
}
