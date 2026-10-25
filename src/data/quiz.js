// Quiz gotowości — jedyne źródło prawdy dla pytań, profilu domu, progów punktacji i CTA.
// Najpierw kilka pytań o dom (PROFILE, bez punktów), potem pytania punktowane (QUESTIONS).
// Kolejność QUESTIONS = kolejność wyświetlania. Kolejność AREAS = priorytet rozstrzygania remisów
// dla „najsłabszego obszaru” i braków. Punkty: indeks opcji 0, 1, 2. Wynik = procent zdobytych
// punktów z pytań, które padły (pytania warunkowe, np. o zwierzęta, liczą się tylko tam, gdzie pasują).
// Treść pytań i porad oparta na rządowym Poradniku bezpieczeństwa (wyd. 1/2025):
// https://www.gov.pl/poradnikbezpieczenstwa

export const QUIZ_PATH = '/quiz/'; // trailing slash: the host redirects the bare path
export const RESULTS_PATH = '/quiz/wynik/';

// Oferta pakietu na stronie wyników. Link do kasy jest w src/config/pack.ts.
import { PACK_CONFIG, packHref } from '../config/pack.ts';

export const PACK = {
  url: packHref(),
  price: PACK_CONFIG.PRICE,
  includes: [
    '12 stron do druku, które wypełniasz ręcznie',
    'Karta na lodówkę z najważniejszymi numerami',
    'Karty ICE do portfela i lista rzeczy do plecaka ewakuacyjnego',
    'Strona planu dla dzieci',
  ],
  reassurance: 'Plik od razu po zakupie · drukujesz bez limitu · zostaje u Ciebie na zawsze',
  fallbackUrl: '/darmowa-karta/',
  fallbackLabel: 'Pobierz darmową kartę na lodówkę',
};

// Adres akcji formularza MailerLite, z PUBLIC_MAILERLITE_ACTION lub wklejony tutaj.
// Pusty = krok z e-mailem jest ukryty.
export const EMAIL_FORM = {
  action: import.meta.env?.PUBLIC_MAILERLITE_ACTION ?? '',
};

// Szacowany czas, pokazywany w zapowiedziach quizu w całym serwisie.
export const QUIZ_MINUTES = 'około 4 minut';

// ---- Profil domu: bez punktów, zmienia treść pytań i porad ----
// Zapisywany w adresie wyników jako ?p= (np. „f3-kp”): rodzaj domu, liczba osób, woda, kto mieszka.
// Województwo osobno jako ?r=<slug>. Nic z tego nie opuszcza przeglądarki, chyba że ktoś
// wyśle sobie link e-mailem (wtedy bez flag „s” i „c”, patrz wynik.astro).
export const PROFILE_STEPS = [
  {
    id: 'home',
    type: 'radio',
    text: 'Gdzie mieszkasz?',
    options: [
      { id: 'f', label: 'W mieszkaniu w bloku lub kamienicy', short: 'Mieszkanie' },
      { id: 't', label: 'W domu w mieście lub na przedmieściach', short: 'Dom w mieście' },
      { id: 'v', label: 'W domu na wsi', short: 'Dom na wsi' },
    ],
  },
  {
    id: 'people',
    type: 'radio',
    layout: 'grid',
    text: 'Ile osób mieszka w Twoim domu, razem z Tobą?',
    options: [
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
      { id: '6', label: '6 lub więcej' },
    ],
  },
  {
    id: 'who',
    type: 'checkbox',
    text: 'Kto lub co jest w Twoim domu?',
    hint: 'Zaznacz wszystko, co pasuje.',
    options: [
      { id: 'k', label: 'Dzieci', short: 'dzieci' },
      { id: 's', label: 'Osoba starsza, chora lub z niepełnosprawnością', short: 'osoba potrzebująca pomocy' },
      { id: 'p', label: 'Zwierzęta domowe', short: 'zwierzęta' },
      { id: 'c', label: 'Opiekuję się kimś, kto mieszka osobno', short: 'opieka nad kimś bliskim' },
      // Wyklucza pozostałe. Nie trafia do kodu profilu: pusta lista „kto” znaczy to samo.
      { id: 'n', label: 'Nikt z powyższych', labelAlone: 'Tylko ja', exclusive: true },
    ],
  },
  {
    id: 'water',
    type: 'radio',
    askIf: ['house'],
    text: 'Skąd masz wodę w kranie?',
    options: [
      { id: 'm', label: 'Z wodociągu' },
      { id: 'w', label: 'Ze studni lub z własnego ujęcia' },
      { id: '-', label: 'Nie wiem' },
    ],
  },
  {
    id: 'region',
    type: 'select',
    text: 'W jakim województwie mieszkasz?',
    hint: 'Pokażemy zagrożenia typowe dla Twojej okolicy. Możesz pominąć to pytanie.',
    placeholder: 'Wolę nie podawać',
  },
];

