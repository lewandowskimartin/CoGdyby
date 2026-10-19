// Run with: node --test src/lib/kitBuild.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clampField,
  parseHousehold,
  encodeHousehold,
  itemApplies,
  buildKit,
  describeHousehold,
  getScenario,
  isScenario,
  suggestedScenario,
} from './kitBuild.js';
import { LIMITS, SCENARIOS, ITEMS, SUGGESTED_BY_MONTH } from '../data/kit.js';

const params = (obj) => new URLSearchParams(obj);

test('default household: 2 adults, 3 days, 18–60 litres, 18 meals', () => {
  const kit = buildKit({});
  assert.equal(kit.people, 2);
  assert.equal(kit.days, 3);
  assert.equal(kit.waterMin, 18);
  assert.equal(kit.waterComfort, 60);
  assert.equal(kit.meals, 18);
});

test('3 people over 3 days matches the gov.uk-sized range', () => {
  const kit = buildKit({ adults: 2, children: 1, days: 3 });
  assert.equal(kit.waterMin, 27);
  assert.equal(kit.waterComfort, 90);
  assert.equal(kit.meals, 27);
});

test('clampField: floors, bounds and falls back on nonsense', () => {
  assert.equal(clampField('4', LIMITS.adults), 4);
  assert.equal(clampField(2.9, LIMITS.adults), 2);
  assert.equal(clampField(999, LIMITS.adults), LIMITS.adults.max);
  assert.equal(clampField(-5, LIMITS.adults), LIMITS.adults.min);
  assert.equal(clampField('banana', LIMITS.adults), LIMITS.adults.default);
  assert.equal(clampField(null, LIMITS.days), LIMITS.days.default);
});

test('a household can never be empty', () => {
  const kit = buildKit({ adults: 0, children: 0, pets: 0 });
  assert.equal(kit.people, 1);
  assert.ok(kit.waterMin > 0);
  assert.ok(kit.meals > 0);
});

test('conditional items appear only when the household has them', () => {
  const plain = buildKit({ adults: 2 }).items.map((i) => i.id);
  assert.ok(!plain.includes('babies'));
  assert.ok(!plain.includes('pets'));
  assert.ok(!plain.includes('psr'));

  const full = buildKit({ adults: 2, children: 2, pets: 1, medical: true }).items.map((i) => i.id);
  assert.ok(full.includes('babies'));
  assert.ok(full.includes('pets'));
  assert.ok(full.includes('psr'));
  assert.ok(full.includes('backup-power'));
});

test('scenario swaps the scenario-only items', () => {
  const storm = buildKit({ scenario: 'storm' }).items.map((i) => i.id);
  const flood = buildKit({ scenario: 'flood' }).items.map((i) => i.id);
  assert.ok(storm.includes('outside'));
  assert.ok(!storm.includes('upstairs'));
  assert.ok(flood.includes('upstairs'));
  assert.ok(flood.includes('floodwarnings'));
  assert.ok(!flood.includes('outside'));
});

test('every scenario produces a non-empty list', () => {
  for (const s of SCENARIOS) {
    const kit = buildKit({ scenario: s.id });
    assert.ok(kit.items.length > 0, `${s.id} produced no items`);
    assert.equal(kit.scenario.id, s.id);
  }
});

test('quantities render as strings only where an item defines one', () => {
  const kit = buildKit({ adults: 2, children: 1, pets: 1, days: 3 });
  const byId = Object.fromEntries(kit.items.map((i) => [i.id, i]));
  assert.equal(byId.water.qty, '27–90 litrów');
  assert.equal(byId.food.qty, '27 posiłków');
  assert.equal(byId.torch.qty, '3, jeśli się da');
  assert.equal(byId.pets.qty, '3 l wody');
  assert.equal(byId.tinopener.qty, null);
});

test('parseHousehold clamps and defaults a mangled query string', () => {
  const h = parseHousehold(params({ a: '-3', c: 'x', p: '999', d: '0', s: 'nonsense' }));
  assert.equal(h.adults, LIMITS.adults.min);
  assert.equal(h.children, LIMITS.children.default);
  assert.equal(h.pets, LIMITS.pets.max);
  assert.equal(h.days, LIMITS.days.min);
  assert.equal(h.scenario, 'general');
  assert.equal(h.medical, false);
});

