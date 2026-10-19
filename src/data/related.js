// Internal links that templates generate, in one place:
// - GUIDE_GROUPS: the topic sections on /blog/
// - RELATED:      the "Related guides" list at the end of each guide (PostLayout.astro)
// - HOME_GUIDES:  the guide strip near the bottom of the homepage
// Adding a guide: put its slug in one group and give it a RELATED entry (three guides,
// mostly from its own topic plus one from next door). A guide left out of every group
// still shows on /blog/ under "More guides", so nothing goes missing.

export const guideHref = (slug) => `/blog/${slug}/`;

export const GUIDE_GROUPS = [
  {
    title: 'Zacznij tutaj',
    slugs: [
      'what-the-uk-prepare-campaign-means-for-your-household',
      'uk-emergency-numbers-every-household-should-know',
      'cheap-ways-to-prepare-for-emergencies-uk',
      'home-skills-that-save-money',
    ],
  },
  {
    title: 'Przerwy w prądzie i zima',
    slugs: [
      'uk-blackout-checklist',
      'digital-landline-switchover-uk',
      'how-to-prepare-for-a-power-cut-uk',
      'what-to-do-during-a-power-cut-uk',
      'will-the-uk-have-blackouts-this-winter',
      'priority-services-register-uk-explained',
    ],
  },
  {
    title: 'Wichury, powodzie, gaz i pożar',
    slugs: [
      'how-to-prepare-for-a-storm-uk',
      'what-to-do-in-a-flood-uk',
      'what-to-do-if-you-smell-gas-uk',
      'home-fire-safety-uk-checklist',
    ],
  },
  {
    title: 'Zapasy, woda i plecak ewakuacyjny',
    slugs: [
      'what-to-put-in-a-uk-emergency-kit',
      'uk-emergency-grab-bag-checklist',
      'how-much-water-to-store-emergency-uk',
      'emergency-food-supply-uk-budget',
    ],
  },
];

export const RELATED = {
  'digital-landline-switchover-uk': ['how-to-prepare-for-a-power-cut-uk', 'priority-services-register-uk-explained', 'uk-emergency-numbers-every-household-should-know'],
  'home-skills-that-save-money': ['cheap-ways-to-prepare-for-emergencies-uk', 'emergency-food-supply-uk-budget', 'what-to-put-in-a-uk-emergency-kit'],
  'uk-blackout-checklist': ['how-to-prepare-for-a-power-cut-uk', 'what-to-do-during-a-power-cut-uk', 'what-to-put-in-a-uk-emergency-kit'],
  'what-to-put-in-a-uk-emergency-kit': ['uk-emergency-grab-bag-checklist', 'how-much-water-to-store-emergency-uk', 'emergency-food-supply-uk-budget'],
  'uk-emergency-grab-bag-checklist': ['what-to-put-in-a-uk-emergency-kit', 'uk-emergency-numbers-every-household-should-know', 'what-to-do-in-a-flood-uk'],
  'how-much-water-to-store-emergency-uk': ['emergency-food-supply-uk-budget', 'what-to-put-in-a-uk-emergency-kit', 'cheap-ways-to-prepare-for-emergencies-uk'],
  'emergency-food-supply-uk-budget': ['how-much-water-to-store-emergency-uk', 'cheap-ways-to-prepare-for-emergencies-uk', 'what-to-do-during-a-power-cut-uk'],
  'cheap-ways-to-prepare-for-emergencies-uk': ['what-to-put-in-a-uk-emergency-kit', 'emergency-food-supply-uk-budget', 'what-the-uk-prepare-campaign-means-for-your-household'],
  'how-to-prepare-for-a-power-cut-uk': ['what-to-do-during-a-power-cut-uk', 'will-the-uk-have-blackouts-this-winter', 'priority-services-register-uk-explained'],
  'what-to-do-during-a-power-cut-uk': ['how-to-prepare-for-a-power-cut-uk', 'will-the-uk-have-blackouts-this-winter', 'emergency-food-supply-uk-budget'],
  'will-the-uk-have-blackouts-this-winter': ['how-to-prepare-for-a-power-cut-uk', 'what-to-do-during-a-power-cut-uk', 'how-to-prepare-for-a-storm-uk'],
  'priority-services-register-uk-explained': ['how-to-prepare-for-a-power-cut-uk', 'will-the-uk-have-blackouts-this-winter', 'uk-emergency-numbers-every-household-should-know'],
  'how-to-prepare-for-a-storm-uk': ['how-to-prepare-for-a-power-cut-uk', 'what-to-do-in-a-flood-uk', 'uk-emergency-grab-bag-checklist'],
  'what-to-do-in-a-flood-uk': ['how-to-prepare-for-a-storm-uk', 'uk-emergency-grab-bag-checklist', 'how-much-water-to-store-emergency-uk'],
  'what-to-do-if-you-smell-gas-uk': ['home-fire-safety-uk-checklist', 'uk-emergency-numbers-every-household-should-know', 'uk-emergency-grab-bag-checklist'],
  'home-fire-safety-uk-checklist': ['what-to-do-if-you-smell-gas-uk', 'uk-emergency-numbers-every-household-should-know', 'what-the-uk-prepare-campaign-means-for-your-household'],
  'uk-emergency-numbers-every-household-should-know': ['what-to-do-if-you-smell-gas-uk', 'what-to-do-during-a-power-cut-uk', 'what-the-uk-prepare-campaign-means-for-your-household'],
  'what-the-uk-prepare-campaign-means-for-your-household': ['what-to-put-in-a-uk-emergency-kit', 'uk-emergency-numbers-every-household-should-know', 'cheap-ways-to-prepare-for-emergencies-uk'],
};

// Homepage strip: the broadest guides, plus the seasonal one (swap it out in spring).
export const HOME_GUIDES = [
  'what-to-put-in-a-uk-emergency-kit',
  'how-to-prepare-for-a-power-cut-uk',
  'will-the-uk-have-blackouts-this-winter',
  'how-much-water-to-store-emergency-uk',
];
