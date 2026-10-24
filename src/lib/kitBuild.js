// Pure sizing for the emergency kit builder. No DOM, so it runs in Node tests and the browser.
import { ITEMS, LIMITS, RATES, SCENARIOS, DEFAULT_SCENARIO, SUGGESTED_BY_MONTH } from '../data/kit.js';

/**
 * Clamp to a whole number inside a {min,max,default} range.
 * A missing value falls back to the default. Number(null) and Number('') are both 0, so a missing
 * param has to be caught before the numeric conversion or it clamps to the minimum instead.
 */
export function clampField(value, range) {
  if (value === null || value === undefined || value === '') return range.default;
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return range.default;
  return Math.min(range.max, Math.max(range.min, n));
}

export function isScenario(id) {
  return SCENARIOS.some((s) => s.id === id);
}

export function getScenario(id) {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS.find((s) => s.id === DEFAULT_SCENARIO);
}

/** The scenario to badge as "Suggested now" for a date, or null for months with no suggestion. */
export function suggestedScenario(date = new Date()) {
  const id = SUGGESTED_BY_MONTH[date.getMonth() + 1];
  return isScenario(id) ? id : null;
}

/**
 * Read a household out of URL params (or any {get(name)} object).
 * Every field is clamped, so no combination of params can produce NaN or an empty household.
 * @returns {{adults:number, children:number, pets:number, medical:boolean, days:number, scenario:string}}
 */
export function parseHousehold(params = null, fallbackScenario = DEFAULT_SCENARIO) {
  const get = (k) => (params && typeof params.get === 'function' ? params.get(k) : null);
  const raw = get('s');
  return {
    adults: clampField(get('a'), LIMITS.adults),
    children: clampField(get('c'), LIMITS.children),
    pets: clampField(get('p'), LIMITS.pets),
    medical: get('m') === '1',
    days: clampField(get('d'), LIMITS.days),
    scenario: isScenario(raw) ? raw : (isScenario(fallbackScenario) ? fallbackScenario : DEFAULT_SCENARIO),
  };
}

/** The inverse of parseHousehold — the query string that reproduces this kit. */
export function encodeHousehold(h) {
  const q = new URLSearchParams({
    a: String(h.adults),
    c: String(h.children),
    p: String(h.pets),
    d: String(h.days),
    s: h.scenario,
  });
  if (h.medical) q.set('m', '1');
  return q.toString();
}

/** Does this item belong in this household's list? */
export function itemApplies(item, h) {
  if (item.needs === 'children' && h.children < 1) return false;
  if (item.needs === 'pets' && h.pets < 1) return false;
  if (item.needs === 'medical' && !h.medical) return false;
  if (item.scenarios === 'all') return true;
  return Array.isArray(item.scenarios) && item.scenarios.includes(h.scenario);
}

/**
 * Size a kit for a household.
 * @returns {{people:number, days:number, waterMin:number, waterComfort:number, meals:number,
 *            petWater:number, items:object[], scenario:object, household:object}}
 */
export function buildKit(input = {}, items = ITEMS) {
  const h = {
    adults: clampField(input.adults, LIMITS.adults),
    children: clampField(input.children, LIMITS.children),
    pets: clampField(input.pets, LIMITS.pets),
    days: clampField(input.days, LIMITS.days),
    medical: Boolean(input.medical),
    scenario: isScenario(input.scenario) ? input.scenario : DEFAULT_SCENARIO,
  };

  const people = h.adults + h.children;
  const totals = {
    people,
    days: h.days,
    waterMin: Math.ceil(people * h.days * RATES.waterMinPerPersonPerDay),
    waterComfort: Math.ceil(people * h.days * RATES.waterComfortPerPersonPerDay),
    meals: people * h.days * RATES.mealsPerPersonPerDay,
    petWater: Math.ceil(h.pets * h.days * RATES.petWaterPerPetPerDay),
  };

  const list = items.filter((item) => itemApplies(item, h));

  return {
    ...totals,
    household: h,
    scenario: getScenario(h.scenario),
    items: list.map((item) => ({
      id: item.id,
      name: item.name,
      why: item.why,
      guide: item.guide ?? null,
      qty: typeof item.qty === 'function' ? item.qty(totals) : null,
    })),
  };
}

/** "W domu: 3 osoby i 1 zwierzę." — bieżące podsumowanie w kroku 1. */
// Polska odmiana: 1 -> [0], końcówka 2-4 (poza 12-14) -> [1], reszta -> [2].
function plForm(n, forms) {
  if (n === 1) return forms[0];
  const t = n % 10, h = n % 100;
  if (t >= 2 && t <= 4 && !(h >= 12 && h <= 14)) return forms[1];
  return forms[2];
}
export function describeHousehold(h) {
  const people = clampField(h.adults, LIMITS.adults) + clampField(h.children, LIMITS.children);
  const pets = clampField(h.pets, LIMITS.pets);
  const peopleText = `${people} ${plForm(people, ['osoba', 'osoby', 'osób'])}`;
  const petText = pets === 0 ? '' : ` i ${pets} ${plForm(pets, ['zwierzę', 'zwierzęta', 'zwierząt'])}`;
  return `W domu: ${peopleText}${petText}.`;
}
