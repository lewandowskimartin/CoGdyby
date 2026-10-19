// Early Access cohort — single source of truth for the /early-access page and every
// promo link across the site (top bar, guide box, homepage card, free-sample line, footer).
// To end the promo early: set ENABLED to false. Otherwise it switches itself off after CLOSE_ISO
// (at build time, and in the visitor's browser — no redeploy needed).

export const EA = {
  ENABLED: true,
  NAME: "Gotowi w 30 dni",
  DESCRIPTOR: "30-dniowy kurs, który krok po kroku przygotuje Twój dom na sytuacje kryzysowe",
  URL: "/early-access",
  // DISABLED: oEMUw is the English "Ready in 30" course priced in GBP (£29). Paste the link of the
  // Polish course, priced in PLN, once it exists in Payhip (see src/config/pack.ts for why).
  CHECKOUT_URL: "",
  PRICE: "149 zł",
  LIST_PRICE: "399 zł",
  SEAT_CAP: 30,
  // Seats sold at this price. Update by hand from Payhip (or let Payhip's quantity limit do it).
  // When SEATS_SOLD reaches SEAT_CAP the site stops offering this price and moves to the next tier.
  SEATS_SOLD: 0,
  SHOW_SEAT_COUNTER: false, // keep off until a few seats have sold — "30 of 30 left" reads as "nobody bought"
  CLOSE_ISO: "2026-11-10T23:59:00+01:00", // midnight Polish time (CET), which is what "o północy" means to a Polish reader
  CLOSE_LABEL: "10\u00a0listopada o\u00a0północy",
  CLOSE_SHORT: "10\u00a0listopada",
  REFUND_DAYS: 30, // counted from the day the course opens, not the purchase date
  COURSE_OPEN_LABEL: "10\u00a0grudnia 2026",
  // Payhip link for the full-price plan (EA.LIST_PRICE), used after the early-bird tier ends.
  LIST_CHECKOUT_URL: "",
};

// After Early Access closes the course doesn't disappear — it moves to the early-bird tier.
// CHECKOUT_URL stays empty until the 249 zł Payhip plan exists; promos link to the /early-access
// page rather than straight to checkout, so an empty link breaks nothing.
export const EARLY_BIRD = {
  PRICE: "249 zł",
  SEAT_CAP: 50,
  SEATS_SOLD: 0,
  CHECKOUT_URL: "",
  CLOSE_ISO: "2026-12-28T23:59:00+01:00", // midnight Polish time (CET)
  CLOSE_LABEL: "28\u00a0grudnia", // non-breaking space: keeps "28 grudnia" on one line
};

// After the early-bird close the course sells at full price (EA.LIST_PRICE).
export type EaPhase = "off" | "early-access" | "early-bird" | "launch";

// Which price tier is on sale right now. A tier counts only while ALL of these are true:
// its close date hasn't passed, it isn't sold out, and its Payhip checkout link exists.
// No checkout link = "off": the site makes no price, seat or deadline claims at all, so it never
// advertises a scarcity or deadline that a buyer can't actually act on (UOKiK treats false
// urgency as an unfair practice). "off" also covers ENABLED = false.
// Static pages read this at build time: redeploy when a tier changes (date passes, seats sell
// out). Promos also hide themselves in the browser after their close date.
export const eaPhase = (now: Date = new Date()): EaPhase => {
  if (!EA.ENABLED) return "off";
  const t = now.getTime();
  if (t < new Date(EA.CLOSE_ISO).getTime() && EA.SEATS_SOLD < EA.SEAT_CAP) {
    return EA.CHECKOUT_URL ? "early-access" : "off";
  }
  if (t < new Date(EARLY_BIRD.CLOSE_ISO).getTime() && EARLY_BIRD.SEATS_SOLD < EARLY_BIRD.SEAT_CAP) {
    return EARLY_BIRD.CHECKOUT_URL ? "early-bird" : "off";
  }
  return EA.LIST_CHECKOUT_URL ? "launch" : "off";
};

// Course price for the current phase.
export const eaPrice = (phase: EaPhase = eaPhase()) =>
  phase === "early-bird" ? EARLY_BIRD.PRICE : phase === "launch" ? EA.LIST_PRICE : EA.PRICE;

// Checkout link for the current phase ("" when nothing is on sale).
export const eaCheckout = (phase: EaPhase = eaPhase()) =>
  phase === "early-access" ? EA.CHECKOUT_URL
  : phase === "early-bird" ? EARLY_BIRD.CHECKOUT_URL
  : phase === "launch" ? EA.LIST_CHECKOUT_URL
  : "";

// Seats left at the current tier's price (null at full price, which has no cap).
export const eaSeatsLeft = (phase: EaPhase = eaPhase()) =>
  phase === "early-access" ? EA.SEAT_CAP - EA.SEATS_SOLD
  : phase === "early-bird" ? EARLY_BIRD.SEAT_CAP - EARLY_BIRD.SEATS_SOLD
  : null;

export const eaIsOpen = (now: Date = new Date()) => eaPhase(now) === "early-access";

// Link to the Early Access page. Always the clean URL: ?src= tags gave crawlers one duplicate
// URL per placement (Semrush found ~23), wasting crawl on a site Google is still indexing.
// The placement now travels in the link's data-ea-cta attribute instead: BaseLayout reports
// it as ea_cta_clicked and hands it to the Early Access page (rememberEaSource in lib/track.js).
// `src` is kept so call sites stay readable; it is not put in the URL.
// EA.URL stays slash-free because pages compare it to their pathname; the link adds the slash
// so it lands on the served URL instead of a redirect.
export const eaHref = (_src?: string) => `${EA.URL}/`;

// Guide-specific lead-in for the end-of-article box. Missing slugs fall back to a generic line.
export const EA_GUIDE_TOPICS: Record<string, string> = {
  "how-to-prepare-for-a-power-cut-uk": "przerwach w prądzie",
  "what-to-do-during-a-power-cut-uk": "przerwach w prądzie",
  "will-the-uk-have-blackouts-this-winter": "blackoucie",
  "how-to-prepare-for-a-storm-uk": "wichurach",
  "what-to-do-in-a-flood-uk": "powodzi",
  "how-much-water-to-store-emergency-uk": "zapasach wody",
  "emergency-food-supply-uk-budget": "zapasach jedzenia",
  "uk-emergency-grab-bag-checklist": "plecaku ewakuacyjnym",
  "what-to-put-in-a-uk-emergency-kit": "zestawie awaryjnym",
  "uk-emergency-numbers-every-household-should-know": "numerach alarmowych",
};