// Slugi = nazwy plików w src/content/local/. Link do strony lokalnej pokazujemy tylko,
// gdy strona jest opublikowana (sprawdza wynik.astro).
export const REGIONS = [
  { id: 'dolnoslaskie', label: 'dolnośląskie' },
  { id: 'kujawsko-pomorskie', label: 'kujawsko-pomorskie' },
  { id: 'lubelskie', label: 'lubelskie' },
  { id: 'lubuskie', label: 'lubuskie' },
  { id: 'lodzkie', label: 'łódzkie' },
  { id: 'malopolskie', label: 'małopolskie' },
  { id: 'mazowieckie', label: 'mazowieckie' },
  { id: 'opolskie', label: 'opolskie' },
  { id: 'podkarpackie', label: 'podkarpackie' },
  { id: 'podlaskie', label: 'podlaskie' },
  { id: 'pomorskie', label: 'pomorskie' },
  { id: 'slaskie', label: 'śląskie' },
  { id: 'swietokrzyskie', label: 'świętokrzyskie' },
  { id: 'warminsko-mazurskie', label: 'warmińsko-mazurskie' },
  { id: 'wielkopolskie', label: 'wielkopolskie' },
  { id: 'zachodniopomorskie', label: 'zachodniopomorskie' },
];

// Strony, które pasują do profilu, pokazywane na wynikach w karcie „Przydatne dla Twojego domu”.
export const PROFILE_LINKS = [
  { flag: 'kids', href: '/dla-rodziny/', label: 'Jak przygotować dom, w którym są dzieci' },
  { flag: 'helps', href: '/starsi-rodzice/', label: 'Jak pomóc osobie starszej przygotować się na kryzys' },
];

export const AREAS = [
  { id: 'plan', label: 'Plan na kryzys' },
  { id: 'supplies', label: 'Zapasy' },
  { id: 'power', label: 'Prąd i ciepło' },
  { id: 'fire', label: 'Ogień i czad' },
  { id: 'health', label: 'Zdrowie i leki' },
  { id: 'warnings', label: 'Ostrzeżenia i bliscy' },
  { id: 'leaving', label: 'Szybkie opuszczenie domu' },
];

