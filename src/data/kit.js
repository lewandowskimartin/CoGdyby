// Kreator zestawu awaryjnego — jedyne źródło prawdy dla scenariuszy, pozycji i reguł doboru ilości.
// Odpowiada kształtowi quiz.js: dane tutaj, czysta matematyka w lib/kitBuild.js, markup w components/KitBuilder.astro.
//
// Dobór ilości opiera się na rządowym Poradniku bezpieczeństwa: zapasy na minimum 3 dni
// i co najmniej 3 litry wody pitnej na osobę na dobę. Górna wartość (10 litrów) to nasz zapas
// na gotowanie i podstawową higienę. Pokazujemy to jako zakres.

import { PACK_CONFIG, packHref } from '../config/pack.ts';

export const KIT_PATH = '/kit';

// Limity. Wartości poza nimi są przycinane, a nie odrzucane, więc zniekształcony URL i tak
// daje sensowną listę zamiast strony błędu.
export const LIMITS = {
  adults: { min: 1, max: 12, default: 2 },
  children: { min: 0, max: 12, default: 0 },
  pets: { min: 0, max: 12, default: 0 },
  days: { min: 1, max: 14, default: 3 },
};

export const RATES = {
  waterMinPerPersonPerDay: 3, // litry wody pitnej
  waterComfortPerPersonPerDay: 10, // litry, by też myć się i gotować
  mealsPerPersonPerDay: 3,
  petWaterPerPetPerDay: 1,
};

export const SOURCE = {
  text: 'Według rządowego Poradnika bezpieczeństwa: zapasy na minimum 3 dni i co najmniej 3 litry wody pitnej na osobę na dobę. Wyższa liczba to około 10 litrów na osobę, czyli zapas także na gotowanie i podstawową higienę.',
  url: 'https://www.gov.pl/poradnikbezpieczenstwa',
};

