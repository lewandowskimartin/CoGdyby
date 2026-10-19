// The 79 zł household emergency plan pack — single source of truth for the Payhip checkout.
// Paste the product's Payhip link into CHECKOUT_URL. While it's empty, every "Get the pack"
// button falls back to the pricing section on the homepage (/#get), so nothing breaks.

export const PACK_CONFIG = {
  // DISABLED: n3Vsm is the English Prepared at Home pack priced in GBP (£14.99). Selling it here
  // as "79 zł" would charge Polish buyers in GBP for an English file: a misleading practice under
  // Polish consumer law. Paste the link of the Polish PDF, priced in PLN, once it exists in Payhip.
  CHECKOUT_URL: "",
  PRICE: "79 zł",
  // Until the Polish product exists, buy buttons open an e-mail instead of a dead link.
  FALLBACK_URL: "mailto:kontakt@cogdyby.pl?subject=Pakiet%20Co%20gdyby",
};

export const packHref = () => PACK_CONFIG.CHECKOUT_URL || PACK_CONFIG.FALLBACK_URL;