// Warianty: `when` to lista flag profilu (wszystkie muszą pasować), patrz profileFlags()
// w src/lib/quizScore.js. Pasujące warianty nakładają się po kolei; `extra` dopisuje zdanie do porady.
// `askIf`: pytanie pada tylko, gdy pasuje któraś z flag. Szablony w tekstach: {water}, {packs}, {you}.
// Identyfikatory q1–q10 są stałe: stare linki z wynikami (10 cyfr) wciąż na nich działają.
export const QUESTIONS = [
  // ---- Plan na kryzys ----
  {
    id: 'q1',
    cost: 'free',
    tier: 'week',
    effort: '20 minut',
    area: 'plan',
    text: 'Czy macie spisany plan na sytuację kryzysową, z miejscem spotkania w okolicy i drugim poza miejscowością?',
    options: ['Nie', 'Rozmawialiśmy o tym albo mamy jedno miejsce', 'Tak, spisany, z dwoma miejscami'],
    gap: 'Brak spisanego planu rodzinnego',
    fix: 'Ustalcie dwa miejsca spotkania na wypadek, gdyby nie dało się wrócić do domu: jedno w okolicy, drugie poza miejscowością. Zapiszcie je na kartce razem z tym, kto do kogo dzwoni.',
    packPage: 'Strony z miejscem spotkania i informacjami o domu',
    variants: [
      {
        when: ['alone'],
        text: 'Czy masz spisany plan na sytuację kryzysową i czy bliscy wiedzą, gdzie Cię szukać, gdy nie będzie łączności?',
        options: ['Nie', 'Mniej więcej, ale nic nie jest spisane', 'Tak, plan jest spisany i bliscy go znają'],
        gap: 'Brak spisanego planu na kryzys',
        fix: 'Zapisz na kartce, do kogo dzwonisz i gdzie spotkasz się z bliskimi, jeśli nie będzie łączności: jedno miejsce w okolicy i jedno poza miejscowością. Daj kopię komuś bliskiemu.',
      },
    ],
  },
  {
    id: 'q2',
    cost: 'free',
    tier: 'week',
    effort: '10 minut',
    area: 'plan',
    text: 'Czy najważniejsze numery telefonów są zapisane na papierze, a nie tylko w telefonie?',
    options: ['Nie', 'Niektóre', 'Tak'],
    gap: 'Najważniejsze numery są tylko w telefonie',
    fix: 'Zapisz na kartce pięć numerów: ktoś z rodziny, sąsiad, przychodnia, pogotowie energetyczne i ubezpieczyciel.',
    packPage: 'Strona kontaktów alarmowych i karta na lodówkę',
  },
  {
    id: 'q22',
    askIf: ['kids'],
    cost: 'free',
    tier: 'week',
    effort: '20 minut',
    area: 'plan',
    text: 'Czy dzieci mają przy sobie kartkę z imieniem i numerem do opiekuna i wiedzą, co robić, gdy się zgubią?',
    options: ['Nie', 'Jedno z dwóch', 'Tak, oba'],
    gap: 'Dzieci nie mają przy sobie kontaktu do opiekuna',
    fix: 'Włóż do plecaka lub kurtki każdego dziecka kartkę z imieniem, nazwiskiem i numerem do opiekuna. Porozmawiajcie spokojnie, co robić, gdy dziecko się zgubi: zostać w miejscu i poprosić o pomoc policjanta, strażaka lub ratownika. Zapisz też kontakt do osoby, którą szkoła wyznaczyła do odbioru dzieci w sytuacji zagrożenia.',
    packPage: 'Strona planu dla dzieci',
  },
  {
    id: 'q21',
    askIf: ['senior', 'carer'],
    cost: 'free',
    tier: 'week',
    effort: '30 minut',
    area: 'plan',
    text: 'Czy z osobą starszą lub potrzebującą pomocy jest ustalone, kto do niej przyjdzie, co zabrać i skąd wziąć jej leki?',
    options: ['Nie', 'Mniej więcej', 'Tak, wszystko ustalone'],
    gap: 'Brak ustaleń dla osoby, która potrzebuje pomocy',
    fix: 'Ustalcie razem, kto przychodzi i jak się kontaktujecie, gdy nie działa telefon. Spakujcie jej plecak ewakuacyjny, sprawdźcie zapas leków i baterii do aparatu słuchowego czy sensora cukru. Przy ewakuacji powiedzcie służbom, że ta osoba potrzebuje pomocy.',
    packPage: 'Strona kontaktów alarmowych',
    variants: [
      {
        when: ['alone', 'senior', 'noCarer'],
        text: 'Czy masz ustalone z kimś bliskim, kto do Ciebie przyjdzie w razie problemów, i zapas leków oraz baterii do urządzeń, z których korzystasz?',
        gap: 'Nikt nie jest umówiony, że przyjdzie z pomocą',
        fix: 'Umów się z kimś bliskim lub sąsiadem, że przy dłuższej przerwie w prądzie zajrzy do Ciebie. Trzymaj zapas leków i baterii do urządzeń, z których korzystasz. Przy ewakuacji powiedz służbom, że potrzebujesz pomocy.',
      },
    ],
  },

  // ---- Zapasy ----
  {
    id: 'q3',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'supplies',
    text: 'Czy w domu jest jedzenie na co najmniej 3 dni dla wszystkich domowników, także takie, którego nie trzeba gotować?',
    options: ['Nie', 'Może na jeden dzień', 'Tak, na co najmniej 3 dni'],
    gap: 'Za mało jedzenia, które nie wymaga gotowania',
    fix: 'Przy najbliższych zakupach dołóż po trzy posiłki bez gotowania na osobę (konserwy, pieczywo chrupkie, orzechy, bakalie) i sprawdź, czy w szufladzie jest otwieracz do konserw.',
    packPage: 'Lista zestawu awaryjnego',
    variants: [
      { when: ['alone'], text: 'Czy w domu jest jedzenie na co najmniej 3 dni, także takie, którego nie trzeba gotować?' },
    ],
  },
  {
    id: 'q4',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'supplies',
    text: 'Czy masz w domu zapas wody pitnej: 3 litry na osobę na dobę, na 3 dni?',
    options: ['Nie', 'Trochę', 'Tak, tyle albo więcej'],
    gap: 'Za mały zapas wody pitnej',
    fix: 'Rządowy Poradnik bezpieczeństwa zaleca co najmniej 3 litry wody na osobę na dobę, na minimum 3 dni. Dla trzyosobowej rodziny to około 27 litrów. Zacznij od kilku zgrzewek przy najbliższych zakupach.',
    packPage: 'Lista zestawu awaryjnego',
    variants: [
      {
        when: ['known'],
        text: 'Czy masz w domu co najmniej {water} wody pitnej?',
        hint: 'Tyle wychodzi z zalecenia Poradnika bezpieczeństwa: 3 litry na osobę na dobę, na 3 dni.',
        fix: 'Rządowy Poradnik bezpieczeństwa zaleca co najmniej 3 litry wody na osobę na dobę, na minimum 3 dni. Dla {you} to {water}, czyli mniej więcej {packs} po 6 butelek 1,5 l.',
      },
      {
        when: ['well'],
        extra: 'Pompa w studni działa na prąd, więc przy przerwie w zasilaniu zabraknie też wody do mycia i spłukiwania. Odłóż dodatkowo kilka baniaków wody na te potrzeby.',
      },
    ],
  },
  {
    id: 'q11',
    cost: 'free',
    tier: 'week',
    effort: '10 minut',
    area: 'supplies',
    text: 'Czy masz w domu gotówkę w różnych nominałach, na kilka dni zakupów?',
    options: ['Nie', 'Trochę albo tylko duże banknoty', 'Tak, w różnych nominałach'],
    gap: 'Brak gotówki na wypadek, gdy nie działają karty',
    fix: 'Przy długiej przerwie w prądzie nie zapłacisz kartą ani telefonem, a bankomaty mogą nie działać. Poradnik radzi trzymać w domu gotówkę w różnych nominałach. Przy najbliższej okazji wypłać kwotę na kilka dni zakupów i rozmień część na drobne.',
    packPage: null,
  },

  // ---- Prąd i ciepło ----
  {
    id: 'q5',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'power',
    text: 'Czy masz latarkę, zapasowe baterie i naładowany power bank w miejscu, które znajdziesz po ciemku?',
    options: ['Nie', 'Część z tego', 'Tak, wszystkie trzy'],
    gap: 'Brak latarki lub power banku pod ręką',
    fix: 'Włóż latarkę, zapasowe baterie i power bank do jednej szuflady. Latarka jest bezpieczniejsza niż świece, zwłaszcza przy dzieciach.',
    packPage: 'Lista zestawu awaryjnego',
  },
  {
    id: 'q15',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'power',
    text: 'Gdyby zimą przez kilka dni nie było prądu ani ogrzewania, czy macie jak utrzymać ciepło?',
    options: ['Nie', 'Trochę koców i ciepłych ubrań', 'Tak, koce lub śpiwory dla każdego i ciepłe ubrania'],
    gap: 'Brak sposobu na ciepło bez prądu',
    fix: 'Bez prądu może stanąć też ogrzewanie. Przygotujcie koc lub śpiwór dla każdego domownika i ciepłe ubrania. Przy awarii zbierzcie się w jednym pokoju i zamknijcie drzwi, tak łatwiej utrzymać ciepło.',
    packPage: null,
    variants: [
      {
        when: ['alone'],
        text: 'Gdyby zimą przez kilka dni nie było prądu ani ogrzewania, czy masz jak utrzymać ciepło?',
        options: ['Nie', 'Trochę koców i ciepłych ubrań', 'Tak, koc lub śpiwór i ciepłe ubrania'],
        fix: 'Bez prądu może stanąć też ogrzewanie. Przygotuj koc lub śpiwór i ciepłe ubrania. Przy awarii zostań w jednym pokoju i zamknij drzwi, tak łatwiej utrzymać ciepło.',
      },
      {
        when: ['house'],
        options: ['Nie', 'Tylko koce i ciepłe ubrania', 'Tak, mamy też źródło ciepła, które działa bez prądu'],
        fix: 'Wiele pieców i kotłów potrzebuje prądu do pompy i sterownika. Poradnik radzi mieć źródło ciepła, które działa bez prądu, np. kominek albo piecyk gazowy lub olejowy, a do tego koce i śpiwory dla każdego. Przy takim źródle ciepła potrzebna jest czujka czadu i regularne wietrzenie.',
      },
      {
        when: ['house', 'alone'],
        options: ['Nie', 'Tylko koce i ciepłe ubrania', 'Tak, mam też źródło ciepła, które działa bez prądu'],
      },
    ],
  },
  {
    id: 'q6',
    cost: 'free',
    tier: 'week',
    effort: '30 minut',
    area: 'power',
    text: 'Czy ktoś w domu wie, jak zakręcić wodę i gaz oraz wyłączyć prąd?',
    options: ['Nie', 'Tylko jedno lub dwa', 'Tak, wszystkie trzy'],
    gap: 'Nie wiadomo, jak zakręcić wodę i gaz lub wyłączyć prąd',
    fix: 'Znajdź główny zawór wody, zawór gazu i tablicę z bezpiecznikami. Poradnik radzi oznaczyć je kolorową taśmą i przećwiczyć wyłączanie.',
    packPage: 'Strona zaworów i wyłączników',
    variants: [
      { when: ['alone'], text: 'Czy wiesz, jak zakręcić wodę i gaz oraz wyłączyć prąd?' },
      {
        when: ['flat'],
        text: 'Czy wiesz, gdzie w mieszkaniu zakręca się wodę i gaz i gdzie są bezpieczniki?',
        fix: 'Zawór wody jest zwykle przy wodomierzu w łazience lub kuchni, zawór gazu przy kuchence albo liczniku, a bezpieczniki w skrzynce w przedpokoju lub na klatce. Poradnik radzi oznaczyć je kolorową taśmą i przećwiczyć wyłączanie. Główne zawory budynku ma administracja.',
      },
      {
        when: ['house'],
        fix: 'Znajdź główny zawór wody (zwykle przy wodomierzu, w piwnicy lub w studzience), zawór gazu i rozdzielnicę z bezpiecznikami. Poradnik radzi oznaczyć je kolorową taśmą i przećwiczyć wyłączanie.',
      },
      { when: ['group'], extra: 'Pokażcie je wszystkim dorosłym i starszym dzieciom.' },
    ],
  },

  // ---- Ogień i czad ----
  {
    id: 'q18',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'fire',
    text: 'Czy w domu jest działająca czujka dymu i czujka czadu?',
    options: ['Nie ma żadnej', 'Jest jedna albo nie wiem, czy działa', 'Tak, obie działają'],
    gap: 'Brak działającej czujki dymu lub czadu',
    fix: 'Czad nie ma zapachu ani koloru, a straż pożarna co zimę ostrzega przed zatruciami w domach. Kup czujkę dymu i czujkę czadu, zamontuj je według instrukcji producenta i regularnie sprawdzaj przyciskiem testu.',
    packPage: null,
    variants: [
      { when: ['flat'], extra: 'Czujka czadu jest szczególnie ważna, jeśli w mieszkaniu jest piecyk gazowy.' },
      { when: ['house'], extra: 'Czujka czadu jest szczególnie ważna przy piecu, kotle, kominku lub piecyku gazowym.' },
    ],
  },
  {
    id: 'q19',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'fire',
    text: 'Czy w domu jest gaśnica i koc gaśniczy?',
    options: ['Nie', 'Jedno z dwóch', 'Tak, oba, w znanym miejscu'],
    gap: 'Brak gaśnicy lub koca gaśniczego',
    fix: 'Poradnik zaleca mieć w domu gaśnicę i koc gaśniczy. Koc trzymaj w kuchni, w zasięgu ręki. Płonącego oleju na patelni nigdy nie gaś wodą: przykryj go pokrywką, kocem gaśniczym albo mokrą ścierką.',
    packPage: null,
  },

  // ---- Zdrowie i leki ----
  {
    id: 'q12',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'health',
    text: 'Czy w domu jest apteczka z lekami przeciwbólowymi, bandażami, opatrunkami i rękawiczkami?',
    options: ['Nie', 'Jest, ale niekompletna', 'Tak, kompletna i przejrzana'],
    gap: 'Niekompletna apteczka',
    fix: 'Uzupełnij apteczkę według listy z Poradnika: leki przeciwbólowe, przeciwzapalne, przeciwbiegunkowe i przeciwwymiotne, gaza, bandaże, opatrunki na oparzenia, rękawiczki, środek antyseptyczny, termometr, nożyczki, folia termiczna i opaska do tamowania krwotoków. Przy okazji sprawdź daty ważności.',
    packPage: null,
  },
  {
    id: 'q13',
    cost: 'shop',
    tier: 'month',
    effort: 'Jeden wieczór',
    area: 'health',
    text: 'Czy choroby, alergie i leki domowników są spisane na kartce, a leków przyjmowanych na stałe jest zapas na kilka dni?',
    hint: 'Jeśli nikt nie bierze leków na stałe, wystarczy spisana lista alergii i chorób.',
    options: ['Nie', 'Jedno z dwóch', 'Tak, oba'],
    gap: 'Choroby, alergie i leki nie są spisane',
    fix: 'Spisz dla każdego domownika choroby, alergie i leki z dawkami i trzymaj tę kartkę razem z dokumentacją medyczną. Przy następnej wizycie u lekarza poproś o receptę tak, żeby zawsze został zapas leków na kilka dni.',
    packPage: null,
    variants: [
      {
        when: ['alone'],
        text: 'Czy Twoje choroby, alergie i leki są spisane na kartce, a leków przyjmowanych na stałe masz zapas na kilka dni?',
        hint: 'Jeśli nie bierzesz leków na stałe, wystarczy spisana lista alergii i chorób.',
        fix: 'Spisz choroby, alergie i leki z dawkami i trzymaj tę kartkę razem z dokumentacją medyczną. Powiedz o nich komuś bliskiemu. Przy następnej wizycie u lekarza poproś o receptę tak, żeby zawsze został zapas leków na kilka dni.',
      },
    ],
  },
  {
    id: 'q14',
    cost: 'shop',
    tier: 'longer',
    effort: 'Jeden dzień',
    area: 'health',
    text: 'Czy ktoś w domu ma za sobą kurs pierwszej pomocy z ostatnich kilku lat?',
    options: ['Nie', 'Tak, ale dawno', 'Tak'],
    gap: 'Nikt nie ma aktualnego kursu pierwszej pomocy',
    fix: 'Poradnik przypomina, że w czasie kryzysu szpitale będą przeciążone, a udzielenie pierwszej pomocy to obowiązek każdego z nas. Kurs trwa zwykle kilka godzin i uczy pozycji bocznej, resuscytacji i użycia defibrylatora (AED). Zapytaj np. w PCK albo w lokalnej OSP.',
    packPage: null,
    variants: [
      {
        when: ['alone'],
        text: 'Czy masz za sobą kurs pierwszej pomocy z ostatnich kilku lat?',
        gap: 'Brak aktualnego kursu pierwszej pomocy',
      },
    ],
  },

  // ---- Ostrzeżenia i bliscy ----
  {
    id: 'q9',
    cost: 'free',
    tier: 'week',
    effort: '5 minut',
    area: 'warnings',
    text: 'Czy dowiesz się na czas o ostrzeżeniu przed powodzią, wichurą lub innym zagrożeniem?',
    options: ['Nie wiem', 'Tylko z alertów w telefonie', 'Tak, mam aplikację RSO i śledzę ostrzeżenia IMGW'],
    gap: 'Brak sprawdzonych źródeł ostrzeżeń',
    fix: 'Alert RCB przychodzi SMS-em na każdy telefon w zagrożonym rejonie. Warto też zainstalować bezpłatną aplikację Regionalny System Ostrzegania (RSO) i sprawdzać ostrzeżenia IMGW dla swojego powiatu.',
    packPage: null,
  },
  {
    id: 'q16',
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'warnings',
    text: 'Skąd się dowiesz, co się dzieje, gdy nie będzie prądu ani internetu?',
    options: ['Nie wiem', 'Z telefonu, dopóki ma baterię', 'Z radia na baterie lub na korbkę'],
    gap: 'Brak radia na baterie lub na korbkę',
    fix: 'Po usłyszeniu syreny Poradnik każe włączyć radio lub telewizor i słuchać komunikatów. Bez prądu zostaje radio na baterie lub na korbkę. Trzymaj je razem z latarką i zapasowymi bateriami.',
    packPage: null,
  },
  {
    id: 'q17',
    cost: 'free',
    tier: 'week',
    effort: '10 minut',
    area: 'warnings',
    text: 'Czy wiesz, jak brzmi syrena ogłaszająca alarm i gdzie jest najbliższe miejsce schronienia?',
    options: ['Nie', 'Jedno z dwóch', 'Tak, oba'],
    gap: 'Nie wiadomo, jak brzmi alarm i gdzie się schronić',
    fix: 'Ogłoszenie alarmu to ciągły, modulowany dźwięk syreny przez 3 minuty, a odwołanie to ciągły, jednostajny dźwięk przez 3 minuty. Najbliższe miejsce schronienia sprawdzisz w urzędzie gminy, w straży pożarnej albo na gov.pl/kgpsp. Jeśli nie ma go w pobliżu, wybierz w domu miejsce z dala od okien, przy ścianach nośnych.',
    packPage: null,
    variants: [{ when: ['flat'], extra: 'W bloku lepszą ochronę dają najniższe kondygnacje i piwnica.' }],
  },
  {
    id: 'q10',
    cost: 'free',
    tier: 'week',
    effort: '10 minut',
    area: 'warnings',
    text: 'Czy jesteście umówieni z sąsiadem lub kimś bliskim, że w razie problemów sprawdzicie, co u siebie słychać?',
    options: ['Nie', 'Tak, ale tylko luźno', 'Tak, wyraźnie się umówiliśmy'],
    gap: 'Nikt nie jest umówiony, że Was sprawdzi',
    fix: 'Wymień się numerami z sąsiadem lub kimś z rodziny i umówcie się, że przy dłuższej przerwie w prądzie sprawdzicie, co u siebie słychać.',
    packPage: 'Strona kontaktów alarmowych',
    variants: [
      {
        when: ['alone'],
        text: 'Czy jest ktoś, np. sąsiad lub ktoś z rodziny, kto w razie problemów sprawdzi, co u Ciebie słychać?',
        options: ['Nie', 'Tak, ale nie jesteśmy wyraźnie umówieni', 'Tak, jesteśmy umówieni'],
        gap: 'Nikt nie jest umówiony, że Cię sprawdzi',
      },
    ],
  },

  // ---- Szybkie opuszczenie domu ----
  {
    id: 'q7',
    cost: 'shop',
    tier: 'longer',
    effort: 'Popołudnie',
    area: 'leaving',
    text: 'Gdyby trzeba było wyjść z domu w 10 minut, czy każdy domownik ma gotowy plecak ewakuacyjny?',
    options: ['Nie', 'Jest jeden albo nie są kompletne', 'Tak, każdy ma swój'],
    gap: 'Brak gotowego plecaka ewakuacyjnego',
    fix: 'Poradnik radzi, żeby plecak miał każdy domownik, nawet dzieci. Zacznij od jednego przy drzwiach: woda, przekąski, latarka, power bank, leki, kopie dokumentów i gotówka. Kolejne dopakujesz przy następnych zakupach.',
    packPage: 'Lista do plecaka ewakuacyjnego',
    variants: [
      {
        when: ['alone'],
        text: 'Gdyby trzeba było wyjść z domu w 10 minut, czy plecak ewakuacyjny jest gotowy?',
        options: ['Nie', 'Częściowo', 'Tak'],
        fix: 'Spakuj plecak i postaw go przy drzwiach: woda, przekąski, latarka, power bank, leki, kopie dokumentów i gotówka.',
      },
    ],
  },
  {
    id: 'q8',
    cost: 'free',
    tier: 'week',
    effort: '30 minut',
    area: 'leaving',
    text: 'Czy dokumenty tożsamości, polisy i inne ważne papiery da się zabrać w minutę?',
    options: ['Nie', 'Część z nich', 'Tak, leżą razem'],
    gap: 'Ważne dokumenty leżą w różnych miejscach',
    fix: 'Włóż dowody osobiste, polisy i inne ważne papiery (albo ich kopie) do jednej teczki i trzymaj ją obok planu. Poradnik radzi mieć też kopie na pendrivie w plecaku ewakuacyjnym.',
    packPage: 'Strona z informacjami o domu',
    variants: [
      {
        when: ['kids'],
        fix: 'Włóż dowody osobiste, akty urodzenia dzieci i polisy (albo ich kopie) do jednej teczki i trzymaj ją obok planu. Poradnik radzi mieć też kopie na pendrivie w plecaku ewakuacyjnym.',
      },
    ],
  },
  {
    id: 'q20',
    askIf: ['pets'],
    cost: 'shop',
    tier: 'month',
    effort: 'Najbliższe zakupy',
    area: 'leaving',
    text: 'Czy dla zwierzęcia jest gotowy transporter lub smycz, zapas karmy na kilka dni i książeczka szczepień w jednym miejscu?',
    options: ['Nie', 'Częściowo', 'Tak'],
    gap: 'Zwierzę nie jest gotowe do ewakuacji',
    fix: 'Trzymaj w jednym miejscu książeczkę zdrowia, transporter lub smycz i kaganiec, a do tego karmę, wodę i leki na kilka dni. Poradnik radzi też zaczipować zwierzę i przypiąć do obroży numer telefonu do właściciela.',
    packPage: null,
  },
];