// Scenariusze. `slug` staje się /kit/<slug>, więc każdy ma własną stronę.
export const SCENARIOS = [
  {
    id: 'general',
    label: 'Zestaw na 72 godziny',
    navLabel: 'Domowy zestaw na 72 godziny',
    listNoun: 'zestaw na 72 godziny',
    intro: {
      heading: 'Co obejmuje zestaw na 72 godziny',
      paragraphs: [
      'Większość domowych kłopotów ma zwyczajne przyczyny: wyłączenie prądu, wichura, awaria wodociągu albo kilka dni złej pogody, kiedy trudno dojechać do sklepu. Rządowy Poradnik bezpieczeństwa zaleca zapasy na minimum 3 dni, czyli 72 godziny. Tyle zwykle trwa, zanim służby opanują sytuację lub dotrze pomoc.',
      'Kalkulator zamienia ogólną listę na konkretne ilości dla Twojego domu. Najlepiej widać to na wodzie. Do picia potrzeba co najmniej 3 litrów na osobę na dobę, a z gotowaniem i myciem około 10 litrów. Dla pięcioosobowej rodziny to zupełnie inna liczba butelek niż dla jednej osoby.',
      'Wpisz, ilu dorosłych, dzieci i zwierząt jest w domu. Dostaniesz ilości wody i jedzenia bez gotowania oraz listę rzeczy, takich jak latarki i dokumenty. Pozostałe listy dokładają to, czego dodatkowo wymaga przerwa w prądzie, wichura, mróz, powódź albo plecak ewakuacyjny.',
      'Poradnik bezpieczeństwa jest bezpłatny i warto go przeczytać w całości. Nasz pakiet do druku pomaga w tym, co poradnik zostawia Tobie: spisać własny plan, żeby miejsce spotkania, kontakt do kogoś spoza miasta i numery polis były na papierze, gdy telefon nie działa.',
      ],
    },
    blurb: 'Podstawowy domowy zestaw na wichury, przerwy w prądzie i kłopoty z zakupami. Od niego najlepiej zacząć.',
    h1: 'Przygotuj domowy zestaw awaryjny',
    seoTitle: 'Kalkulator zapasów: zestaw awaryjny na 72 godziny dla Twojego domu',
    guide: '/blog/what-to-put-in-a-uk-emergency-kit/',
    guideLabel: 'Co włożyć do zestawu awaryjnego',
    seoDescription:
      'Policz zapasy na 72 godziny dla swojej rodziny w trzech krokach: woda, jedzenie bez gotowania i najważniejsze rzeczy. Na podstawie rządowego Poradnika bezpieczeństwa.',
  },
  {
    id: 'power-cut',
    slug: 'power-cut',
    label: 'Przerwa w prądzie',
    navLabel: 'Zestaw na przerwę w prądzie',
    listNoun: 'zestaw na przerwę w prądzie',
    intro: {
      heading: 'Światło, ciepło i naładowany telefon',
      paragraphs: [
      'Gdy wyłączą prąd, znikają naraz trzy rzeczy: światło, ciepło i możliwość naładowania telefonu. Dwie latarki z zapasowymi bateriami, naładowany power bank i ciepła warstwa ubrania wystarczą na większość wieczorów po ciemku.',
      'Zanim zaczniesz szukać usterki, sprawdź, czy prąd zniknął tylko u Ciebie. Jeśli sąsiedzi też nie mają prądu, zgłoś awarię na pogotowie energetyczne 991. Operator sieci podaje też informacje o awariach na swojej stronie. Do oświetlenia używaj latarek, nie świec. To zalecenie straży pożarnej.',
      'Jedzenie potrafi zaskoczyć, bo płyta, piekarnik, mikrofalówka i czajnik przestają działać jednocześnie. Ta lista opiera się na tym, co da się zjeść prosto z puszki lub opakowania. Termos napełniony wcześniej gorącą wodą przyda się bardziej niż cokolwiek z zamrażarki.',
      'Jeśli ktoś w domu korzysta ze sprzętu medycznego na prąd, zaplanuj, co zrobić, gdy wyczerpie się bateria, i zapisz się na powiadomienia o planowanych wyłączeniach u swojego operatora sieci. Latarki, koce i posiłki liczymy na osobę, a radio jedno na dom, dlatego kalkulator pyta o liczbę domowników.',
      ],
    },
    blurb: 'Światło, ciepło, naładowany telefon i jedzenie bez gotowania.',
    h1: 'Przygotuj zestaw na przerwę w prądzie',
    seoTitle: 'Zestaw na przerwę w prądzie: co trzymać w domu na blackout',
    seoDescription:
      'Lista na przerwę w prądzie dla Twojej rodziny: światło, ciepło, ładowanie telefonu i jedzenie bez gotowania. Na podstawie rządowego Poradnika bezpieczeństwa.',
    guide: '/blog/how-to-prepare-for-a-power-cut-uk/',
    guideLabel: 'Jak przygotować się na przerwę w prądzie',
  },
  {
    id: 'storm',
    slug: 'storm',
    label: 'Wichura i burza',
    navLabel: 'Zestaw na wichurę',
    listNoun: 'zestaw na wichurę',
    intro: {
      heading: 'Wykorzystaj czas po ostrzeżeniu',
      paragraphs: [
      'Przed wichurą zwykle jest dzień lub dwa na przygotowanie. IMGW wydaje ostrzeżenia z wyprzedzeniem, więc prace na zewnątrz można zrobić jeszcze za dnia. Dlatego ta lista ma dwie części: co zrobić przed wichurą i co mieć w domu, gdy zabraknie prądu.',
      'Część zewnętrzna to zadania, a nie zakupy. Schowaj lub przywiąż meble ogrodowe i kosze, przymocuj trampolinę, zamknij drzwi garażu i komórki, sprawdź luźne elementy ogrodzenia. Samochód przestaw w miejsce z dala od dużych drzew.',
      'W domu najbardziej zaskakuje zimno. Piec gazowy potrzebuje prądu do pompy i sterowania, więc bez prądu kaloryfery stygną. Napełnij termosy i termofory, póki czajnik działa, i przygotuj koce.',
      'Te dwie części liczy się inaczej. Ciepłe ubrania, napoje i latarki zależą od liczby domowników, a prace w ogrodzie są takie same dla każdego. Kalkulator pokazuje je osobno, żeby pół godziny przed wichurą nie trzeba było czytać jednej długiej listy.',
      ],
    },
    blurb: 'Przerwy w prądzie, gdy nie działa ogrzewanie, i to, co trzeba zabezpieczyć na zewnątrz przed wichurą.',
    h1: 'Przygotuj zestaw na wichurę',
    seoTitle: 'Jak przygotować dom na wichurę: lista rzeczy i zadań',
    seoDescription:
      'Lista na wichurę dla Twojego domu: co zrobić przed nawałnicą i co mieć pod ręką, gdy zabraknie prądu. Na podstawie rządowego Poradnika bezpieczeństwa.',
    guide: '/blog/how-to-prepare-for-a-storm-uk/',
    guideLabel: 'Jak przygotować się na wichurę',
  },
  {
    id: 'flood',
    slug: 'flood',
    label: 'Powódź',
    navLabel: 'Zestaw na powódź',
    listNoun: 'zestaw na powódź',
    intro: {
      heading: 'Najpierw ostrzeżenia, potem przeniesienie rzeczy wyżej',
      paragraphs: [
      'Zacznij od ostrzeżeń, bo nic nie kosztują. Alert RCB przychodzi SMS-em na telefony w zagrożonym rejonie, a aplikacja RSO i strona IMGW pokazują ostrzeżenia hydrologiczne dla Twojego powiatu. Ostrzeżenia IMGW mają trzy stopnie: im wyższy, tym większe zagrożenie.',
      'Już teraz zdecyduj, co przeniesiesz na piętro lub wyżej, bo w nocy i w pośpiechu to dużo trudniejsze. Dokumenty, polisy, pamiątkowe zdjęcia i ładowarki zmieszczą się w jednym plastikowym pojemniku z pokrywą, który jedna osoba przeniesie za jednym razem.',
      'Jeśli woda wchodzi do domu, liczą się instalacje. Sprawdź wcześniej, gdzie jest tablica z bezpiecznikami i zawór gazu, i wyłącz je, zanim woda dojdzie do gniazdek. Woda powodziowa jest brudna, dlatego kalosze, gumowe rękawice i czysta woda butelkowana są na tej liście szczególnie ważne.',
      'O zwierzętach łatwo zapomnieć. Przygotuj transporter, smycz, karmę na kilka dni i suche miejsce na piętrze. Kalkulator osobno liczy też dzieci, bo zapasowe suche ubrania i buty kończą się jako pierwsze, gdy woda zaleje parter.',
      ],
    },
    blurb: 'Ostrzeżenia, przeniesienie najważniejszych rzeczy wyżej i to, czego potrzeba, gdy woda wejdzie do domu.',
    h1: 'Przygotuj zestaw na powódź',
    seoTitle: 'Jak przygotować dom na powódź: lista rzeczy i ostrzeżenia',
    seoDescription:
      'Lista na powódź dla Twojego domu: ostrzeżenia, które warto włączyć, i rzeczy do przeniesienia wyżej. Na podstawie rządowego Poradnika bezpieczeństwa.',
    guide: '/blog/what-to-do-in-a-flood-uk/',
    guideLabel: 'Co robić przed powodzią, w jej trakcie i po niej',
  },
  {
    id: 'cold-snap',
    slug: 'cold-snap',
    label: 'Śnieg i mróz',
    navLabel: 'Zestaw na śnieg i mróz',
    listNoun: 'zestaw na mróz',
    intro: {
      heading: 'Ciepłe pokoje i zapasy w szafce',
      paragraphs: [
      'Mróz rzadko przychodzi jako jedno nagłe zdarzenie. Częściej to kilka dni, kiedy chodniki są oblodzone, autobusy się spóźniają, a do sklepu nie chce się wychodzić. Warto mieć wtedy w domu zapas jedzenia i leków, żeby nie trzeba było nigdzie jechać.',
      'Najważniejsze jest ciepło. Ogrzej pokoje, w których spędzacie najwięcej czasu, na przykład salon i sypialnię, i ubieraj się na cebulkę. Jeśli zawiedzie piec albo zabraknie prądu, koce, termofory i termos z gorącą wodą pomogą przetrwać wieczór.',
      'O rurach pamięta się zwykle dopiero wtedy, gdy któraś zamarznie. Sprawdź teraz, gdzie jest główny zawór wody (najczęściej przy wodomierzu) i czy łatwo się zakręca. Zamarzniętą rurę rozmrażaj powoli, ciepłymi ręcznikami lub termoforem, nigdy otwartym ogniem. Zimą piec pracuje najwięcej, więc to dobry moment, żeby sprawdzić czujnik tlenku węgla.',
      'Pomyśl też o innych. Starsi sąsiedzi i bliscy najmocniej odczuwają zimno, a codzienny telefon to prosta i realna pomoc. Śledź ostrzeżenia IMGW. Koce, gorące napoje i posiłki zależą od liczby domowników, dlatego kalkulator pyta, kto mieszka z Tobą.',
      ],
    },
    blurb: 'Jak utrzymać ciepło w domu i mieć zapasy na dni, gdy na oblodzone chodniki lepiej nie wychodzić.',
    h1: 'Przygotuj zestaw na mróz',
    seoTitle: 'Jak przygotować dom na mróz i śnieżycę: lista zapasów',
    seoDescription:
      'Lista na mróz dla Twojego domu: ciepło, jedzenie i leki na dni bez wychodzenia oraz co zrobić z zamarzniętą rurą. Na podstawie rządowego Poradnika bezpieczeństwa.',
  },
  {
    id: 'water-outage',
    slug: 'water-outage',
    label: 'Brak wody',
    navLabel: 'Zestaw na wypadek braku wody',
    listNoun: 'zestaw na brak wody',
    intro: {
      heading: 'Picie, mycie i spłukiwanie toalety bez wody z kranu',
      paragraphs: [
      'Większość przerw w dostawie wody jest krótka i lokalna: awaria wodociągu, planowany remont albo zamarznięte rury zimą. Gdy przerwa trwa dłużej niż kilka godzin, kłopotem staje się mycie rąk, przygotowanie jedzenia i spłukiwanie toalety.',
      'Liczymy dwie wartości. Co najmniej 3 litry wody pitnej na osobę na dobę to minimum z Poradnika bezpieczeństwa. Około 10 litrów na osobę pozwala też ugotować coś prostego i się umyć. Kalkulator pokazuje obie liczby dla Twojego domu, więc od razu widać, ile to butelek.',
      'Wodę butelkowaną zostaw do picia, mycia rąk, gotowania i przygotowania mleka dla niemowlęcia. Jeśli nie da się przegotować wody, lepiej sprawdzi się gotowe mleko modyfikowane w płynie. Do mycia wystarczy miska z wodą i mydłem. Deszczówka nadaje się do spłukiwania toalety, ale nie do picia.',
      'Numer alarmowy wodociągów znajdziesz na rachunku lub pod numerem 994. Przy dłuższej przerwie wodociągi lub gmina ustawiają beczkowozy i podają, gdzie można nabrać wody. Przygotuj czyste kanistry lub butelki z zakrętką, w których ją przyniesiesz.',
      ],
    },
    blurb: 'Awaria wodociągu albo zamarznięta instalacja. Woda do picia, mycia i spłukiwania toalety, zanim wróci w kranie.',
    h1: 'Przygotuj zestaw na brak wody',
    seoTitle: 'Brak wody w kranie: ile wody trzymać i co przygotować',
    seoDescription:
      'Lista na brak wody dla Twojej rodziny: woda do picia, mycie i spłukiwanie toalety bez kranu oraz numery, pod które warto dzwonić. Na podstawie rządowego Poradnika bezpieczeństwa.',
    guide: '/blog/how-much-water-to-store-emergency-uk/',
    guideLabel: 'Ile wody trzymać w domu na wypadek kryzysu',
  },
  {
    id: 'grab-bag',
    slug: 'grab-bag',
    label: 'Szybkie wyjście z domu',
    navLabel: 'Plecak ewakuacyjny',
    listNoun: 'plecak ewakuacyjny',
    intro: {
      heading: 'Plecak przy drzwiach, spakowany raz',
      paragraphs: [
      'Ten plecak pakuje się raz i odstawia na miejsce. Stoi przy drzwiach wejściowych lub w szafie w przedpokoju, jest na tyle lekki, żeby jedna osoba od razu go podniosła, i mieści to, co przyda się, gdy trzeba wyjść z domu w kilka minut.',
      'Takie sytuacje zdarzają się rzadko i zwykle wiadomo, o co chodzi. Najczęstsza to podejrzenie wycieku gazu: otwórz okna, wyjdź bez dotykania włączników i zadzwoń na pogotowie gazowe 992 dopiero na zewnątrz. Druga to woda, która przybiera szybciej, niż zapowiadano.',
      'Do środka trafiają rzeczy, których nie da się szybko zastąpić. Kopie dokumentów tożsamości i polis, leki, kabel do ładowania, naładowany power bank i zapasowe klucze. Dołóż kartkę z najważniejszymi numerami i trochę gotówki w drobnych nominałach, bo terminale nie działają bez prądu.',
      'Z dziećmi i zwierzętami plecak wygląda inaczej. Dla dziecka warto spakować ulubioną przytulankę lub małą zabawkę, dla psa lub kota smycz, transporter i karmę. Przeglądaj plecak przy zmianie czasu, wymieniaj to, co się przeterminowało, i odkładaj go na miejsce.',
      ],
    },
    blurb: 'Plecak przy drzwiach na rzadką sytuację, gdy trzeba szybko wyjść, na przykład przy wycieku gazu albo powodzi.',
    h1: 'Przygotuj plecak ewakuacyjny',
    seoTitle: 'Plecak ewakuacyjny: co spakować dla całej rodziny',
    seoDescription:
      'Lista do plecaka ewakuacyjnego dla Twojej rodziny, na wypadek, gdy trzeba szybko wyjść z domu. Na podstawie rządowego Poradnika bezpieczeństwa.',
    guide: '/blog/uk-emergency-grab-bag-checklist/',
    guideLabel: 'Jak spakować plecak ewakuacyjny',
  },
];

