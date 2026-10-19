// Who sells on cogdyby.pl — single source of truth for the terms, privacy policy and footer.
// Same seller as preparedathome.co.uk: Marcin Lewandowski t/a Depthia, UK sole trader.
//
// ADDRESS and PHONE are REQUIRED before any sale to consumers:
// - Polish law: art. 12 ust. 1 pkt 3 ustawy o prawach konsumenta (address, e-mail, phone) and
//   art. 5 ust. 2 ustawy o świadczeniu usług drogą elektroniczną (address).
// - UK law: Electronic Commerce (EC Directive) Regulations 2002 reg. 6 (geographic address) and
//   the business-names rules (an address where documents can be served).
// A business-address / virtual-office service is fine; it does not have to be your home.
// While a field is empty the pages leave that line out and the build prints a warning.

export const SELLER = {
  NAME: "Marcin Lewandowski",
  TRADING_NAME: "Depthia",
  COUNTRY: "Wielka Brytania",
  ADDRESS: "66 Paul Street, London EC2A 4NA, Wielka Brytania",
  PHONE: "", // e.g. "+44 20 1234 5678" (a VoIP or business number is fine)
  EMAIL: "kontakt@cogdyby.pl",
  ICO: "ZC164548", // UK Information Commissioner's Office registration
  // GDPR art. 27 representative in the EU. Leave empty until appointed (see the legal checklist).
  EU_REP: "",
  WEBSITE: "https://depthia.com",
};

export const sellerReady = () => Boolean(SELLER.ADDRESS && SELLER.PHONE);

if (!sellerReady()) {
  // eslint-disable-next-line no-console
  console.warn(
    `[seller] ${[!SELLER.ADDRESS && "ADDRESS", !SELLER.PHONE && "PHONE"].filter(Boolean).join(" and ")} empty in src/config/seller.ts. Required by Polish consumer law (art. 12 UPK) before selling.`
  );
}