// Stare linki z wynikami miały 10 cyfr, po jednej na pytanie, w tej kolejności.
export const LEGACY_ORDER = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];

// Strona wyników grupuje wszystkie zaległe działania w te trzy progi. „W tym tygodniu” zawiera
// tylko działania, które nic nie kosztują, więc etykieta to fakt, a nie szacunek ceny.
// `cap` utrzymuje progi na tyle krótkie, by dało się je skończyć; nadmiar spada niżej.
export const AREA_STATUS = {
  sorted: 'Gotowe',          // komplet punktów
  partly: 'Częściowo',       // połowa lub więcej
  notYet: 'Jeszcze nie',     // poniżej połowy
  start: 'Zacznij tutaj',    // najsłabszy obszar, gdy też jest poniżej połowy
};

// Zdanie o zapasach liczone jest wyłącznie z odpowiedzi o jedzeniu i wodzie. Słabsza z dwóch
// wyznacza przedział: szafka pełna konserw nie pomoże bez wody.
export const MANAGE_QUESTIONS = ['q3', 'q4'];

export const MANAGE_BANDS = [
  { id: 'under-a-day', min: 0, text: 'mniej niż jeden dzień' },
  { id: 'about-a-day', min: 1, text: 'mniej więcej jeden dzień' },
  { id: 'a-few-days', min: 2, text: 'kilka dni', note: ' Poradnik bezpieczeństwa zaleca zapasy na minimum 3 dni.' },
];