export const DEFAULT_SCENARIO = 'general';

// Odznaka „Sugerowane teraz” na kartach scenariuszy, wg miesiąca (1 = styczeń).
// Liczone w przeglądarce, więc podąża za realną datą, nie datą builda.
export const SUGGESTED_BY_MONTH = {
  1: 'cold-snap',
  2: 'cold-snap',
  3: 'storm',
  10: 'storm',
  11: 'cold-snap',
  12: 'cold-snap',
};

// Który poradnik odpowiada któremu zestawowi i dokąd prowadzi jego kit CTA.
export const POST_KITS = {
  'what-to-put-in-a-uk-emergency-kit': { scenario: 'general', inline: true },
  'uk-emergency-grab-bag-checklist': { scenario: 'grab-bag', inline: true },
  'how-much-water-to-store-emergency-uk': { scenario: 'general', inline: true },
  'how-to-prepare-for-a-power-cut-uk': { scenario: 'power-cut', inline: true },
  'emergency-food-supply-uk-budget': {
    scenario: 'general',
    inline: false,
    title: 'Ile posiłków potrzeba w Twoim domu?',
  },
  'cheap-ways-to-prepare-for-emergencies-uk': {
    scenario: 'general',
    inline: false,
    title: 'Czego brakuje w Twojej spiżarce?',
  },
  'how-to-prepare-for-a-storm-uk': { scenario: 'storm', inline: false },
  'what-to-do-in-a-flood-uk': { scenario: 'flood', inline: false },
  'will-the-uk-have-blackouts-this-winter': { scenario: 'power-cut', inline: false },
};