test('parseHousehold honours the page fallback scenario, and ?s= beats it', () => {
  assert.equal(parseHousehold(params({}), 'flood').scenario, 'flood');
  assert.equal(parseHousehold(params({ s: 'storm' }), 'flood').scenario, 'storm');
  assert.equal(parseHousehold(null, 'power-cut').scenario, 'power-cut');
});

test('encode then parse is a round trip', () => {
  const h = { adults: 3, children: 2, pets: 1, medical: true, days: 7, scenario: 'power-cut' };
  assert.deepEqual(parseHousehold(params(encodeHousehold(h))), h);
});

test('encode omits the medical flag when it is off', () => {
  const q = encodeHousehold({ adults: 1, children: 0, pets: 0, medical: false, days: 3, scenario: 'general' });
  assert.ok(!q.includes('m='));
});

test('describeHousehold reads in Polish, singular and plural', () => {
  assert.equal(describeHousehold({ adults: 1, children: 0, pets: 0 }), 'W domu: 1 osoba.');
  assert.equal(describeHousehold({ adults: 2, children: 1, pets: 1 }), 'W domu: 3 osoby i 1 zwierzę.');
  assert.equal(describeHousehold({ adults: 2, children: 0, pets: 2 }), 'W domu: 2 osoby i 2 zwierzęta.');
});

test('scenario helpers', () => {
  assert.ok(isScenario('flood'));
  assert.ok(!isScenario('zombies'));
  assert.equal(getScenario('zombies').id, 'general');
});

test('every item has the fields the template renders, and valid references', () => {
  const ids = new Set();
  const scenarioIds = new Set(SCENARIOS.map((s) => s.id));
  for (const item of ITEMS) {
    assert.ok(item.id && !ids.has(item.id), `duplicate or missing id: ${item.id}`);
    ids.add(item.id);
    assert.ok(item.name && item.why, `${item.id} is missing name or why`);
    assert.ok(item.scenarios === 'all' || Array.isArray(item.scenarios), `${item.id} has bad scenarios`);
    if (Array.isArray(item.scenarios))
      for (const s of item.scenarios) assert.ok(scenarioIds.has(s), `${item.id} references unknown scenario ${s}`);
    if (item.needs) assert.ok(['children', 'pets', 'medical'].includes(item.needs), `${item.id} has bad needs`);
  }
});

test('itemApplies is the filter buildKit uses', () => {
  const h = { adults: 2, children: 0, pets: 0, medical: false, days: 3, scenario: 'general' };
  const direct = ITEMS.filter((i) => itemApplies(i, h)).map((i) => i.id);
  assert.deepEqual(buildKit(h).items.map((i) => i.id), direct);
});

test('winter scenarios: each adds its own items on top of the shared kit', () => {
  const cold = buildKit({ scenario: 'cold-snap' }).items.map((i) => i.id);
  for (const id of ['warmth', 'flask', 'stoptap', 'coalarm', 'carkit', 'checkin']) assert.ok(cold.includes(id), `cold-snap has ${id}`);
  assert.ok(!cold.includes('flushing'));
  const water = buildKit({ scenario: 'water-outage' }).items.map((i) => i.id);
  for (const id of ['water', 'handwash', 'flushing', 'watercompany', 'psr-water']) assert.ok(water.includes(id), `water-outage has ${id}`);
  assert.ok(!water.includes('stoptap'));
});

test('suggestedScenario: one badge per listed month, none otherwise', () => {
  const expected = { 1: 'cold-snap', 2: 'cold-snap', 3: 'storm', 10: 'storm', 11: 'cold-snap', 12: 'cold-snap' };
  for (let m = 1; m <= 12; m++) {
    assert.equal(suggestedScenario(new Date(2026, m - 1, 15)), expected[m] ?? null, `month ${m}`);
  }
  for (const id of Object.values(SUGGESTED_BY_MONTH)) assert.ok(isScenario(id), `${id} is a real scenario`);
});
