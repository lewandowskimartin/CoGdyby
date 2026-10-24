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
      'poradnik-bezpieczenstwa-w-pigulce',
      'numery-alarmowe',
      'jak-tanio-przygotowac-dom',
      'domowe-umiejetnosci',
    ],
  },
  {
    title: 'Przerwy w prądzie i zima',
    slugs: [
      'lista-na-blackout',
      'telefon-i-internet-bez-pradu',
      'jak-przygotowac-dom-na-przerwe-w-pradzie',
      'co-robic-podczas-przerwy-w-pradzie',
      'czy-grozi-blackout',
      'sprzet-medyczny-a-przerwa-w-pradzie',
    ],
  },
  {
    title: 'Wichury, powodzie, gaz i pożar',
    slugs: [
      'jak-przygotowac-dom-na-wichure',
      'co-robic-podczas-powodzi',
      'co-robic-gdy-czujesz-gaz',
      'bezpieczenstwo-pozarowe-w-domu',
    ],
  },
  {
    title: 'Zapasy, woda i plecak ewakuacyjny',
    slugs: [
      'zestaw-awaryjny-lista-na-72-godziny',
      'plecak-ewakuacyjny-lista',
      'ile-wody-trzymac-w-domu',
      'zapas-jedzenia-na-sytuacje-kryzysowa',
      'plecak-ewakuacyjny-dla-dziecka',
      'apteczka-domowa-lista',
    ],
  },
  {
    title: 'Alarmy, ostrzeżenia i schronienie',
    slugs: [
      'syreny-alarmowe-sygnaly',
      'alert-rcb-jak-dziala',
      'schrony-i-miejsca-ukrycia',
    ],
  },
];

export const RELATED = {
  'telefon-i-internet-bez-pradu': ['jak-przygotowac-dom-na-przerwe-w-pradzie', 'sprzet-medyczny-a-przerwa-w-pradzie', 'numery-alarmowe'],
  'domowe-umiejetnosci': ['jak-tanio-przygotowac-dom', 'zapas-jedzenia-na-sytuacje-kryzysowa', 'zestaw-awaryjny-lista-na-72-godziny'],
  'lista-na-blackout': ['jak-przygotowac-dom-na-przerwe-w-pradzie', 'co-robic-podczas-przerwy-w-pradzie', 'zestaw-awaryjny-lista-na-72-godziny'],
  'zestaw-awaryjny-lista-na-72-godziny': ['plecak-ewakuacyjny-lista', 'ile-wody-trzymac-w-domu', 'zapas-jedzenia-na-sytuacje-kryzysowa'],
  'plecak-ewakuacyjny-lista': ['plecak-ewakuacyjny-dla-dziecka', 'apteczka-domowa-lista', 'zestaw-awaryjny-lista-na-72-godziny'],
  'ile-wody-trzymac-w-domu': ['zapas-jedzenia-na-sytuacje-kryzysowa', 'zestaw-awaryjny-lista-na-72-godziny', 'jak-tanio-przygotowac-dom'],
  'zapas-jedzenia-na-sytuacje-kryzysowa': ['ile-wody-trzymac-w-domu', 'jak-tanio-przygotowac-dom', 'co-robic-podczas-przerwy-w-pradzie'],
  'jak-tanio-przygotowac-dom': ['zestaw-awaryjny-lista-na-72-godziny', 'zapas-jedzenia-na-sytuacje-kryzysowa', 'poradnik-bezpieczenstwa-w-pigulce'],
  'jak-przygotowac-dom-na-przerwe-w-pradzie': ['co-robic-podczas-przerwy-w-pradzie', 'czy-grozi-blackout', 'sprzet-medyczny-a-przerwa-w-pradzie'],
  'co-robic-podczas-przerwy-w-pradzie': ['jak-przygotowac-dom-na-przerwe-w-pradzie', 'czy-grozi-blackout', 'zapas-jedzenia-na-sytuacje-kryzysowa'],
  'czy-grozi-blackout': ['jak-przygotowac-dom-na-przerwe-w-pradzie', 'co-robic-podczas-przerwy-w-pradzie', 'jak-przygotowac-dom-na-wichure'],
  'sprzet-medyczny-a-przerwa-w-pradzie': ['jak-przygotowac-dom-na-przerwe-w-pradzie', 'czy-grozi-blackout', 'numery-alarmowe'],
  'jak-przygotowac-dom-na-wichure': ['jak-przygotowac-dom-na-przerwe-w-pradzie', 'co-robic-podczas-powodzi', 'plecak-ewakuacyjny-lista'],
  'co-robic-podczas-powodzi': ['jak-przygotowac-dom-na-wichure', 'plecak-ewakuacyjny-lista', 'ile-wody-trzymac-w-domu'],
  'co-robic-gdy-czujesz-gaz': ['bezpieczenstwo-pozarowe-w-domu', 'numery-alarmowe', 'plecak-ewakuacyjny-lista'],
  'bezpieczenstwo-pozarowe-w-domu': ['co-robic-gdy-czujesz-gaz', 'numery-alarmowe', 'poradnik-bezpieczenstwa-w-pigulce'],
  'numery-alarmowe': ['syreny-alarmowe-sygnaly', 'alert-rcb-jak-dziala', 'co-robic-gdy-czujesz-gaz'],
  'poradnik-bezpieczenstwa-w-pigulce': ['zestaw-awaryjny-lista-na-72-godziny', 'syreny-alarmowe-sygnaly', 'numery-alarmowe'],
  'syreny-alarmowe-sygnaly': ['alert-rcb-jak-dziala', 'schrony-i-miejsca-ukrycia', 'numery-alarmowe'],
  'alert-rcb-jak-dziala': ['syreny-alarmowe-sygnaly', 'jak-przygotowac-dom-na-wichure', 'numery-alarmowe'],
  'schrony-i-miejsca-ukrycia': ['syreny-alarmowe-sygnaly', 'plecak-ewakuacyjny-lista', 'plecak-ewakuacyjny-dla-dziecka'],
  'plecak-ewakuacyjny-dla-dziecka': ['plecak-ewakuacyjny-lista', 'apteczka-domowa-lista', 'schrony-i-miejsca-ukrycia'],
  'apteczka-domowa-lista': ['plecak-ewakuacyjny-lista', 'plecak-ewakuacyjny-dla-dziecka', 'numery-alarmowe'],
};

// Homepage strip: the broadest guides, plus the seasonal one (swap it out in spring).
export const HOME_GUIDES = [
  'zestaw-awaryjny-lista-na-72-godziny',
  'jak-przygotowac-dom-na-przerwe-w-pradzie',
  'czy-grozi-blackout',
  'ile-wody-trzymac-w-domu',
];