// Pytania quizu, których luka to luka w zapasach, i zestaw, który ją domyka.
export const GAP_KITS = {
  q3: 'general',
  q4: 'general',
  q5: 'power-cut',
  q7: 'grab-bag',
};

/** Ścieżka /kit dla danego scenariusza, z opcjonalnymi parametrami domu. */
export function kitHref(scenario = DEFAULT_SCENARIO, params = '') {
  const entry = SCENARIOS.find((s) => s.id === scenario);
  const base = entry?.slug ? `${KIT_PATH}/${entry.slug}/` : `${KIT_PATH}/`;
  return params ? `${base}?${params}` : base;
}

// Pozycje.
//   scenarios: 'all' lub lista id scenariuszy.
//   needs:     'children' | 'pets' | 'medical' — pokazywane tylko, gdy dom je ma.
//   affiliate: id z data/affiliateLinks.js.
//   guide:     istniejący poradnik na stronie.
//   qty:       funkcja policzonych sum, dla linii, gdzie liczba pomaga.
export const ITEMS = [
  {
    id: 'water',
    name: 'Woda butelkowana',
    why: 'Niższa liczba to woda do picia, wyższa wystarczy też do gotowania i mycia. Przechowuj ją w chłodnym, ciemnym miejscu.',
    scenarios: 'all',
    affiliate: 'water',
    guide: '/blog/how-much-water-to-store-emergency-uk/',
    qty: (t) => `${t.waterMin}–${t.waterComfort} litrów`,
  },
  {
    id: 'food',
    name: 'Jedzenie bez gotowania',
    why: 'Konserwy i produkty z długim terminem, które domownicy naprawdę lubią i które da się zjeść bez podgrzewania.',
    scenarios: 'all',
    affiliate: 'tins',
    guide: '/blog/emergency-food-supply-uk-budget/',
    qty: (t) => `${t.meals} posiłków`,
  },
  {
    id: 'tinopener',
    name: 'Ręczny otwieracz do konserw',
    why: 'Łatwo o nim zapomnieć, a bez niego część konserw trudno otworzyć.',
    scenarios: 'all',
    affiliate: 'tinopener',
  },
  {
    id: 'torch',
    name: 'Latarka i zapasowe baterie',
    why: 'Najlepiej po jednej na osobę. Latarka jest bezpieczniejsza niż świece.',
    scenarios: 'all',
    affiliate: 'torch',
    qty: (t) => `${t.people}, jeśli się da`,
  },
  {
    id: 'powerbank',
    name: 'Naładowany power bank',
    why: 'Pozwala dzwonić, odbierać wiadomości i alerty. Doładowuj go co kilka miesięcy.',
    scenarios: 'all',
    affiliate: 'powerbank',
  },
  {
    id: 'radio',
    name: 'Radio na baterie lub na korbkę',
    why: 'Radio działa nawet wtedy, gdy nie ma prądu ani zasięgu. Poradnik bezpieczeństwa zaleca, by mieć je w domu.',
    scenarios: 'all',
    affiliate: 'radio',
  },
  {
    id: 'firstaid',
    name: 'Apteczka',
    why: 'Plastry, bandaże, środek do dezynfekcji oraz leki, których domownicy używają na co dzień.',
    scenarios: 'all',
    affiliate: 'firstaid',
  },
  {
    id: 'medicines',
    name: 'Zapas stałych leków na kilka dni',
    why: 'Miej w domu kilka dodatkowych dawek i sprawdzaj daty ważności przy zmianie czasu.',
    scenarios: 'all',
  },
  {
    id: 'numbers',
    name: 'Najważniejsze numery na papierze',
    why: 'Numer alarmowy 112, pogotowie energetyczne 991, gazowe 992, ciepłownicze 993 i wodociągowe 994. Do tego przychodnia, ubezpieczyciel i sąsiad.',
    scenarios: 'all',
    guide: '/blog/uk-emergency-numbers-every-household-should-know/',
  },
  {
    id: 'warmth',
    name: 'Ciepłe ubrania i koce',
    why: 'Gdy nie działa ogrzewanie, ciepło kończy się najszybciej. Czapki i grube skarpety naprawdę pomagają.',
    scenarios: ['general', 'power-cut', 'storm', 'cold-snap'],
  },
  {
    id: 'flask',
    name: 'Termos',
    why: 'Napełniony, zanim zabraknie prądu, da gorącą herbatę jeszcze przez wiele godzin.',
    scenarios: ['power-cut', 'storm', 'cold-snap'],
  },
  {
    id: 'documents',
    name: 'Dokumenty w jednej teczce',
    why: 'Dowody osobiste, polisy i akty urodzenia (albo ich kopie) w jednym miejscu, żeby zabrać je za jednym razem.',
    scenarios: ['general', 'flood', 'grab-bag'],
  },
  {
    id: 'cash',
    name: 'Gotówka w drobnych nominałach',
    why: 'Terminale i bankomaty nie działają bez prądu. Niewielka kwota wystarczy na dzień lub dwa.',
    scenarios: ['general', 'power-cut', 'storm', 'grab-bag'],
  },
  {
    id: 'outside',
    name: 'Zabezpieczenie rzeczy na zewnątrz',
    why: 'Kosze, trampoliny i meble ogrodowe mogą narobić szkód w czasie wichury. Zabezpiecz je wcześniej.',
    scenarios: ['storm'],
  },
  {
    id: 'upstairs',
    name: 'Plan, co przenieść wyżej',
    why: 'Ustalcie teraz, co trafia na piętro i kto to przenosi, żeby nie decydować o tym po ciemku.',
    scenarios: ['flood'],
    guide: '/blog/what-to-do-in-a-flood-uk/',
  },
  {
    id: 'floodwarnings',
    name: 'Ostrzeżenia powodziowe dla Twojego powiatu',
    why: 'Zainstaluj aplikację RSO i sprawdzaj ostrzeżenia hydrologiczne IMGW. Alert RCB przyjdzie SMS-em automatycznie.',
    scenarios: ['flood'],
  },
  {
    id: 'stoptap',
    name: 'Główny zawór wody',
    why: 'Zwykle jest przy wodomierzu. Sprawdź, czy łatwo się zakręca, żeby szybko odciąć wodę, gdy rura zamarznie lub pęknie.',
    scenarios: ['cold-snap'],
  },
  {
    id: 'coalarm',
    name: 'Sprawny czujnik tlenku węgla (czadu)',
    why: 'Zimą piec pracuje najwięcej. Naciśnij przycisk testu, a jeśli minął termin przeglądu pieca, umów serwis.',
    scenarios: ['cold-snap'],
  },
  {
    id: 'carkit',
    name: 'Zimowy zestaw w samochodzie',
    why: 'Koc, skrobaczka, latarka i ładowarka do telefonu na wypadek, gdyby trzeba było długo czekać na drodze.',
    scenarios: ['cold-snap'],
  },
  {
    id: 'checkin',
    name: 'Ktoś, do kogo zadzwonisz',
    why: 'Starszy sąsiad lub ktoś bliski, kto mieszka sam. Ustalcie, kto do kogo dzwoni codziennie, dopóki trzyma mróz.',
    scenarios: ['cold-snap'],
  },
  {
    id: 'handwash',
    name: 'Żel do rąk i miska',
    why: 'Do mycia bez wody z kranu wystarczy miska z wodą i mydłem albo żel antybakteryjny.',
    scenarios: ['water-outage'],
  },
  {
    id: 'flushing',
    name: 'Woda do spłukiwania toalety',
    why: 'Nie bierz jej z zapasu do picia. Wystarczy wiadro deszczówki albo woda nalana do wanny przed przerwą.',
    scenarios: ['water-outage'],
  },
  {
    id: 'watercompany',
    name: 'Numer do wodociągów',
    why: 'Jest na rachunku. Awarię zgłosisz też pod numerem 994. Wodociągi podają na stronie informacje o przerwach.',
    scenarios: ['water-outage'],
  },
  {
    id: 'psr-water',
    name: 'Kanistry na wodę z beczkowozu',
    why: 'Przy dłuższej awarii wodociągi lub gmina ustawiają beczkowozy. Czyste kanistry lub butelki z zakrętką ułatwią przyniesienie wody.',
    scenarios: ['water-outage'],
  },
  {
    id: 'babies',
    name: 'Rzeczy dla niemowląt i małych dzieci',
    why: 'Pieluchy, gotowe mleko modyfikowane w płynie, chusteczki i sposób na wyparzenie butelek bez prądu.',
    scenarios: 'all',
    needs: 'children',
  },
  {
    id: 'pets',
    name: 'Karma, woda i leki dla zwierząt',
    why: 'Zapas karmy i leków na kilka dni trzymaj razem z resztą zapasów.',
    scenarios: 'all',
    needs: 'pets',
    qty: (t) => `${t.petWater} l wody`,
  },
  {
    id: 'psr',
    name: 'Powiadomienia o wyłączeniach prądu',
    why: 'Większość operatorów sieci wysyła bezpłatne SMS-y lub maile o planowanych wyłączeniach. Zapisz się na stronie swojego operatora.',
    scenarios: 'all',
    needs: 'medical',
    guide: '/blog/priority-services-register-uk-explained/',
  },
  {
    id: 'backup-power',
    name: 'Plan dla sprzętu medycznego bez prądu',
    why: 'Sprawdź, jak długo sprzęt działa na baterii, zapisz, co zrobić, gdy się rozładuje, i zapytaj dostawcę sprzętu o zasilanie zastępcze.',
    scenarios: 'all',
    needs: 'medical',
  },
  {
    id: 'grabbag',
    name: 'Plecak ewakuacyjny przy drzwiach',
    why: 'Spakowany plecak z najpotrzebniejszymi rzeczami na wypadek, gdyby trzeba było szybko wyjść.',
    scenarios: ['general', 'power-cut', 'storm', 'flood'],
    guide: '/blog/uk-emergency-grab-bag-checklist/',
  },
];