export const MANAGE = {
  lead: 'Zapasy jedzenia i wody wystarczą Wam na',
  leadAlone: 'Zapasy jedzenia i wody wystarczą Ci na',
  sub: 'To orientacyjna ocena na podstawie Twoich odpowiedzi o jedzeniu i wodzie.',
  kitLabel: 'Policz zapasy dokładnie dla swojego domu',
};

export const AREAS_HEADING = 'Jak wygląda Twój dom';

export const TIERS = [
  { id: 'week', label: 'W tym tygodniu', note: 'Za darmo, każde zajmie mniej niż godzinę', cap: 3 },
  { id: 'month', label: 'W tym miesiącu', note: 'Pozostałe, od najważniejszych', cap: 6 },
  { id: 'longer', label: 'W dłuższej perspektywie', note: 'Większe zadania i regularne przeglądy' },
];

// Zawsze dopisywane do ostatniego progu, niezależnie od wyniku. Tych rzeczy quiz nie sprawdza,
// a to one utrzymują plan w dobrym stanie, więc nawet komplet punktów zostawia coś do zrobienia.
export const STANDING_ACTIONS = [
  {
    id: 'drill',
    gap: 'Zróbcie jeden wieczór próbny bez prądu',
    fix: 'Wybierzcie wieczór, wyłączcie światło na godzinę i zobaczcie, po co każdy sięga. Tak najszybciej widać, czego brakuje w zapasach. Dzieci zwykle traktują to jak przygodę.',
    effort: 'Jeden wieczór',
    area: null,
    packPage: null,
  },
  {
    id: 'review',
    gap: 'Zaplanuj przegląd zapasów przy zmianie czasu',
    fix: 'Dwa razy w roku, przy zmianie czasu, sprawdź daty ważności jedzenia, wody, baterii i leków. Przeczytajcie też razem plan, żeby wszyscy go pamiętali.',
    effort: 'Dwa razy w roku',
    area: null,
    packPage: null,
  },
];

