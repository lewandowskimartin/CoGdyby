// The course page and promos may only claim a price, seat limit or deadline while that offer can
// really be bought. These tests pin the rules in src/config/earlyAccess.ts.
import test from 'node:test';
import assert from 'node:assert/strict';
import { EA, EARLY_BIRD, eaPhase, eaIsOpen, eaCheckout, eaSeatsLeft } from '../config/earlyAccess.ts';
import { PACK_CONFIG } from '../config/pack.ts';

const before = new Date(new Date(EA.CLOSE_ISO).getTime() - 864e5);
const between = new Date(new Date(EA.CLOSE_ISO).getTime() + 864e5);
const after = new Date(new Date(EARLY_BIRD.CLOSE_ISO).getTime() + 864e5);

function withConfig(patch, fn) {
  const saved = { ea: { ...EA }, eb: { ...EARLY_BIRD }, open: PACK_CONFIG.SALES_OPEN };
  // These tests pin the tier rules, so sales count as open unless a test says otherwise.
  PACK_CONFIG.SALES_OPEN = patch.open ?? true;
  Object.assign(EA, patch.ea ?? {});
  Object.assign(EARLY_BIRD, patch.eb ?? {});
  try { fn(); } finally { Object.assign(EA, saved.ea); Object.assign(EARLY_BIRD, saved.eb); PACK_CONFIG.SALES_OPEN = saved.open; }
}

const links = { ea: { CHECKOUT_URL: 'https://example.test/ea', LIST_CHECKOUT_URL: 'https://example.test/full', SEATS_SOLD: 0 }, eb: { CHECKOUT_URL: 'https://example.test/eb', SEATS_SOLD: 0 } };

test('no checkout link means nothing is on sale, so no price or deadline claims', () => {
  withConfig({ ea: { CHECKOUT_URL: '', SEATS_SOLD: 0 } }, () => {
    assert.equal(eaPhase(before), 'off');
    assert.equal(eaIsOpen(before), false);
    assert.equal(eaCheckout(eaPhase(before)), '');
  });
});

test('sales switch off means nothing is on sale, even with checkout links set', () => {
  withConfig({ ...links, open: false }, () => {
    assert.equal(eaPhase(before), 'off');
    assert.equal(eaCheckout(eaPhase(before)), '');
  });
});

test('each tier runs until its close date', () => {
  withConfig(links, () => {
    assert.equal(eaPhase(before), 'early-access');
    assert.equal(eaPhase(between), 'early-bird');
    assert.equal(eaPhase(after), 'launch');
  });
});

test('a sold-out tier closes early and moves to the next price', () => {
  withConfig({ ...links, ea: { ...links.ea, SEATS_SOLD: EA.SEAT_CAP } }, () => {
    assert.equal(eaPhase(before), 'early-bird');
    assert.equal(eaIsOpen(before), false);
  });
  withConfig({ ...links, eb: { ...links.eb, SEATS_SOLD: EARLY_BIRD.SEAT_CAP } }, () => {
    assert.equal(eaPhase(between), 'launch');
  });
});

test('seats left are counted from the cap', () => {
  withConfig({ ...links, ea: { ...links.ea, SEATS_SOLD: 12 } }, () => {
    assert.equal(eaSeatsLeft(eaPhase(before)), EA.SEAT_CAP - 12);
  });
});

test('deadlines are set in Polish time and in the right order', () => {
  assert.match(EA.CLOSE_ISO, /\+0[12]:00$/);
  assert.match(EARLY_BIRD.CLOSE_ISO, /\+0[12]:00$/);
  assert.ok(new Date(EA.CLOSE_ISO) < new Date(EARLY_BIRD.CLOSE_ISO));
});