// Szczera linia nad linkami do zakupów. Celowo krótka.
export const SHOP = {
  heading: 'Kupuj tylko to, czego brakuje',
  text: 'Większość tych rzeczy pewnie już masz, a latarka czy konserwy z szafki są tak samo dobre jak nowe. Lista pokazuje, czego brakuje. Przy brakujących rzeczach podajemy linki do produktów, z których sami korzystamy.',
};

export const PACK = {
  url: packHref(),
  price: PACK_CONFIG.PRICE,
  heading: 'Zapasy to połowa. Druga połowa to plan.',
  text: 'Zestaw jest tą łatwiejszą częścią. Pakiet pomaga spisać resztę: kto do kogo dzwoni, gdzie jest główny zawór wody, gdzie leżą dokumenty i co powinien wiedzieć ktoś, kto zostanie z dziećmi, gdy Ciebie nie będzie.',
  includes: [
    '12 stron do druku, które wypełniasz ręcznie',
    'Karta na lodówkę z najważniejszymi numerami',
    'Karty ICE do portfela i lista rzeczy do plecaka ewakuacyjnego',
    'Strona planu dla dzieci',
  ],
  reassurance: 'Plik od razu po zakupie · drukujesz bez limitu · zostaje u Ciebie na zawsze',
  fallbackUrl: '/free-emergency-plan-template/',
  fallbackLabel: 'Pobierz darmową kartę na lodówkę',
};

export const EMAIL_FORM = {
  action: import.meta.env?.PUBLIC_MAILERLITE_ACTION ?? '',
};