export const BANDS = [
  {
    id: 'starting',
    min: 0,
    label: 'Początek drogi',
    summary: 'Tu zaczyna większość domów. Każdy krok poniżej jest mały i da się go zrobić przy okazji.',
    cta: 'Pakiet przeprowadzi Cię przez wszystkie te kroki, strona po stronie.',
    course: {
      lead: true,
      heading: 'Wolisz przejść przez to z przewodnikiem?',
      text: 'Braków jest kilka i sama lista rzadko wystarcza, żeby je uzupełnić. Kurs „Gotowi w 30 dni” prowadzi od miejsca, w którym jesteś teraz, jednym krótkim krokiem w tygodniu: woda, ciepło i światło, jedzenie i leki, plan na wypadek, gdy telefony nie działają, a na koniec próbny wieczór bez prądu i wydrukowany plan.',
    },
  },
  {
    id: 'partly',
    min: 40,
    label: 'W połowie drogi',
    summary: 'Część podstaw jest już gotowa. Pozostałe braki uzupełnisz szybko.',
    cta: 'Pakiet pomoże uzupełnić te braki i zebrać wszystko na papierze.',
    course: {
      lead: false,
      heading: 'Zostały rzeczy, które najłatwiej odłożyć',
      text: 'Łatwiejsza połowa jest za Tobą. Kurs „Gotowi w 30 dni” obejmuje to, co zwykle zostaje na później: wymianę zapasów, plan na wypadek, gdy telefony nie działają, i jeden próbny wieczór bez prądu.',
    },
  },
  {
    id: 'well',
    min: 75,
    label: 'Dom dobrze przygotowany',
    summary: 'Większość podstaw jest już gotowa.',
    cta: 'Najtrudniejsze za Tobą. Przenieś plan na papier, żeby był pod ręką, gdy zabraknie prądu.',
    course: {
      lead: false,
      heading: 'Czy domownicy poradzą sobie bez Ciebie?',
      text: 'Kurs „Gotowi w 30 dni” pomaga przekazać plan reszcie rodziny. Chodzi o to, żeby każdy domownik wiedział, co robić, nawet gdy Ciebie nie ma w domu, i żeby wszystko było spisane na papierze.',
    },
  },
];

export const BENCHMARK = {
  text: 'Rządowy Poradnik bezpieczeństwa zaleca, by każdy dom miał zapasy wody, jedzenia i leków na minimum 3 dni.',
  url: 'https://www.gov.pl/poradnikbezpieczenstwa',
};
