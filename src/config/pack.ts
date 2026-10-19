// The 79 zł household emergency plan pack — single source of truth for the Payhip checkout.
// Paste the product's Payhip link into CHECKOUT_URL. While it's empty, every "Get the pack"
// button falls back to the pricing section on the homepage (/#get), so nothing breaks.

export const PACK_CONFIG = {
  CHECKOUT_URL: "https://payhip.com/buy?link=n3Vsm", // Payhip product link for "Co gdyby — Household Emergency Plan", 79 zł
  PRICE: "79 zł",
  FALLBACK_URL: "/#get",
};

export const packHref = () => PACK_CONFIG.CHECKOUT_URL || PACK_CONFIG.FALLBACK_URL;
